import { z } from "zod"

export const validEmailSchema = z.object({
  email: z.string().email(),
})
