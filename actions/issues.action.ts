"use server";

import { auth } from "@/auth";
import { db } from "@/database";
import { ProjectIssuesTable } from "@/database/schema/projects";
import { IssueCreationData } from "@/lib/definitions/issues";
import { issueCreationFormSchema } from "@/lib/schemas/issues";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createNewIssue(issueData: IssueCreationData, userId: string, projectId: string) {
    const session = await auth()

    if (!session || !session.user) {
        return {
            success: false,
            message: "Jelentkezz be a folytatáshoz!"
        }
    }

    const validatedFields = issueCreationFormSchema.safeParse(issueData)

    if (!validatedFields.success) {
        return {
            success: false,
            message: validatedFields.error.errors[0]?.message
        }
    }

    if (!userId || !projectId) {
        return {
            success: false,
            message: "Hiányzó adatokat adtál meg!"
        }
    }

    try {
        await db
            .insert(ProjectIssuesTable)
            .values({
                issueName: validatedFields.data.issueName,
                issueDescription: validatedFields.data.issueDescription,
                taskIssueId: validatedFields.data.taskIssueId,
                labels: validatedFields.data.labels,
                projectId: projectId,
                openedBy: userId
            })
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Hiba törént az Issue elkészítése közben!"
        }
    }

    revalidatePath(`/projects/${projectId}/issues`)
    return {    
        success: true,
        message: "Issue elkészítve!"
    }
}