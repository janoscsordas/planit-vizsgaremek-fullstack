import { defineConfig } from "drizzle-kit"

import { config } from "dotenv"

config({ path: ".env.local" })

export default defineConfig({
  schema: "./database/schema/*.ts",
  out: "./database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL as string,
  },
})
