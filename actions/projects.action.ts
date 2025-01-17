"use server"

import { z } from "zod"
import { db } from "@/database/"
import { ProjectMembersTable, ProjectsTable } from "@/database/schema/projects"
import { and, eq, inArray } from "drizzle-orm"
import { createProjectSchema } from "@/lib/schemas/projectsSchema"
import { auth } from "@/auth"
import { ProjectResponse } from "@/lib/definitions/projects"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { UsersTable } from "@/database/schema/user"

// Function for checking the user's session
async function checkUserSession() {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Sikertelen azonosítás: Nem vagy bejelentkezve!")
  }

  return session.user
}

// Get projects by user id
export async function getProjectsByUserId(): Promise<ProjectResponse> {
  try {
    const user = await checkUserSession()

    const projects = await db
      .select()
      .from(ProjectsTable)
      .where(eq(ProjectsTable.userId, user.id))

    return {
      success: true,
      data: projects,
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Hiba történt a projektek lekérése közben!",
    }
  }
}

// Get projects where user is a member
export async function getProjectsWhereUserIsMember(): Promise<ProjectResponse> {
  try {
    const user = await checkUserSession()

    const projectsWhereUserIsMember = await db
      .select()
      .from(ProjectMembersTable)
      .where(eq(ProjectMembersTable.userId, user.id))

    if (!projectsWhereUserIsMember?.length) {
      return {
        success: true,
        data: [], // Return empty array instead of throwing error
        message: "Nem található projekt, amelynek tagja vagy!",
      }
    }

    const projectIds = projectsWhereUserIsMember.map(
      (project) => project.projectId
    )

    const projectsData = await db
      .select()
      .from(ProjectsTable)
      .where(inArray(ProjectsTable.id, projectIds))

    return {
      success: true,
      data: projectsData,
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Hiba történt a projektek lekérése közben!",
    }
  }
}

// Get project by id
export async function getProjectById(
  projectId: string
): Promise<ProjectResponse> {
  try {
    const [foundProject] = await db
      .select()
      .from(ProjectsTable)
      .where(eq(ProjectsTable.id, projectId))

    if (!foundProject) {
      return {
        success: false,
        message: "Nem található projekt a megadott azonosítóval!",
      }
    }

    return {
      success: true,
      data: foundProject,
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Hiba történt a projekt lekérése közben!",
    }
  }
}

// State interface
export type State = {
  errors?: {
    name?: string[]
  }
  message?: string | null
}

// Create project function for user
export async function createProject(prevState: State, formData: FormData) {
  const user = await checkUserSession()

  const validatedData = createProjectSchema.safeParse({
    name: formData.get("name"),
  })

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
    }
  }

  const { name } = validatedData.data

  // Single query to get all user's projects
  const userProjects = await db.query.ProjectsTable.findMany({
    where: eq(ProjectsTable.userId, user.id),
  })

  const userTier = await db.query.UsersTable.findFirst({
    where: eq(UsersTable.id, user.id),
    columns: {
      tier: true,
    },
  })

  // Check both conditions using the query result
  const hasProjectWithSameName = userProjects.some(
    (project) => project.name === name
  )
  const hasMaxProjects = userProjects.length >= 5

  if (hasProjectWithSameName) {
    return {
      message: "A megadott névvel már készített projektet!",
    }
  }

  if (userTier?.tier === "free") {
    if (hasMaxProjects) {
      return {
        message:
          "Nem hozhat létre több projektet! Frissítsen Paid verzióra, hogy több projektet hozhasson létre!",
      }
    }
  }

  try {
    await db
      .insert(ProjectsTable)
      .values({
        userId: user.id,
        name: name,
      })
      .returning({
        name: ProjectsTable.name,
        tier: ProjectsTable.tier,
        status: ProjectsTable.status,
        createdAt: ProjectsTable.createdAt,
      })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      message: "Adatbázis hiba: Projekt létrehozása sikertelen!",
    }
  }

  revalidatePath("/projects")
  redirect("/projects")
}

// Delete project function for the user
export async function deleteProject(projectId: string) {
  await checkUserSession()

  // Check if project id is provided
  if (!projectId) {
    throw new Error("Project id nincs megadva!")
  }

  try {
    await db.delete(ProjectsTable).where(eq(ProjectsTable.id, projectId))
  } catch (error) {
    return {
      message:
        error instanceof Error ? error.message : "Project törlése sikertelen!",
      success: false,
    }
  }

  revalidatePath("/projects")
  redirect(
    `/projects?message=${encodeURIComponent("Projekt törlése sikeres!")}`
  )
}

export type StatusState = {
  errors?: {
    status?: string[]
  }
  message?: string | null
}

type StatusEnum = "active" | "completed" | "archived"

// Change project status
export async function changeProjectStatus(
  prevState: StatusState,
  formData: FormData
) {
  await checkUserSession()

  const validatedData = z
    .object({ status: z.string(), projectId: z.string() })
    .safeParse({
      projectId: formData.get("projectId"),
      status: formData.get("status"),
    })

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message:
        "Hiba! Hiányzó adatok. Projekt státusz megváltoztatása sikertelen!",
    }
  }

  const { status } = validatedData.data

  const statusToEnum = status as unknown as StatusEnum

  try {
    await db
      .update(ProjectsTable)
      .set({ status: statusToEnum })
      .where(eq(ProjectsTable.id, validatedData.data.projectId))
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      message: "Hiba! Projekt státusz módosítása sikertelen!",
    }
  }

  revalidatePath(`/projects/${validatedData.data.projectId}/settings`)

  return {
    ...prevState,
    errors: {},
    message: "A projekt státusz módosítása sikeres!",
  }
}

// Leave project
export async function leaveProject(projectId: string, userId: string) {
  await checkUserSession()

  // Check if project id is provided
  if (!projectId) {
    throw new Error("Project id nincs megadva!")
  }

  try {
    await db
      .delete(ProjectMembersTable)
      .where(
        and(
          eq(ProjectMembersTable.userId, userId),
          eq(ProjectMembersTable.projectId, projectId)
        )
      )
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "Project elhagyása sikertelen!",
      success: false,
    }
  }

  revalidatePath("/projects")
  redirect(
    `/projects?message=${encodeURIComponent("Projekt elhagyása sikeres!")}`
  )
}

// Remove user from project
export async function removeUserFromProject(projectId: string, userId: string) {
  await checkUserSession()

  try {
    // Check if project id is provided
    if (!projectId || !userId) {
      throw new Error("Project id vagy a user id nincs megadva!")
    }

    await db
      .delete(ProjectMembersTable)
      .where(
        and(
          eq(ProjectMembersTable.id, userId),
          eq(ProjectMembersTable.projectId, projectId)
        )
      )
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "A felhasználó eltávolítása a projektből sikertelen!",
      success: false,
    }
  }

  revalidatePath(`/projects/${projectId}/members`)
  return {
    message: "A felhasználó sikeresen eltávolítva a projektből!",
    success: true,
  }
}

export async function changeMembershipStatus(projectId: string, memberId: string, isAdmin: boolean) {
  await checkUserSession()

  try {
    // if isAdmin is true, set role to member, else set role to admin
    await db
      .update(ProjectMembersTable)
      .set({ role: isAdmin ? "member" : "admin" })
      .where(
        and(
          eq(ProjectMembersTable.id, memberId),
          eq(ProjectMembersTable.projectId, projectId)
        )
      )
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "A tag státuszának módosítása sikertelen!",
      success: false,
    }
  }

  revalidatePath(`/projects/${projectId}/members`)
  return {
    message: "A tag státusza sikeresen módosítva!",
    success: true,
  }
}