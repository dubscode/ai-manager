import type {
  ConversationAnalysis,
  ConversationTranscript,
} from '@/features/conversations/types';
import {
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';

import { encryptedText } from './encrypted-text';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey().notNull(),
  email: text('email').unique().notNull(),
  name: text('name').notNull(),
  role: text('role', { enum: ['developer', 'manager'] }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  managerEmail: text('manager_email'),
  linearApiKey: encryptedText('linear_api_key'),
});

// Define users relations
export const usersRelations = relations(users, ({ many }) => ({
  standups: many(standups),
}));

// Standups table
export const standups = pgTable('standups', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  conversationId: text('conversation_id').references(() => conversations.id, {
    onDelete: 'cascade',
  }),
  status: text('status', {
    enum: ['scheduled', 'in_progress', 'completed', 'missed'],
  }).notNull(),
  startTime: timestamp('start_time').defaultNow(),
  endTime: timestamp('end_time'),
  summary: text('summary'),
  overallSentiment: text('overall_sentiment', {
    enum: ['positive', 'neutral', 'negative'],
  }),
  transcriptHighlights: jsonb('transcript_highlights')
    .$type<string[]>()
    .default([]),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define standups relations
export const standupsRelations = relations(standups, ({ one, many }) => ({
  user: one(users, {
    fields: [standups.userId],
    references: [users.id],
  }),
  blockers: many(blockers),
  actions: many(actions),
  responses: many(responses),
}));

// Responses table
export const responses = pgTable(
  'responses',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    standupId: uuid('standup_id')
      .references(() => standups.id, { onDelete: 'cascade' })
      .notNull(),
    question: text('question').notNull(),
    response: text('response').notNull(),
    sentimentScore: text('sentiment_score').notNull(),
    confidenceScore: text('confidence_score').notNull(),
    sentiment: text('sentiment', {
      enum: [
        'burnout',
        'confident',
        'frustrated',
        'happy',
        'negative',
        'neutral',
        'positive',
      ],
    }),
    tone: text('tone', {
      enum: ['confident', 'hesitant', 'frustrated', 'excited'],
    }),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [
    unique('standup_question_unique').on(table.standupId, table.question),
  ]
);

// Blockers table
export const blockers = pgTable(
  'blockers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    standupId: uuid('standup_id')
      .references(() => standups.id, { onDelete: 'cascade' })
      .notNull(),
    blocker: text('blocker').notNull(),
    sentimentScore: text('sentiment_score').notNull(),
    confidenceScore: text('confidence_score').notNull(),
    emotion: text('emotion', {
      enum: ['happy', 'frustrated', 'confident', 'burnout', 'neutral'],
    }).notNull(),
    linearIssue: text('linear_issue'),
    linearProject: text('linear_project'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [
    unique('standup_blocker_unique').on(table.standupId, table.blocker),
  ]
);

// Actions table
export const actions = pgTable(
  'actions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    standupId: uuid('standup_id')
      .references(() => standups.id, { onDelete: 'cascade' })
      .notNull(),
    actionType: text('action_type', {
      enum: ['notify_manager', 'schedule_followup', 're_run_standup'],
    }),
    actionTitle: text('action_title'),
    actionSummary: text('action_summary'),
    triggeredBy: text('triggered_by', { enum: ['AI', 'manager'] }),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [
    unique('standup_action_unique').on(table.standupId, table.actionType),
  ]
);

export const conversations = pgTable('conversations', {
  id: text('id').primaryKey().notNull(),
  agentId: text('agent_id').notNull(),
  status: text('status', { enum: ['processing', 'done'] }).notNull(),
  transcript: jsonb('transcript').$type<ConversationTranscript>().default([]),
  analysis: jsonb('analysis').$type<ConversationAnalysis>(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define relations
export const blockersRelations = relations(blockers, ({ one }) => ({
  standup: one(standups, {
    fields: [blockers.standupId],
    references: [standups.id],
  }),
}));

export const actionsRelations = relations(actions, ({ one }) => ({
  standup: one(standups, {
    fields: [actions.standupId],
    references: [standups.id],
  }),
}));

export const responsesRelations = relations(responses, ({ one }) => ({
  standup: one(standups, {
    fields: [responses.standupId],
    references: [standups.id],
  }),
}));
