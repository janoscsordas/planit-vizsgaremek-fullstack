ALTER TABLE "project_task_assigns" ALTER COLUMN "assignedAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project_tasks" ALTER COLUMN "project_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project_tasks" ALTER COLUMN "task_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project_tasks" ALTER COLUMN "task_description" SET NOT NULL;