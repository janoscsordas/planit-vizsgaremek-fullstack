CREATE TYPE "public"."project_task_priority" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
ALTER TABLE "project_tasks" ADD COLUMN "priority" "project_task_priority" DEFAULT 'low';