import { z } from "zod";

export const createProjectSchema = z.object({
    userId: z.string().min(4),
    name: z.string().min(4, { message: "Név minimum 4 karakter hosszú legyen!" }).max(32, { message: "Név maximum 32 karakter hosszú lehet!" }),
})

export const updateProjectSchema = z.object({
    userId: z.string().min(4),
    name: z.string().min(4, { message: "Név minimum 4 karakter hosszú legyen!" }).max(32, { message: "Név maximum 32 karakter hosszú lehet!" }).optional(),
    tier: z.enum(["free", "paid"]).optional(),
    status: z.enum(["active", "completed", "archived"]).optional(),
})
