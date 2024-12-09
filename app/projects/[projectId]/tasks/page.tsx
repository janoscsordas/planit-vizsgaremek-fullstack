import ProjectHeader from "../header"

import { columns } from "@/components/projects/tasks/columns"
import { DataTable } from "@/components/projects/tasks/data-table"
import { db } from "@/database"
import { ProjectsTable, ProjectTasksTable } from "@/database/schema/projects"
import { UsersTable } from "@/database/schema/user"
import {Member, Task, User} from "@/lib/definitions/projects"
import { desc, eq } from "drizzle-orm"
import { notFound } from "next/navigation"


export default async function Tasks({
  params,
}: Readonly<{
  params: Promise<{ projectId: string }>
}>) {
  const { projectId } = await params

  const projectData = await db.query.ProjectsTable.findFirst({
    where: eq(ProjectsTable.id, projectId),
    with: {
      members: {
        with: { user: true }
      },
      tasks: {
        orderBy: desc(ProjectTasksTable.createdAt),
        with: {
          assigns: { 
            with: { user: true } 
          },
          createdByUser: true
        },
      }
    }
  });

  if (!projectData) {
    return notFound()
  }

  const projectOwner = await db.query.UsersTable.findFirst({
      where: eq(UsersTable.id, projectData.userId)
  })

  if (!projectOwner) {
    return notFound()
  }

  const enrichedTasks: (Task & { members: Member[]; projectOwner: User })[] = projectData.tasks.map((task) => ({
    ...task,
    members: projectData.members.filter((member) => member.projectId === projectData.id),
    projectOwner
  })) || [];

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
        <h1 className="text-2xl font-bold">Feladatok</h1>
        <div className="px-6 py-12">
          <DataTable data={enrichedTasks} columns={columns} />
        </div>
      </main>
    </>
  )
}
