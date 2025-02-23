export type TranscriptEntry = {
  role: 'user' | 'assistant';
  timeInCallSecs: number;
  message: string;
};

type Result = 'success' | 'failure' | 'unknown';

export type ConversationAnalysis = {
  callSuccessful: Result;
  transcriptSummary?: string;
  evaluationResults?: {
    [x: string]: {
      criteria_id: string;
      result: Result;
      rationale: string;
    };
  };
  dataResults?: {
    [x: string]: {
      rationale: string;
      data_collection_id: string;
      value?: unknown;
    };
  };
};

export type ConversationTranscript = {
  role: 'user' | 'agent';
  timeInCallSecs: number;
  message: string;
}[];
