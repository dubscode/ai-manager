import { db } from '@/db';
import { conversations } from '@/db/schema';
import { client as elevenLabs } from '@/lib/11labs';
import { eq } from 'drizzle-orm';
import { inngest } from './index';

export const updateConversation = inngest.createFunction(
  { id: 'update-conversation' },
  { event: 'conversation/update' },
  async ({ event, step, logger }) => {
    await step.sleep('wait-a-moment', '60 seconds');

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

    return updatedConversation;
  }
);
