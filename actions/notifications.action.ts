"use server"

import { auth } from "@/auth"
import { db } from "@/database"
import { ProjectMembersTable, ProjectsTable } from "@/database/schema/projects"
import { UsersTable } from "@/database/schema/user"
import { validEmailSchema } from "@/lib/schemas/notificationSchema"
import { supabase } from "@/lib/utils/supabase"
import { count, eq, inArray } from "drizzle-orm"

export async function sendProjectInvites(projectId: string, emails: string[]) {
  const session = await auth()

  if (!session || !session.user) {
    return {
      success: false,
      message: "Nem vagy bejelentkezve!",
    }
  }

  try {
    const validEmails = emails.filter(
      (email) => validEmailSchema.safeParse({ email }).success
    )

    if (!validEmails.length) {
      return {
        success: false,
        message: "Nem adtál meg valid címet!",
      }
    }

    // Checking if the user invites itself
    if (validEmails.some((email) => email === session.user.email)) {
      return {
        success: false,
        message: "Nem hívhatod meg saját magad!",
      }
    }

    // Fetching user ids from valid emails
    const getIdsByEmail = await db
      .select({ id: UsersTable.id })
      .from(UsersTable)
      .where(inArray(UsersTable.email, validEmails))

    if (!getIdsByEmail.length) {
      return {
        success: false,
        message: "Nem található a megadott email címek közül valid cím!",
      }
    }

    // Fetching the number of members in the project
    const [numberOfMembersInProject] = await db
      .select({ value: count(ProjectMembersTable.id) })
      .from(ProjectMembersTable)
      .where(eq(ProjectMembersTable.projectId, projectId))

    // Fetching the tier of the project
    const [tierOfProject] = await db
      .select({ value: ProjectsTable.tier })
      .from(ProjectsTable)
      .where(eq(ProjectsTable.id, projectId))

    // Checking if the project has tier "free" and there are more than 20 members
    if (
      tierOfProject.value === "free" &&
      numberOfMembersInProject.value + getIdsByEmail.length > 20
    ) {
      return {
        success: false,
        message:
          "A projektnek maximum 20 tagja lehet! Már csak " +
          (numberOfMembersInProject.value + getIdsByEmail.length - 20) +
          " tagot tudsz meghívni! Kérlek próbáld újra!",
      }
    }

    // Inserting notifications to the valid emails
    await supabase.from("notifications").insert(
      getIdsByEmail.map((id) => ({
        senderId: session.user.id,
        senderProjectId: projectId,
        receiverId: id.id,
      }))
    )

    return {
      success: true,
      message: "Meghívók elküldve a létező email címeknek!",
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Hiba történt a meghívók elküldése közben!",
    }
  }
}

export async function acceptInvitation(
  invitationId: number,
  receiverId: string,
  senderProjectId: string
) {
  const session = await auth()

  if (!session || !session.user) {
    return {
      success: false,
      message: "Nem vagy bejelentkezve!",
    }
  }

  if (!invitationId || !receiverId || !senderProjectId) {
    return {
      success: false,
      message: "Nem adtál meg az azonosítót!",
    }
  }

  try {
    // Adding the user to the project
    const [addingToProjectMembers] = await db
      .insert(ProjectMembersTable)
      .values({
        projectId: senderProjectId,
        userId: receiverId,
      })
      .returning({
        id: ProjectMembersTable.id,
        projectId: ProjectMembersTable.projectId,
        userId: ProjectMembersTable.userId,
      })

    if (!addingToProjectMembers) {
      return {
        success: false,
        message: "A projekthez adás sikertelen!",
      }
    }

    // Deleting the invitation
    await supabase.from("notifications").delete().eq("id", invitationId)

    return {
      success: true,
      message: "Meghívó sikeresen elfogadva! A projekthez adás sikeres!",
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Hiba történt a meghívó elfogadása közben!",
    }
  }
}

export async function declineInvitation(invitationId: number) {
  const session = await auth()

  if (!session || !session.user) {
    return {
      success: false,
      message: "Nem vagy bejelentkezve!",
    }
  }

  if (!invitationId) {
    return {
      success: false,
      message: "Nem adtál meg azonosítót!",
    }
  }

  try {
    // Deleting the declined invitation
    await supabase.from("notifications").delete().eq("id", invitationId)

    return {
      success: true,
      message: "Meghívó sikeresen törölve!",
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Hiba történt a meghívó elutasítása közben!",
    }
  }
}
