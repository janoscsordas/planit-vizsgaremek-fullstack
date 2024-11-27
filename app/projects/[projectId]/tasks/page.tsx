import ProjectHeader from "../header"

import { columns } from "../../../../components/projects/tasks/columns"
import { DataTable } from "../../../../components/projects/tasks/data-table"
import { db } from "@/database"
import { ProjectsTable } from "@/database/schema/projects"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"

export default async function Tasks({
  params,
}: Readonly<{
  children: React.ReactNode
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
        with: { 
          assigns: { 
            with: { user: true } 
          } 
        }
      }
    }
  });

  if (!projectData) {
    return notFound()
  }

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
        <h1 className="text-2xl font-bold">Feldatok</h1>
        <div className="w-full md:w-11/12 mx-auto px-6 py-12">
          <DataTable data={projectData.tasks} columns={columns} />
        </div>
      </main>
    </>
  )
}
