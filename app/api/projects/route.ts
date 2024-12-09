import { NextResponse } from 'next/server'
import {
	getProjectsByUserId,
	getProjectsWhereUserIsMember,
} from '@/actions/projects.action'
import { auth } from '@/auth'
import { ProjectsTable } from '@/database/schema/projects'
import { db } from '@/database'
import { differenceInDays } from 'date-fns'
import { eq } from 'drizzle-orm'
import { projectChangeFormSchema } from '@/lib/schemas/projectsSchema'
import {revalidatePath} from "next/cache";

export async function GET() {
	try {
		const session = await auth()

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		// Execute both queries in parallel using Promise.all
		const [ownedProjects, memberProjects] = await Promise.all([
			getProjectsByUserId(),
			getProjectsWhereUserIsMember(),
		])

		if (!ownedProjects.success || !memberProjects.success) {
			return NextResponse.json(
				{ error: 'Hiba történt a projektek lekérése során' },
				{ status: 400 }
			)
		}

		return NextResponse.json({
			ownedProjects: ownedProjects.data,
			memberProjects: memberProjects.data,
		})
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return NextResponse.json(
			{ error: 'Hiba történt a projektek lekérése során!' },
			{ status: 500 }
		)
	}
}

// PUT request for changing the project's name
export async function PUT(request: Request) {
	const session = await auth()

	if (!session?.user?.id) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { name, projectId } = await request.json()
	const validatedData = projectChangeFormSchema.safeParse({ name })

	if (!validatedData.success) {
		return NextResponse.json({ error: 'Hibás adatok!' }, { status: 400 })
	}

	if (validatedData.data.name === session.user.name) {
		return NextResponse.json(
			{ error: 'Nem adhatod meg ugyanazt a nevet!' },
			{ status: 400 }
		)
	}

	if (!projectId || !name) {
		return NextResponse.json({ error: 'Hiányzó adatok!' }, { status: 400 })
	}

	const [projectData] = await db
		.select()
		.from(ProjectsTable)
		.where(eq(ProjectsTable.id, projectId))
		.limit(1)

	if (
		projectData.nameChanged &&
		differenceInDays(new Date(), projectData.nameChanged) < 90
	) {
		return NextResponse.json(
			{
				error: `Legközelebb csak ${
					90 - differenceInDays(new Date(), projectData.nameChanged)
				} nap múlva módosíthatod a neved!`,
			},
			{ status: 400 }
		)
	}

	if (projectData.name === name) {
		return NextResponse.json(
			{ error: 'Nem adhatod meg ugyanazt a nevet!' },
			{ status: 400 }
		)
	}

	if (!projectData.name) {
		return NextResponse.json(
			{ error: 'Nem adhatod meg ugyanazt a nevet!' },
			{ status: 400 }
		)
	}

	try {
		await db
			.update(ProjectsTable)
			.set({ name, nameChanged: new Date() })
			.where(eq(ProjectsTable.id, projectId))

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return NextResponse.json(
			{ error: 'Projektnév szerkeztése sikertelen!' },
			{ status: 500 }
		)
	}

	// revalidate the page
	revalidatePath(`/projects/${projectId}/settings`)

	return NextResponse.json(
		{ message: 'Projektnév sikeresen módosítva!' },
		{ status: 200 }
	)
}
