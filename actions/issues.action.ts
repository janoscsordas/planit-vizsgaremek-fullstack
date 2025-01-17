"use server"

import { auth } from "@/auth"
import { db } from "@/database"
import {
  ProjectIssueRepliesTable,
  ProjectIssuesTable,
} from "@/database/schema/projects"
import { IssueCreationData } from "@/lib/definitions/issues"
import {
  issueCommentFormSchema,
  issueCreationFormSchema,
} from "@/lib/schemas/issues"
import { and, eq, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function createNewIssue(
  issueData: IssueCreationData,
  userId: string,
  projectId: string
) {
  const session = await auth()

  if (!session || !session.user) {
    return {
      success: false,
      message: "Jelentkezz be a folytatáshoz!",
    }
  }

  const validatedFields = issueCreationFormSchema.safeParse(issueData)

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.errors[0]?.message,
    }
  }

  if (!userId || !projectId) {
    return {
      success: false,
      message: "Hiányzó adatokat adtál meg!",
    }
  }

  try {
    await db.insert(ProjectIssuesTable).values({
      issueName: validatedFields.data.issueName,
      issueDescription: validatedFields.data.issueDescription,
      taskIssueId: validatedFields.data.taskIssueId || null,
      labels: validatedFields.data.labels,
      projectId: projectId,
      openedBy: userId,
    })
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Hiba törént a probléma elkészítése közben!",
    }
  }

  revalidatePath(`/projects/${projectId}/issues`)
  return {
    success: true,
    message: "Probléma sikeresen elkészítve!",
  }
}

/* 
    @params: comment, issueId, userId, projectId
    returns a message as string and a success as a boolean
*/
export async function createIssueComment(
  comment: string,
  issueId: number,
  userId: string,
  projectId: string
) {
  const session = await auth()

  if (!session || !session.user) {
    return {
      success: false,
      message: "Jelentkezz be a folytatáshoz!",
    }
  }

  if (!userId || !issueId || !projectId) {
    return {
      success: false,
      message: "Hiányzó adatokat adtál meg!",
    }
  }

  try {
    const validatedFields = issueCommentFormSchema.safeParse({
      comment: comment,
    })

    if (!validatedFields.success) {
      throw new Error(validatedFields.error.errors[0]?.message)
    }

    const response = await db.transaction(async (tx) => {
      const issue = await tx.query.ProjectIssuesTable.findFirst({
        where: and(
          eq(ProjectIssuesTable.id, issueId),
          eq(ProjectIssuesTable.isOpen, true)
        ),
      })

      if (!issue) {
        return null
      }

      // First we insert the comment
      const newReply = await tx
        .insert(ProjectIssueRepliesTable)
        .values({
          issueId: issueId,
          reply: validatedFields.data.comment,
          repliedBy: userId,
        })
        .returning()

      // Then we increment the comment count
      await tx
        .update(ProjectIssuesTable)
        .set({
          replies: sql`${ProjectIssuesTable.replies} + 1`,
        })
        .where(eq(ProjectIssuesTable.id, issueId))

      return newReply
    })

    if (!response) {
      throw new Error("Hiba történt a hozzászólás elkészítése közben!")
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Hiba törént az Issue elkészítése közben!",
    }
  }

  revalidatePath(`/projects/${projectId}/issues/${issueId}`)
  return {
    success: true,
    message: "Hozzászólás elküldve!",
  }
}

/* 
    @params: issueId, issueReplyId, reply, projectId
    returns a message as string and a success as a boolean
*/
export async function modifyIssueReply(
  issueId: number,
  issueReplyId: string,
  reply: string,
  projectId: string
) {
  const session = await auth()

  if (!session || !session.user) {
    return {
      success: false,
      message: "Jelentkezz be a folytatáshoz!",
    }
  }

  if (!issueId || !issueReplyId) {
    return {
      success: false,
      message: "Hiányzó adatokat adtál meg!",
    }
  }

  try {
    const validatedFields = issueCommentFormSchema.safeParse({
      comment: reply,
    })

    if (!validatedFields.success) {
      throw new Error(validatedFields.error.errors[0]?.message)
    }

    await db
      .update(ProjectIssueRepliesTable)
      .set({
        reply: validatedFields.data.comment,
      })
      .where(
        and(
          eq(ProjectIssueRepliesTable.issueId, issueId),
          eq(ProjectIssueRepliesTable.id, issueReplyId)
        )
      )
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Hiba törént a probléma szerkesztése közben!",
    }
  }

  revalidatePath(`/projects/${projectId}/issues/${issueId}`)
  return {
    success: true,
    message: "Hozzászólás módosítva!",
  }
}

