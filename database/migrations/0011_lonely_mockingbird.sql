ALTER TABLE "project_members" RENAME COLUMN "role" TO "new_role";--> statement-breakpoint
ALTER TABLE "project_issues" ALTER COLUMN "labels" SET DATA TYPE text;