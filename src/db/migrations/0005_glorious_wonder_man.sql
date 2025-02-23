CREATE TABLE "blockers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"standup_id" uuid NOT NULL,
	"blocker" text NOT NULL,
	"sentiment_score" text NOT NULL,
	"confidence_score" text NOT NULL,
	"emotion" text NOT NULL,
	"linear_issue" text,
	"linear_project" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "standup_blocker_unique" UNIQUE("standup_id","blocker")
);
--> statement-breakpoint
ALTER TABLE "sentiment_analysis" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "sentiment_analysis" CASCADE;--> statement-breakpoint
ALTER TABLE "conversations" ALTER COLUMN "transcript" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "responses" ADD COLUMN "sentiment_score" text NOT NULL;--> statement-breakpoint
ALTER TABLE "responses" ADD COLUMN "confidence_score" text NOT NULL;--> statement-breakpoint
ALTER TABLE "standups" ADD COLUMN "transcript_highlights" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "blockers" ADD CONSTRAINT "blockers_standup_id_standups_id_fk" FOREIGN KEY ("standup_id") REFERENCES "public"."standups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "actions" ADD CONSTRAINT "standup_action_unique" UNIQUE("standup_id","action_type");--> statement-breakpoint
ALTER TABLE "responses" ADD CONSTRAINT "standup_question_unique" UNIQUE("standup_id","question");