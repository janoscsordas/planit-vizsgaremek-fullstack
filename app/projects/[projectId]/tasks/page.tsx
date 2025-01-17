import ProjectHeader from "../header"

import { db } from "@/database"
import { ProjectsTable, ProjectTasksTable } from "@/database/schema/projects"
import { desc, eq } from "drizzle-orm"
import { notFound, redirect } from "next/navigation"
import TaskViewSwitcher from "./view-switcher"
import { auth } from "@/auth"
import { Metadata } from "next"

// Fetching the Project Data
async function getProjectData(projectId: string) {
  return db.query.ProjectsTable.findFirst({
    columns: {
      id: true,
      userId: true,
      name: true,
    },
    where: eq(ProjectsTable.id, projectId),
    with: {
      members: {
        columns: {
          id: true,
          projectId: true,
          userId: true,
          role: true,
          addedAt: true,
        },
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      tasks: {
        orderBy: desc(ProjectTasksTable.createdAt),
        with: {
          assigns: {
            columns: {
              id: true,
              userId: true,
              taskId: true,
              assignedAt: true,
            },
            with: {
              user: {
                columns: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
          createdByUser: {
            columns: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      owner: {
        columns: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projectId: string }>
}): Promise<Metadata> {
  const { projectId } = await params

  const projectData = await getProjectData(projectId)
  const projectName = projectData?.name || "Projekt"

  return {
    title: `Planitapp - ${projectName} - Feladatok`,
    description: `${projectName} projekt feladatainak kezelése`,
    publisher: "Planitapp",
    openGraph: {
      title: `Planitapp - ${projectName} - Feladatok`,
      description: `${projectName} projekt feladatainak kezelése`,
      siteName: "Planitapp",
      locale: "hu-HU",
      type: "website",
    },
  }
}

export default async function Tasks({
  params,
}: Readonly<{
  params: Promise<{ projectId: string }>
}>) {
  const [session, resolvedParams] = await Promise.all([
    auth(),
    Promise.resolve(params)
  ])

  if (!session || !session.user || !session.user.id) {
    return redirect("/login")
  }

  const { projectId } = resolvedParams
  const projectData = await getProjectData(projectId)

  if (!projectData) {
    return notFound()
  }

  const enrichedTasks =
    projectData.tasks.map((task) => ({
      ...task,
      members: projectData.members.filter(
        ({ projectId }) => projectId === projectData.id
      ),
      projectOwner: projectData.owner,
    })) || []

  return (
    <>
      <ProjectHeader
        breadCrumb={[
          {
            label: projectData.name,
            href: `/projects/${projectData.id}`,
          },
          {
            label: "Feladatok",
            href: `/projects/${projectData.id}/tasks`,
            active: true,
          },
        ]}
      />
      <main className="px-6 py-2">
        <div>
          <TaskViewSwitcher tasks={enrichedTasks} projectId={projectId} />
        </div>
      </main>
    </>
  )
}
