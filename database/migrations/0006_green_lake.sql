ALTER TABLE "project_members" RENAME COLUMN "new_role" TO "role";--> statement-breakpoint
ALTER TABLE "project_tasks" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project_tasks" ALTER COLUMN "priority" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project_tasks" ALTER COLUMN "createdAt" SET NOT NULL;