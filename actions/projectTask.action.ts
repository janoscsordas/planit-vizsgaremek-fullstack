"use server"

import { auth } from "@/auth";
import { db } from "@/database";
import { ProjectTasksTable } from "@/database/schema/projects";
import { projectTaskCreationSchema } from "@/lib/schemas/projectsSchema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export type State = {
    errors?: {
      taskName?: string[];
      taskDescription?: string[];
      status?: string[];
      priority?: string[];
    };
    message?: string | null;
};

export async function createTask(prevState: State, formData: FormData) {
    const session = await auth()

    if (!session || !session.user || !session.user.id) {
        redirect("/login")
    }

    const projectId = formData.get("projectId") as string;

    const validatedFields = projectTaskCreationSchema.safeParse({
        taskName: formData.get("taskName"),
        taskDescription: formData.get("taskDescription"),
        status: formData.get("taskStatus"),
        priority: formData.get("taskPriority")
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Hiba! A megadott adatok nem megfelelőek! A feladat elkészítése sikertelen."
        }
    }

    const { taskName, taskDescription, status, priority } = validatedFields.data
    
    try {
        await db.insert(ProjectTasksTable).values({
            taskName,
            taskDescription,
            projectId,
            status,
            priority,
            createdBy: session.user.id
        })
    } catch (error) {
        return {
            message: "Hiba történt a feladat elkészítése közben!"
        }
    }

    revalidatePath(`/projects/${projectId}/tasks`)
    return {
        ...prevState,
        errors: {},
        message: "A feladat sikeresen elkészítve!"
    }
}

export async function deleteTask(taskId: string, projectId: string) {

    const session = await auth()

    if (!session || !session.user) {
        return;
    }

    await db.delete(ProjectTasksTable).where(eq(ProjectTasksTable.id, taskId))

    revalidatePath(`/projects/${projectId}/tasks`)
}

const updateSchema = z.object({
    taskId: z.string(),
    priority: z.enum(["low", "medium", "high"])
})

export async function updateTaskPriority(taskId: string, priority: string, projectId: string) {
    const session = await auth()

    if (!session || !session.user) {
        return {
            success: false,
            message: "Nem vagy bejelentkezve!"
        }
    }

    const validatedFields = updateSchema.safeParse({ taskId, priority })

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Hiba! A megadott adatok nem megfelelőek! A feladat módosítása sikertelen."
        }
    }

    try {
        await db.update(ProjectTasksTable).set({ priority: validatedFields.data.priority }).where(eq(ProjectTasksTable.id, validatedFields.data.taskId))
    } catch (error) {
        return {
            success: false,
            message: "Hiba történt a feladat elkészítése Közben!"
        }
    }

    revalidatePath(`/projects/${projectId}/tasks`)

    return {
        success: true,
        message: "A feladat prioritása sikeresen módosítva!"
    }
}

const updateTaskDescriptionSchema = z.object({
    taskId: z.string(),
    description: z.string()
})

export async function updateTaskDescription(taskId: string, description: string, projectId: string) {
    const session = await auth()

    if (!session || !session.user) {
        return {
            success: false,
            message: "Nem vagy bejelentkezve!"
        }
    }

    const validatedFields = updateTaskDescriptionSchema.safeParse({ taskId, description })

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Hiba! A megadott adatok nem megfelelőek! A feladat módosítása sikertelen."
        }
    }

    try {
        await db.update(ProjectTasksTable).set({ taskDescription: validatedFields.data.description }).where(eq(ProjectTasksTable.id, validatedFields.data.taskId))
    } catch (error) {
        return {
            success: false,
            message: "Hiba történt a feladat leírásának módosítása Közben!"
        }   
    }


    revalidatePath(`/projects/${projectId}/tasks`)
    return {
        success: true,
        message: "A feladat leírás sikeresen módosítva!"
    }
}

const updateTaskNameSchema = z.object({
    taskId: z.string(),
    name: z.string()
})

export async function updateTaskName(taskId: string, name: string, projectId: string) {
    const session = await auth()

    if (!session || !session.user) {
        return {
            success: false,
            message: "Nem vagy bejelentkezve!"
        }
    }

    const validatedFields = updateTaskNameSchema.safeParse({ taskId, name })

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Hiba! A megadott adatok nem megfelelőek! A feladat módosítása sikertelen."
        }
    }

    try {
        await db.update(ProjectTasksTable).set({ taskName: validatedFields.data.name }).where(eq(ProjectTasksTable.id, validatedFields.data.taskId))
    } catch (error) {
        return {
            success: false,
            message: "Hiba történt a feladat címének módosítása Közben!"
        }   
    }

    revalidatePath(`/projects/${projectId}/tasks`)

    return { success: true, message: "A feladat címe sikeresen módosítva!" }
}

export type Status = {
    status: "pending" | "in progress" | "finished"
}

export async function changeTaskStatus(status: Status, taskId: string, projectId: string) {
    const session = await auth()

    if (!session || !session.user) {
        return {
            success: false,
            message: "Jelentkezz be a folytatáshoz!"
        }
    }

    const validatedFields = z.object({ taskId: z.string(), status: z.enum([ "pending", "in progress", "finished" ]) }).safeParse({ taskId, status })

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Hibás adatokat adtál meg!"
        }
    }

    try {
        await db.update(ProjectTasksTable).set({ status: validatedFields.data.status }).where(eq(ProjectTasksTable.id, validatedFields.data.taskId))
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Hiba történt a feladat státusz módosítása közben!"
        }
    }

    revalidatePath(`/projects/${projectId}/tasks`)

    return { success: true, message: "A feladat státusza sikeresen módosítva!" }
}