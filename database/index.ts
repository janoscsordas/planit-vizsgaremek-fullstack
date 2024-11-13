// Setting up the database
// Drizzle is the ORM we use for querying the database
// Vercel Postgres is the database we use
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";


// this db object is what we use to query the database that's why we export it
export const db = drizzle({ client: sql });