ALTER TABLE "project_task_assigns" RENAME COLUMN "createdAt" TO "assignedAt";--> statement-breakpoint
ALTER TABLE "project_members" ALTER COLUMN "addedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "project_task_assigns" ALTER COLUMN "task_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "project_task_assigns" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "project_tasks" ALTER COLUMN "project_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "project_tasks" ALTER COLUMN "task_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "project_tasks" ALTER COLUMN "task_description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "project_tasks" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "project_tasks" ALTER COLUMN "status" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "project_tasks" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "createdAt" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "tier" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "status" DROP NOT NULL;