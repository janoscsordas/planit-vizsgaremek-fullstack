"use server"

import { db } from "@/database";
import { ProjectTasksTable } from "@/database/schema/projects";
import { projectTaskCreationSchema } from "@/lib/schemas/projectsSchema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type State = {
    errors?: {
      taskName?: string[];
      taskDescription?: string[];
      status?: string[];
      priority?: string[];
    };
    message?: string;
};

export async function createTask(prevState: State, formData: FormData) {
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

    try {
        const { taskName, taskDescription, status, priority } = validatedFields.data
        
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