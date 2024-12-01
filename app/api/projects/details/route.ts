import { ProjectsTable } from '@/database/schema/projects';
import { NextResponse } from 'next/server';
import { db } from "@/database"
import { inArray } from 'drizzle-orm';
import { auth } from '@/auth';

export async function POST(request: Request) {
    const session = await auth()

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectId } = await request.json()

    try {
        // Fetch project details for given project IDs
        const projects = await db
            .select()
            .from(ProjectsTable)
            .where(inArray(ProjectsTable.id, projectId));

        // Convert to object for easy lookup
        const projectDetails = projects.reduce((acc: { [key: string]: any }, project) => {
            acc[project.id] = {
                name: project.name
            };
            return acc;
        }, {});

        return NextResponse.json(projectDetails, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch project details' }, { status: 500 });
    }
}