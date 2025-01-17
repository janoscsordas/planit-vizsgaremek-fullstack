CREATE TABLE "chat_conversations" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" text PRIMARY KEY NOT NULL,
	"conversation_id" text NOT NULL,
	"user_id" text NOT NULL,
	"user_input" text NOT NULL,
	"bot_response" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_message_counts" (
	"user_id" text NOT NULL,
	"date" timestamp with time zone DEFAULT now() NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "daily_message_counts_user_id_date_pk" PRIMARY KEY("user_id","date")
);
--> statement-breakpoint
CREATE TABLE "project_issue_replies" (
	"id" text PRIMARY KEY NOT NULL,
	"issue_id" integer NOT NULL,
	"reply" text NOT NULL,
	"replied_at" timestamp with time zone DEFAULT now() NOT NULL,
	"replied_by" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_issues" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"issue_name" text NOT NULL,
	"issue_description" text NOT NULL,
	"task_issue_id" text,
	"is_open" boolean DEFAULT true NOT NULL,
	"replies" integer DEFAULT 0 NOT NULL,
	"labels" jsonb,
	"opened_at" timestamp with time zone DEFAULT now() NOT NULL,
	"opened_by" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project_members" RENAME COLUMN "new_role" TO "role";--> statement-breakpoint
ALTER TABLE "project_tasks" ADD COLUMN "created_by" text NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "nameChanged" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "chat_conversations" ADD CONSTRAINT "chat_conversations_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_conversation_id_chat_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."chat_conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_message_counts" ADD CONSTRAINT "daily_message_counts_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_issue_replies" ADD CONSTRAINT "project_issue_replies_issue_id_project_issues_id_fk" FOREIGN KEY ("issue_id") REFERENCES "public"."project_issues"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_issue_replies" ADD CONSTRAINT "project_issue_replies_replied_by_user_id_fk" FOREIGN KEY ("replied_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_issues" ADD CONSTRAINT "project_issues_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_issues" ADD CONSTRAINT "project_issues_task_issue_id_project_tasks_id_fk" FOREIGN KEY ("task_issue_id") REFERENCES "public"."project_tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_issues" ADD CONSTRAINT "project_issues_opened_by_user_id_fk" FOREIGN KEY ("opened_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_tasks" ADD CONSTRAINT "project_tasks_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;