"use server"

import { db } from "@/database/index";
import { ProjectMembersTable, ProjectsTable } from "@/database/schema/projects";
import { eq, inArray } from "drizzle-orm";
import { createProjectSchema, updateProjectSchema } from "@/schemas/projectsSchema";
import { auth } from "@/auth"
import { z, ZodError } from "zod";
import { Project } from "@/definitions/projects";

async function checkUserSession() {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized: User must be logged in")
  }

  return session.user
}

// get projects by user id
export async function getProjectsByUserId() {
    try {
        const user = await checkUserSession()

        const projects = await db.select().from(ProjectsTable).where(eq(ProjectsTable.userId, user.id))

        return projects
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Hiba történt a projektek lekérése közben!"
        }
    }
}

// get projects where user is a member
export async function getProjectsWhereUserIsMember(): Promise<Project[] | { success?: boolean, message?: Record<string, string> | string }> {
    try {
        const user = await checkUserSession()

        const projectsWhereUserIsMember = await db.select().from(ProjectMembersTable).where(eq(ProjectMembersTable.userId, user.id))

        if (!projectsWhereUserIsMember || projectsWhereUserIsMember.length === 0) {
            throw new Error("Nem található projekt aminek a felhasználó a tagja!")
        }

        const projectsData = await db.select().from(ProjectsTable).where(inArray(ProjectsTable.id, projectsWhereUserIsMember.map(project => project.projectId)))

        return projectsData
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Hiba történt a projektek lekérése közben!"
        }
    }
}


// create project function for user
export async function createProject(name: string): Promise<{ success: boolean, data?: Project, message?: Record<string, string> | string }> {
    try {
        const user = await checkUserSession()

        await createProjectSchema.parseAsync({
            userId: user.id,
            name: name,
        })

        const project = await db.insert(ProjectsTable).values({
            userId: user.id,
            name: name,
        }).returning({
            id: ProjectsTable.id,
            userId: ProjectsTable.userId,
            name: ProjectsTable.name,
            tier: ProjectsTable.tier,
            status: ProjectsTable.status,
            createdAt: ProjectsTable.createdAt,
        })

        if (!project[0]) {
            throw new Error("Projekt létrehozása sikertelen!")
        }

        return {
            success: true,
            data: project[0],
            message: "Projekt sikeresen létrehozva!"
        }

    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Hiba történt a projekt létrehozása közben!"
        }
    }
}
