import {z} from "zod";

export const updateTaskPrioritySchema = z.object({
    taskId: z.string(),
    priority: z.enum(["low", "medium", "high"])
})

export const updateTaskDescriptionSchema = z.object({
    taskId: z.string(),
    description: z.string()
})

export const updateTaskNameSchema = z.object({
    taskId: z.string(),
    name: z.string()
})

export const taskSchema = z.object({
    id: z.string(),
    taskName: z.string(),
    taskDescription: z.string(),
    status: z.enum(["pending", "in progress", "finished"]),
    createdAt: z.date(),
    priority: z.enum(["low", "medium", "high"]),
    projectId: z.string(),
    createdBy: z.string(),
    createdByUser: z.object({
        id: z.string(),
        createdAt: z.date(),
        name: z.string(),
        email: z.string(),
        image: z.string().nullable(),
    }),
    assigns: z.array(
        z.object({
            id: z.string(),
            userId: z.string(),
            taskId: z.string(),
            assignedAt: z.date(),
            user:
                z.object({
                    id: z.string(),
                    createdAt: z.date(),
                    name: z.string(),
                    email: z.string(),
                    image: z.string().nullable(),
                })
        })
    ),
})