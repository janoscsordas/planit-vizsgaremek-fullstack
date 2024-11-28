ALTER TABLE "project_members" ADD COLUMN "new_role" "project_member" DEFAULT 'member' NOT NULL;--> statement-breakpoint
ALTER TABLE "project_members" DROP COLUMN IF EXISTS "role";