"use server"

import { auth } from "@/auth";
import { db } from "@/database";
import { ProjectTasksTable } from "@/database/schema/projects";
import { projectTaskCreationSchema } from "@/lib/schemas/projectsSchema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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