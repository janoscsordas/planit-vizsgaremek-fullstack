"use server"

import { db } from "@/database/index";
import { ProjectMembersTable, ProjectsTable } from "@/database/schema/projects";
import { eq, inArray, and } from "drizzle-orm";
import { createProjectSchema, updateProjectSchema } from "@/schemas/projectsSchema";
import { auth } from "@/auth"
import { Project } from "@/lib/definitions/projects";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function checkUserSession() {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error("Sikertelen azonosítás: Nem vagy bejelentkezve!")
  }

  return session.user
}

type ProjectResponse = {
    success: boolean;
    data?: Project[] | Project;
    message?: string;
}

// get projects by user id
export async function getProjectsByUserId(): Promise<ProjectResponse> {
    try {
        const user = await checkUserSession()

        const projects = await db
            .select()
            .from(ProjectsTable)
            .where(eq(ProjectsTable.userId, user.id))

        return {
            success: true,
            data: projects
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error 
                ? error.message 
                : "Hiba történt a projektek lekérése közben!"
        }
    }
}

// get projects where user is a member
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
                message: "Nem található projekt, amelynek tagja vagy."
            }
        }

        const projectIds = projectsWhereUserIsMember.map(project => project.projectId)
        
        const projectsData = await db
            .select()
            .from(ProjectsTable)
            .where(inArray(ProjectsTable.id, projectIds))

        return {
            success: true,
            data: projectsData
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error 
                ? error.message 
                : "Hiba történt a projektek lekérése közben!"
        }
    }
}

export async function getProjectById(projectId: string): Promise<ProjectResponse> {
    try {
        const [foundProject] = await db
            .select()
            .from(ProjectsTable)
            .where(eq(ProjectsTable.id, projectId))

        if (!foundProject) {
            return {
                success: false,
                message: "Nem található projekt a megadott azonosítóval!"
            }
        }

        return {
            success: true,
            data: foundProject
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error 
                ? error.message 
                : "Hiba történt a projekt lekérése közben!"
        }
    }
}

export type State = {
    errors?: {
      name?: string[];
    };
    message?: string | null;
};

// create project function for user
export async function createProject(prevState: State, formData: FormData) {
    const user = await checkUserSession();
    
    // Validate input before database operation
    const validatedData = createProjectSchema.safeParse({
        name: formData.get("name")
    })

    if (!validatedData.success) {
        return {
            errors: validatedData.error.flatten().fieldErrors,
            message: 'Hiányzó adatok. Projekt létrehozása sikertelen.'
        }
    }

    const { name } = validatedData.data

    const [projectExists] = await db
        .select()
        .from(ProjectsTable)
        .where(and(eq(ProjectsTable.name, name), eq(ProjectsTable.userId, user.id)))

    if (projectExists) {
        return {
            message: "A megadott névvel már készített projektet!"
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
    } catch (error) {
      return {
        message: "Adatbázis hiba: Projekt létrehozása sikertelen."
      }
    }

    revalidatePath("/projects")
    redirect("/projects")
}
