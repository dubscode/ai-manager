import { AiStandupSchema } from '@/features/standups/zod';
import { ConversationSchema } from '@/features/conversations/zod';
import { createAzure } from '@ai-sdk/azure';
import { generateObject } from 'ai';
import { mistral } from '@ai-sdk/mistral';
import { z } from 'zod';

export const mistralLarge = mistral('ministral-8b-latest');

const azure = createAzure({
  baseURL: `${process.env.AZURE_OPENAI_API_ENDPOINT}openai/deployments`,
  apiKey: process.env.AZURE_OPENAI_API_KEY,
});

export const gpt4o = azure('gpt-4o');
export const gpt4oMini = azure('gpt-4o-mini');

// Analyze analysis results from Eleven Labs conversation and update the standup record
export const analyzeConversation = async (
  conversation: z.infer<typeof ConversationSchema>
) => {
  const analysis = await generateObject({
    model: gpt4o,
    schema: AiStandupSchema,
    prompt: `
    # Task
    Analyze the provided conversation and extract relevant information into a structured JSON object following the schema.
    Your purpose it to convert the conversation values into our desired schema. Please pay special attention and ensure you match the schema types and enums.

    # Input Data
    Conversation: ${JSON.stringify(conversation)}

    # Schema Requirements

    1. Overall Sentiment:
    - Map directly from sentiment.value to overallSentiment
    - Values: "Positive", "Neutral", or "Negative"

    2. Summary:
    - Use transcript_summary for the summary field

    3. Responses:
    - Extract from standup_responses.value
    - Structure each response with:
      * question: Use json_schema.description from standup_responses
      * response: Use the value field
      * sentiment: Generate scores based on AI analysis
        - sentimentScore (1-100)
        - confidenceScore (1-100)
      * emotion: Map from sentiment.value:
        - "Positive" → "happy" or "confident"
        - "Negative" → "frustrated" or "burnout"
        - "Neutral" → "neutral"
      * tone: Infer from sentiment rationale and message style
        - Valid values: "confident", "hesitant", "frustrated", "excited"

    4. Actions:
    - Extract from follow_up_actions.value
    - Map actions as follows:
      * "Notify Manager" → {"actionType": "notify_manager", "triggeredBy": "AI"}
      * "Schedule Follow-up" → {"actionType": "schedule_followup", "triggeredBy": "AI"}
      * "Re-run Standup" → {"actionType": "re_run_standup", "triggeredBy": "AI"}

    # Important Notes
    - Ensure consistency between sentiment, responses, and actions
    - Provide a logical and cohesive summary of the standup
    - All fields must strictly follow the schema types and enums
    `,
  });

  console.log('AI Analysis', JSON.stringify(analysis.object, null, 2));

  return analysis;
};