/* 
    @params: issueId, issueReplyId, projectId
    returns a message as string and a success as a boolean
*/
export async function deleteIssueReply(
  issueId: number,
  issueReplyId: string,
  projectId: string
) {
  const session = await auth()

  if (!session || !session.user) {
    return {
      success: false,
      message: "Jelentkezz be a folytatáshoz!",
    }
  }

  if (!issueId || !issueReplyId) {
    return {
      success: false,
      message: "Hiányzó adatokat adtál meg!",
    }
  }

  try {
    await db.transaction(async (tx) => {
      // First we delete the comment
      await tx
        .delete(ProjectIssueRepliesTable)
        .where(
          and(
            eq(ProjectIssueRepliesTable.issueId, issueId),
            eq(ProjectIssueRepliesTable.id, issueReplyId)
          )
        )

      // Then we decrement the comment count
      await tx
        .update(ProjectIssuesTable)
        .set({
          replies: sql`${ProjectIssuesTable.replies} - 1`,
        })
        .where(eq(ProjectIssuesTable.id, issueId))
    })
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Hiba törént a probléma kommentjének törlése közben!",
    }
  }

  revalidatePath(`/projects/${projectId}/issues/${issueId}`)
  return {
    success: true,
    message: "Hozzászólás törölve!",
  }
}

/* 
    @params: issueId, description, projectId
    returns a message as string and a success as a boolean
*/
export async function updateIssueDescription(
  issueId: number,
  description: string,
  projectId: string
) {
  const session = await auth()

  if (!session || !session.user) {
    return {
      success: false,
      message: "Jelentkezz be a folytatáshoz!",
    }
  }

  try {
    const validatedFields = issueCommentFormSchema.safeParse({
      comment: description,
    })

    if (!validatedFields.success) {
      throw new Error(validatedFields.error.errors[0]?.message)
    }

    await db
      .update(ProjectIssuesTable)
      .set({
        issueDescription: validatedFields.data.comment,
      })
      .where(eq(ProjectIssuesTable.id, issueId))
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Hiba törént a probléma frissítése közben!",
    }
  }

  revalidatePath(`/projects/${projectId}/issues/${issueId}`)
  return {
    success: true,
    message: "Probléma frissítve!",
  }
}

/* 
    @params: issueId, projectId, state of the issue (TRUE || False)
    returns a message as string and a success as a boolean
*/
export async function modifyIssue(
  issueId: number,
  projectId: string,
  state: boolean
) {
  const session = await auth()

  if (!session || !session.user) {
    return {
      success: false,
      message: "Jelentkezz be a folytatáshoz!",
    }
  }

  try {
    await db
      .update(ProjectIssuesTable)
      .set({
        isOpen: state,
      })
      .where(eq(ProjectIssuesTable.id, issueId))
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Hiba törént a probléma szerkesztése közben!",
    }
  }

  revalidatePath(`/projects/${projectId}/issues/${issueId}`)
  return {
    success: true,
    message: state
      ? "Probléma sikeresen újra nyitva!"
      : "Probléma sikeresen lezárva!",
  }
}

/* 
    @params: issueId, projectId
    returns a message as string and a success as a boolean
*/
export async function removeIssue(issueId: number, projectId: string) {
  const session = await auth()

  if (!session || !session.user) {
    return {
      success: false,
      message: "Jelentkezz be a folytatáshoz!",
    }
  }

  try {
    await db
      .delete(ProjectIssuesTable)
      .where(eq(ProjectIssuesTable.id, issueId))
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Hiba törént a probléma törlése közben!",
    }
  }

  revalidatePath(`/projects/${projectId}/issues`)
  return {
    success: true,
    message: "Probléma sikeresen törölve!",
  }
}
