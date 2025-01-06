import { z } from "zod";

export const updateTaskPrioritySchema = z.object({
    taskId: z.string(),
    priority: z.enum(["low", "medium", "high"])
});

export const updateTaskDescriptionSchema = z.object({
    taskId: z.string(),
    description: z.string()
});

export const updateTaskNameSchema = z.object({
    taskId: z.string(),
    name: z.string()
});

export const enrichedTaskSchema = z.object({
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
            user: z.object({
                id: z.string(),
                createdAt: z.date(),
                name: z.string(),
                email: z.string(),
                image: z.string().nullable(),
            })
        })
    ),
    members: z.array(
        z.object({
            projectId: z.string(),
            id: z.string(),
            userId: z.string(),
            role: z.enum(["member", "admin", "creator"]),
            addedAt: z.date(),
            user: z.object({
                id: z.string(),
                name: z.string().nullable(),
                email: z.string().nullable(),
                image: z.string().nullable(),
            })
        })
    ),
    projectOwner: z.object({
        id: z.string(),
        name: z.string().nullable(),
        email: z.string().nullable(),
        image: z.string().nullable(),
    })
});