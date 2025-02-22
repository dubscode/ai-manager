import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey().notNull(),
  email: text('email').unique().notNull(),
  name: text('name').notNull(),
  role: text('role', { enum: ['developer', 'manager'] }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Standups table
export const standups = pgTable('standups', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  status: text('status', {
    enum: ['scheduled', 'in_progress', 'completed', 'missed'],
  }).notNull(),
  startTime: timestamp('start_time').defaultNow(),
  endTime: timestamp('end_time'),
  summary: text('summary'),
  overallSentiment: text('overall_sentiment', {
    enum: ['positive', 'neutral', 'negative'],
  }),
  createdAt: timestamp('created_at').defaultNow(),
});

// Responses table
export const responses = pgTable('responses', {
  id: uuid('id').primaryKey().defaultRandom(),
  standupId: uuid('standup_id')
    .references(() => standups.id, { onDelete: 'cascade' })
    .notNull(),
  question: text('question').notNull(),
  response: text('response').notNull(),
  sentiment: text('sentiment', { enum: ['positive', 'neutral', 'negative'] }),
  tone: text('tone', {
    enum: ['confident', 'hesitant', 'frustrated', 'excited'],
  }),
  createdAt: timestamp('created_at').defaultNow(),
});

// Sentiment Analysis table
export const sentimentAnalysis = pgTable('sentiment_analysis', {
  id: uuid('id').primaryKey().defaultRandom(),
  responseId: uuid('response_id')
    .references(() => responses.id, { onDelete: 'cascade' })
    .notNull(),
  sentimentScore: text('sentiment_score').notNull(),
  confidenceScore: text('confidence_score').notNull(),
  emotion: text('emotion', {
    enum: ['happy', 'frustrated', 'confident', 'burnout', 'neutral'],
  }),
  createdAt: timestamp('created_at').defaultNow(),
});

// Actions table
export const actions = pgTable('actions', {
  id: uuid('id').primaryKey().defaultRandom(),
  standupId: uuid('standup_id')
    .references(() => standups.id, { onDelete: 'cascade' })
    .notNull(),
  actionType: text('action_type', {
    enum: ['notify_manager', 'schedule_followup', 're_run_standup'],
  }),
  triggeredBy: text('triggered_by', { enum: ['AI', 'manager'] }),
  createdAt: timestamp('created_at').defaultNow(),
});
