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

    if (!session || !session.user) {
        return {
            errors: {},
            message: "Jelentkezz be a feladat készítéshez!",
        }
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
            message: "Hibás vagy hiányzó adatok. A feladat elkészítése sikertelen."
        }
    }

    const { taskName, taskDescription, status, priority } = validatedFields.data
    
    try {
        await db.insert(ProjectTasksTable).values({
            taskName,
            taskDescription,
            projectId,
            status,
            priority
        })
    } catch (error) {
        return {
            message: "Adatbázis hiba. Hiba történt a feladat elkészítése Közben!"
        }
    }

    revalidatePath(`/projects/${projectId}/tasks`)
    redirect(`/projects/${projectId}/tasks`)
}

export async function deleteTask(taskId: string, projectId: string) {
    if (!taskId) {
        throw new Error("A feladat ID-ja hiányzik!");
    }

    const session = await auth()

    if (!session || !session.user) {
        throw new Error("Jelentkezz be a feladat készítéshez!");
    }
    
    try {
        await db.delete(ProjectTasksTable).where(eq(ProjectTasksTable.id, taskId))
    } catch (error) {
        return { success: false, message: error instanceof Error ? error.message : "Adatbázis hiba. Hiba történt a feladat töröltése Közben!" };
    }

    revalidatePath(`/projects/${projectId}/tasks`)
    redirect(`/projects/${projectId}/tasks?message=${encodeURIComponent("Feladat sikeresen törölve")}`);
}