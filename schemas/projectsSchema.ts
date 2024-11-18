import { z } from "zod";

export const createProjectSchema = z.object({
    name: z.string().min(4, { message: "A projekt neve minimum 4 karakter hosszúnak kell lennie!" }).max(32, { message: "A projekt neve maximum 32 karakter hosszú lehet!" }),
})

export const updateProjectSchema = z.object({
    userId: z.string().min(4),
    name: z.string().min(4, { message: "A projekt neve minimum 4 karakter hosszúnak kell lennie!" }).max(32, { message: "A projekt neve maximum 32 karakter hosszú lehet!" }).optional(),
    tier: z.enum(["free", "paid"]).optional(),
    status: z.enum(["active", "completed", "archived"]).optional(),
})
