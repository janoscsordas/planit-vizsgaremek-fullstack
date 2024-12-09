'use server'

import { z } from 'zod'
import { db } from '@/database/index'
import { ProjectMembersTable, ProjectsTable } from '@/database/schema/projects'
import { and, eq, inArray } from 'drizzle-orm'
import {
	createProjectSchema,
	updateProjectSchema,
} from '@/lib/schemas/projectsSchema'
import { auth } from '@/auth'
import { Project } from '@/lib/definitions/projects'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { differenceInDays } from 'date-fns'

async function checkUserSession() {
	const session = await auth()

	if (!session?.user?.id) {
		throw new Error('Sikertelen azonosítás: Nem vagy bejelentkezve!')
	}

	return session.user
}

type ProjectResponse = {
	success: boolean
	data?: Project[] | Project
	message?: string
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
			data: projects,
		}
	} catch (error) {
		return {
			success: false,
			message:
				error instanceof Error
					? error.message
					: 'Hiba történt a projektek lekérése közben!',
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
				message: 'Nem található projekt, amelynek tagja vagy.',
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
					: 'Hiba történt a projektek lekérése közben!',
		}
	}
}

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
				message: 'Nem található projekt a megadott azonosítóval!',
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
					: 'Hiba történt a projekt lekérése közben!',
		}
	}
}

export type State = {
	errors?: {
		name?: string[]
	}
	message?: string | null
}

// create project function for user
export async function createProject(prevState: State, formData: FormData) {
	const user = await checkUserSession()

	const validatedData = createProjectSchema.safeParse({
		name: formData.get('name'),
	})

	if (!validatedData.success) {
		return {
			errors: validatedData.error.flatten().fieldErrors,
		}
	}

	const { name } = validatedData.data

	// Single query to get all user's projects
	const userProjects = await db
		.select()
		.from(ProjectsTable)
		.where(eq(ProjectsTable.userId, user.id))

	// Check both conditions using the query result
	const hasProjectWithSameName = userProjects.some(
		(project) => project.name === name
	)
	const hasMaxProjects = userProjects.length >= 5

	if (hasProjectWithSameName) {
		return {
			message: 'A megadott névvel már készített projektet!',
		}
	}

	if (hasMaxProjects) {
		return {
			message:
				'Nem hozhat létre több projektet! Frissítsen Paid verzióra, hogy több projektet hozhasson létre!',
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
			message: 'Adatbázis hiba: Projekt létrehozása sikertelen!',
		}
	}

	revalidatePath('/projects')
	redirect('/projects')
}

// delete project function for the user
export async function deleteProject(projectId: string) {
	await checkUserSession()

	// Check if project id is provided
	if (!projectId) {
		throw new Error('Project id nincs megadva!')
	}

	try {
		await db.delete(ProjectsTable).where(eq(ProjectsTable.id, projectId))
	} catch (error) {
		return {
			message:
				error instanceof Error
					? error.message
					: 'Project törlése sikertelen!',
			success: false,
		}
	}

	revalidatePath('/projects')
	redirect(
		`/projects?message=${encodeURIComponent('Projekt törlése sikeres!')}`
	)
}

export async function changeProjectName(prevState: State, formData: FormData) {
	await checkUserSession()

	const validatedData = updateProjectSchema.safeParse({
		name: formData.get('name'),
	})

	const projectId = formData.get('projetId')

	const [nameChangedAt] = await db
		.select()
		.from(ProjectsTable)
		.where(eq(ProjectsTable.id, projectId as string))

	// TODO: Make this shit work xd

	const COOLDOWN_DAYS = 90

	if (
		nameChangedAt.nameChanged &&
		differenceInDays(new Date(), nameChangedAt.nameChanged) < COOLDOWN_DAYS
	) {
		return {
			message: `Legközelebb csak ${
				COOLDOWN_DAYS -
				differenceInDays(new Date(), nameChangedAt.nameChanged)
			} nap múlva módosíthatod a projekt nevét!`,
		}
	}

	if (!validatedData.success) {
		return {
			errors: validatedData.error.flatten().fieldErrors,
			message: 'Hiányzó adatok. Projekt név megváltoztatása sikertelen!',
		}
	}

	const { name } = validatedData.data

	try {
		await db.update(ProjectsTable).set({ name: name })
	} catch (error) {
		return {
			message: 'Projektnév módosítása sikerestelen!',
		}
	}

	revalidatePath(`/projects/${projectId}/settings`)

	return {
		...prevState,
		errors: {},
		message: 'A projektnév módosítása sikeres!',
	}
}

export type StatusState = {
	errors?: {
		status?: string[]
	}
	message?: string | null
}

type StatusEnum = 'active' | 'completed' | 'archived'

export async function changeProjectStatus(
	prevState: StatusState,
	formData: FormData
) {
	await checkUserSession()

	const validatedData = z
		.object({ status: z.string(), projectId: z.string() })
		.safeParse({
			projectId: formData.get('projectId'),
			status: formData.get('status'),
		})

	if (!validatedData.success) {
		return {
			errors: validatedData.error.flatten().fieldErrors,
			message:
				'Hiba! Hiányzó adatok. Projekt státusz megváltoztatása sikertelen!',
		}
	}

	const { status } = validatedData.data

	const statusToEnum = status as unknown as StatusEnum

	try {
		await db
			.update(ProjectsTable)
			.set({ status: statusToEnum })
			.where(eq(ProjectsTable.id, validatedData.data.projectId))
	} catch (error) {
		return {
			message: 'Hiba! Projekt státusz módosítása sikertelen!',
		}
	}

	revalidatePath(`/projects/${validatedData.data.projectId}/settings`)

	return {
		...prevState,
		errors: {},
		message: 'A projekt státusz módosítása sikeres!',
	}
}

export async function leaveProject(projectId: string, userId: string) {
	await checkUserSession()

	// Check if project id is provided
	if (!projectId) {
		throw new Error('Project id nincs megadva!')
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
					: 'Project elhagyása sikertelen!',
			success: false,
		}
	}

	revalidatePath('/projects')
	redirect(
		`/projects?message=${encodeURIComponent('Projekt elhagyása sikeres!')}`
	)
}
