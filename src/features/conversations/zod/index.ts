import { z } from 'zod';

export const ConversationTranscriptSchema = z
  .array(
    z
      .object({
        role: z.enum(['user', 'agent']).catch('user'),
        message: z.string().optional().catch(''),
        time_in_call_secs: z.number().optional().catch(0),
      })
      .passthrough()
  )
  .optional()
  .default([]);

export const StandupResponseSchema = z
  .object({
    data_collection_id: z.literal('standup_responses'),
    value: z.string().optional().default(''),
    json_schema: z
      .object({
        type: z
          .enum(['string', 'number', 'boolean', 'object', 'array'])
          .catch('string'),
        description: z.string().optional().default(''),
      })
      .passthrough(),
    rationale: z.string().optional().default(''),
  })
  .passthrough();

export const SentimentSchema = z
  .object({
    data_collection_id: z.literal('sentiment'),
    value: z.enum(['Positive', 'Negative', 'Neutral']).catch('Neutral'),
    json_schema: z
      .object({
        type: z
          .enum(['string', 'number', 'boolean', 'object', 'array'])
          .catch('string'),
        description: z.string().optional().default(''),
      })
      .passthrough(),
    rationale: z.string().optional().default(''),
  })
  .passthrough();

export const BlockersSchema = z
  .object({
    data_collection_id: z.literal('blockers'),
    value: z.string().optional().default(''),
    json_schema: z
      .object({
        type: z
          .enum(['string', 'number', 'boolean', 'object', 'array'])
          .catch('string'),
        description: z.string().optional().default(''),
      })
      .passthrough(),
    rationale: z.string().optional().default(''),
  })
  .passthrough();

export const EngagementLevelSchema = z
  .object({
    data_collection_id: z.literal('engagement_level'),
    value: z
      .enum([
        'Highly Engaged',
        'Moderately Engaged',
        'Low Engagement',
        'Unclear',
      ])
      .catch('Unclear'),
    json_schema: z
      .object({
        type: z
          .enum(['string', 'number', 'boolean', 'object', 'array'])
          .catch('string'),
        description: z.string().optional().default(''),
      })
      .passthrough(),
    rationale: z.string().optional().default(''),
  })
  .passthrough();

export const FollowUpActionsSchema = z
  .object({
    data_collection_id: z.literal('follow_up_actions'),
    value: z
      .enum(['Notify Manager', 'Schedule Follow-up', 'Re-run Standup', 'None'])
      .catch('None'),
    json_schema: z
      .object({
        type: z
          .enum(['string', 'number', 'boolean', 'object', 'array'])
          .catch('string'),
        description: z.string().optional().default(''),
      })
      .passthrough(),
    rationale: z.string().optional().default(''),
  })
  .passthrough();

export const ConversationDataSchema = z
  .object({
    blockers: BlockersSchema.optional(),
    engagement_level: EngagementLevelSchema.optional(),
    follow_up_actions: FollowUpActionsSchema.optional(),
    sentiment: SentimentSchema.optional(),
    standup_responses: StandupResponseSchema.optional(),
  })
  .passthrough();

export const ConversationAnalysisSchema = z
  .object({
    call_successful: z
      .enum(['success', 'failure', 'unknown'])
      .catch('unknown')
      .describe('The success of the call'),
    transcript_summary: z
      .string()
      .optional()
      .default('')
      .describe('A summary of the transcript'),
    data_collection_results: ConversationDataSchema.optional().default({}),
    evaluation_criteria_results: z
      .record(
        z.literal('verify_standup_completion'),
        z
          .object({
            criteria_id: z.string().optional(),
            result: z.enum(['success', 'failure', 'unknown']).catch('unknown'),
            rationale: z.string().optional().default(''),
          })
          .passthrough()
      )
      .optional()
      .default({})
      .describe('The evaluation results of the call'),
  })
  .passthrough();

export const ConversationSchema = z
  .object({
    conversation_id: z.string().optional(),
    agent_id: z.string().optional(),
    status: z
      .enum(['pending', 'done', 'failed'])
      .catch('pending')
      .describe('The status of the conversation'),
    transcript: ConversationTranscriptSchema.optional().default([]),
    analysis: ConversationAnalysisSchema.optional().default({}),
  })
  .passthrough();
