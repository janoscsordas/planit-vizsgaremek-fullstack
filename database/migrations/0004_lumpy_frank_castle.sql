ALTER TABLE "project_members" ALTER COLUMN "addedAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project_task_assigns" ALTER COLUMN "task_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project_task_assigns" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "tier" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "nameChangedAt" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "imageChangedAt" timestamp with time zone;