export type TranscriptEntry = {
  role: 'user' | 'assistant';
  timeInCallSecs: number;
  message: string;
};

type Result = 'success' | 'failure' | 'unknown';

type DataResult = {
  dataCollectionId: string;
  rationale: string;
  value: string | number | boolean;
};

type EvaluationResult = {
  criteriaId: string;
  rationale: string;
  result: Result;
};

export type ConversationAnalysis = {
  callSuccessful: Result;
  transcriptSummary?: string;
  evaluationResults?: EvaluationResult[];
  dataResults?: DataResult[];
};

export type ConversationTranscript = TranscriptEntry[];
