import { getStandup } from '@/features/standups/api';

export type ConversationMessage = {
  source: 'ai' | 'user';
  message: string;
};

export type StandupWithRelations = Awaited<ReturnType<typeof getStandup>>;
