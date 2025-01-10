"use server";

import { auth } from "@/auth";
import { db } from "@/database";
import { ProjectIssueRepliesTable, ProjectIssuesTable } from "@/database/schema/projects";
import { IssueCreationData } from "@/lib/definitions/issues";
import { issueCommentFormSchema, issueCreationFormSchema } from "@/lib/schemas/issues";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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

/* 
    @params: comment, issueId, userId, projectId
    returns a message as string and a success as a boolean
*/
export async function createIssueComment(comment: string, issueId: number, userId: string, projectId: string) {
    const session = await auth()

    if (!session || !session.user) {
        return {
            success: false,
            message: "Jelentkezz be a folytatáshoz!"
        }
    }

    if (!userId || !issueId || !projectId) {
        return {
            success: false,
            message: "Hiányzó adatokat adtál meg!"
        }
    }

    try {
        const validatedFields = issueCommentFormSchema.safeParse({
            comment: comment
        })

        if (!validatedFields.success) {
            throw new Error(validatedFields.error.errors[0]?.message)
        }

        const response = await db.transaction(async (tx) => {
            // First we insert the comment
            const newReply = await tx
                .insert(ProjectIssueRepliesTable)
                .values({
                    issueId: issueId,
                    reply: validatedFields.data.comment,
                    repliedBy: userId
                })
                .returning()

            // Then we increment the comment count
            await tx
                .update(ProjectIssuesTable)
                .set({ 
                    replies: sql`${ProjectIssuesTable.replies} + 1`,
                })
                .where(eq(ProjectIssuesTable.id, issueId));

            return newReply
        })

        if (!response) {
            throw new Error("Hiba történt a hozzászólás elkészítése közben!")
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Hiba törént az Issue elkészítése közben!"
        }
    }

    revalidatePath(`/projects/${projectId}/issues/${issueId}`)
    return {    
        success: true,
        message: "Hozzászólás elküldve!"
    }
}