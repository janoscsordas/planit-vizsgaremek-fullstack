import { ProjectsTable } from "@/database/schema/projects"
import { NextResponse } from "next/server"
import { db } from "@/database"
import { inArray } from "drizzle-orm"
import { auth } from "@/auth"

export async function POST(request: Request) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectIds } = await request.json()

  try {
    // Fetch project details for given project IDs
    const projects = await db
      .select()
      .from(ProjectsTable)
      .where(inArray(ProjectsTable.id, projectIds))

    // Convert to object for easy lookup
    const projectDetails = projects.reduce(
      (acc: { [key: string]: any }, project) => {
        acc[project.id] = {
          name: project.name,
        }
        return acc
      },
      {}
    )

    return NextResponse.json(projectDetails, { status: 200 })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Hiba történt a projekt részleteinek lekérdezése során!" },
      { status: 500 }
    )
  }
}
