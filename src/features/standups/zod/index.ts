import { z } from 'zod';

export const AiSentimentAnalysisSchema = z.object({
  sentimentScore: z
    .string()
    .min(1)
    .max(100)
    .describe('The sentiment score of the response'),
  confidenceScore: z
    .string()
    .min(1)
    .max(100)
    .describe('The confidence score of the sentiment'),
  emotion: z
    .enum(['happy', 'frustrated', 'confident', 'burnout', 'neutral'])
    .describe('The emotion of the response'),
});

export const AiResponseSchema = z.object({
  question: z.string().describe('The question that was asked'),
  response: z.string().describe('The response to the question'),
  sentiment: AiSentimentAnalysisSchema.describe(
    'The sentiment analysis of the response'
  ),
  tone: z
    .enum(['confident', 'hesitant', 'frustrated', 'excited'])
    .describe(
      'The tone of the response. Only choose one of the possible values from the list (confident, hesitant, frustrated, excited).'
    ),
});

export const AiActionSchema = z.object({
  actionType: z
    .enum(['notify_manager', 'schedule_followup', 're_run_standup'])
    .describe('The type of action to take'),
  actionTitle: z.string().describe('The title of the action to take'),
  actionSummary: z.string().describe('A short summary of the action to take'),
  triggeredBy: z
    .enum(['AI', 'manager'])
    .describe('The entity that triggered the action'),
});

export const AiBlockerSchema = z.object({
  blocker: z.string().describe('The blocker that was identified'),
  sentiment: AiSentimentAnalysisSchema.describe(
    'The sentiment analysis of the blocker'
  ),
  linearIssue: z
    .string()
    .nullable()
    .describe(
      'The linear issue ID of the blocker, if you are able to identify it. Otherwise, return null.'
    ),
  linearProject: z
    .string()
    .nullable()
    .describe(
      'The linear project ID of the blocker, if you are able to identify it. Otherwise, return null.'
    ),
});

export const AiStandupSchema = z.object({
  engagementLevel: z
    .enum(['Highly Engaged', 'Moderately Engaged', 'Low Engagement', 'Unclear'])
    .describe('The engagement level of the standup'),
  status: z
    .enum(['success', 'failure', 'unknown'])
    .describe('The status of the standup'),
  overallSentiment: z
    .enum(['positive', 'neutral', 'negative'])
    .describe(
      'The overall sentiment of the standup. Please convert the conversation value to return positive, negative, or neutral in lowercase.'
    ),
  summary: z.string().describe('A summary of the standup'),
  blockers: z
    .array(AiBlockerSchema)
    .describe('The blockers that were identified'),
  responses: z
    .array(AiResponseSchema)
    .describe('The responses to the questions'),
  actions: z
    .array(AiActionSchema)
    .describe('The actions to take based on the standup'),
  transcriptHighlights: z
    .array(z.string())
    .describe(
      'The highlights of the standup. Please only return the most important points.'
    ),
});
