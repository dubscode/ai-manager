import {
  actions,
  blockers,
  conversations,
  responses,
  standups,
} from '@/db/schema';

import { ConversationSchema } from '@/features/conversations/zod';
import { analyzeConversation } from '@/lib/ai';
import { db } from '@/db';
import { client as elevenLabs } from '@/lib/11labs';
import { eq } from 'drizzle-orm';
import { inngest } from './index';
import { sendManagerEmail } from '@/lib/email';

export const updateConversation = inngest.createFunction(
  { id: 'update-conversation' },
  { event: 'conversation/update' },
  async ({ event, step, logger }) => {
    await step.sleep('wait-a-moment', '2 seconds');

    const { conversationId } = event.data as { conversationId: string };

    logger.info('Updating conversation', { conversationId });

    const conversation = await step.run(
      'get-eleven-labs-conversation',
      async () => {
        const conversation = await elevenLabs.conversationalAi.getConversation(
          conversationId
        );
        return conversation;
      }
    );

    logger.info('Conversation', { conversation });

    if (conversation.status === 'processing') {
      logger.info('Conversation is still processing, sending back to queue');
      const resend = await step.sendEvent('conversation/update', {
        name: 'conversation/update',
        data: event.data,
      });

      return {
        conversationId,
        message: 'Conversation is still processing, sending back to queue',
        resent: resend.ids,
      };
    }

    const updatedConversation = await step.run(
      'update-db-conversation',
      async () => {
        const transcript = conversation.transcript?.map((entry) => ({
          role: entry.role,
          message: entry.message ?? '',
          timeInCallSecs: entry.time_in_call_secs ?? 0,
        }));

        const [updatedConversation] = await db
          .update(conversations)
          .set({
            status: conversation.status,
            transcript,
            analysis: {
              callSuccessful:
                conversation.analysis?.call_successful ?? 'unknown',
              transcriptSummary:
                conversation.analysis?.transcript_summary ?? undefined,
              evaluationResults:
                conversation.analysis?.evaluation_criteria_results ?? undefined,
              dataResults:
                conversation.analysis?.data_collection_results ?? undefined,
            },
          })
          .where(eq(conversations.id, conversationId))
          .returning();

        return updatedConversation;
      }
    );

    logger.info('Updated conversation', { updatedConversation });

    const standupAnalysis = await step.run('analyze-conversation', async () => {
      const analysis = await analyzeConversation(
        ConversationSchema.parse(conversation)
      );
      return analysis.object;
    });

    logger.info('Standup analysis', { standupAnalysis });

    // Update standup record with summary, sentiment, and highlights
    const updatedStandup = await step.run('update-standup', async () => {
      const [standup] = await db
        .update(standups)
        .set({
          status: 'completed',
          endTime: new Date(),
          summary: standupAnalysis.summary,
          overallSentiment: standupAnalysis.overallSentiment,
          transcriptHighlights: standupAnalysis.transcriptHighlights,
        })
        .where(eq(standups.conversationId, conversationId))
        .returning();
      return standup;
    });

    // Upsert responses and their sentiment analysis
    const responseRecords = await step.run('upsert-responses', async () => {
      const responsePromises = standupAnalysis.responses.map(
        async (response) => {
          const [newResponse] = await db
            .insert(responses)
            .values({
              standupId: updatedStandup.id,
              question: response.question,
              response: response.response,
              sentiment: response.sentiment.emotion,
              tone: response.tone,
              sentimentScore: response.sentiment.sentimentScore,
              confidenceScore: response.sentiment.confidenceScore,
            })
            .onConflictDoUpdate({
              target: [responses.standupId, responses.question],
              set: {
                response: response.response,
                sentiment: response.sentiment.emotion,
                tone: response.tone,
                sentimentScore: response.sentiment.sentimentScore,
                confidenceScore: response.sentiment.confidenceScore,
              },
            })
            .returning();

          return newResponse;
        }
      );

      return Promise.all(responsePromises);
    });

    // Upsert blockers
    const blockerRecords = await step.run('upsert-blockers', async () => {
      if (!standupAnalysis.blockers?.length) return [];

      const blockerPromises = standupAnalysis.blockers.map(async (blocker) => {
        const [newBlocker] = await db
          .insert(blockers)
          .values({
            standupId: updatedStandup.id,
            blocker: blocker.blocker,
            sentimentScore: blocker.sentiment.sentimentScore,
            confidenceScore: blocker.sentiment.confidenceScore,
            emotion: blocker.sentiment.emotion,
            linearIssue: blocker.linearIssue,
            linearProject: blocker.linearProject,
          })
          .onConflictDoUpdate({
            target: [blockers.standupId, blockers.blocker],
            set: {
              sentimentScore: blocker.sentiment.sentimentScore,
              confidenceScore: blocker.sentiment.confidenceScore,
              emotion: blocker.sentiment.emotion,
              linearIssue: blocker.linearIssue,
              linearProject: blocker.linearProject,
            },
          })
          .returning();
        return newBlocker;
      });

      return Promise.all(blockerPromises);
    });

    // Upsert any recommended actions
    const actionRecords = await step.run('insert-actions', async () => {
      if (!standupAnalysis.actions?.length) return [];

      const actionPromises = standupAnalysis.actions.map(async (action) => {
        const [newAction] = await db
          .insert(actions)
          .values({
            standupId: updatedStandup.id,
            actionType: action.actionType,
            actionTitle: action.actionTitle,
            actionSummary: action.actionSummary,
            triggeredBy: action.triggeredBy,
          })
          .onConflictDoUpdate({
            target: [actions.standupId, actions.actionType],
            set: {
              actionTitle: action.actionTitle,
              actionSummary: action.actionSummary,
              triggeredBy: action.triggeredBy,
            },
          })
          .returning();
        return newAction;
      });

      return Promise.all(actionPromises);
    });

    logger.info('Database updates complete', {
      standup: updatedStandup,
      responses: responseRecords,
      blockers: blockerRecords,
      actions: actionRecords,
    });

    // Trigger manager notification if there are any blockers, if sentiment is negative, or if there's a notify_manager action
    if (
      blockerRecords.length > 0 ||
      updatedStandup.overallSentiment === 'negative' ||
      actionRecords.some((action) => action.actionType === 'notify_manager')
    ) {
      await step.sendEvent('manager/notify', {
        name: 'manager/notify',
        data: {
          standupId: updatedStandup.id,
          userId: updatedStandup.userId,
        },
      });
    }

    return { updatedConversation, standupAnalysis };
  }
);

