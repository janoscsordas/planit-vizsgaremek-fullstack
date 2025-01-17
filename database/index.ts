// Setting up the database
// Drizzle is the ORM we use for querying the database
// Vercel Postgres is the database we use
import { sql } from "@vercel/postgres"
import { drizzle } from "drizzle-orm/vercel-postgres"
import * as projectsSchema from "@/database/schema/projects"
import * as userSchema from "@/database/schema/user"
import * as chatSchema from "@/database/schema/chat"

// this db object is what we use to query the database that's why we export it
export const db = drizzle(sql, {
  schema: {
    ...projectsSchema,
    ...userSchema,
    ...chatSchema,
  },
})