export const notifyManager = inngest.createFunction(
  { id: 'notify-manager' },
  { event: 'manager/notify' },
  async ({ event, step, logger }) => {
    const { standupId, userId } = event.data as {
      standupId: string;
      userId: string;
    };

    logger.info('Notifying manager about standup', { standupId, userId });

    // Get the standup data with user info using Drizzle query
    const standup = await step.run('get-standup-data', async () => {
      return db.query.standups.findFirst({
        where: eq(standups.id, standupId),
        with: {
          user: true,
          blockers: true,
          actions: true,
        },
      });
    });

    if (!standup) {
      logger.error('Standup not found', { standupId });
      return { error: 'Standup not found' };
    }

    if (!standup.user.managerEmail) {
      logger.error('Manager email not set for user', { userId });
      return { error: 'Manager email not set' };
    }

    // Prepare email content
    const emailContent = await step.run('prepare-email', async () => {
      const highlights =
        standup.transcriptHighlights?.join('\n• ') || 'No highlights available';
      const blockersText =
        standup.blockers.length > 0
          ? standup.blockers.map((b) => `• ${b.blocker}`).join('\n')
          : 'No blockers reported';
      const actionsText =
        standup.actions.length > 0
          ? standup.actions
              .map((a) => `• ${a.actionTitle}: ${a.actionSummary}`)
              .join('\n')
          : 'No actions required';

      // Format date and time in Pacific Time
      const standupDate = standup.createdAt
        ? new Date(standup.createdAt)
        : new Date();
      const ptDate = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Los_Angeles',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short',
      }).format(standupDate);

      const text = `
        Standup Summary for ${standup.user.name}
        Date: ${ptDate}

        Overall Sentiment: ${standup.overallSentiment || 'Not available'}

        Summary:
        ${standup.summary || 'No summary available'}

        Key Highlights:
        • ${highlights}

        Blockers:
        ${blockersText}

        Recommended Actions:
        ${actionsText}

        View full details in the AI Manager dashboard.
      `.trim();

      const html = `
        <h2>Standup Summary for ${standup.user.name}</h2>
        <p><strong>Date:</strong> ${ptDate}</p>

        <p><strong>Overall Sentiment:</strong> ${
          standup.overallSentiment || 'Not available'
        }</p>

        <h3>Summary:</h3>
        <p>${standup.summary || 'No summary available'}</p>

        <h3>Key Highlights:</h3>
        <ul>
          ${
            standup.transcriptHighlights
              ?.map((h) => `<li>${h}</li>`)
              .join('\n  ') || '<li>No highlights available</li>'
          }
        </ul>

        <h3>Blockers:</h3>
        <ul>
          ${
            standup.blockers.length > 0
              ? standup.blockers
                  .map((b) => `<li>${b.blocker}</li>`)
                  .join('\n  ')
              : '<li>No blockers reported</li>'
          }
        </ul>

        <h3>Recommended Actions:</h3>
        <ul>
          ${
            standup.actions.length > 0
              ? standup.actions
                  .map(
                    (a) =>
                      `<li><strong>${a.actionTitle}:</strong> ${a.actionSummary}</li>`
                  )
                  .join('\n  ')
              : '<li>No actions required</li>'
          }
        </ul>

        <p><a href="https://aimgr.dev/dashboard">View full details in the AI Manager dashboard</a></p>
      `.trim();

      return { text, html };
    });

    // Send the email
    const emailResult = await step.run('send-email', async () => {
      return sendManagerEmail({
        to: standup.user.managerEmail!,
        subject: `Standup Summary for ${standup.user.name}`,
        text: emailContent.text,
        html: emailContent.html,
      });
    });

    logger.info('Email sent to manager', { result: emailResult });

    return { success: true, emailResult };
  }
);
