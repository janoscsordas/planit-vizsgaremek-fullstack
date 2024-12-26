import ProjectHeader from "../../header"

import DndTaskMain from "@/components/projects/project/dnd-tasks/DndTaskMain"
import { db } from "@/database"
import { ProjectsTable, ProjectTasksTable } from "@/database/schema/projects"
import { desc, eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import TaskList from "../task-list"
import CreateTask from "@/components/projects/tasks/CreateTask"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { SegmentedControl } from "@radix-ui/themes"

export default async function Page({
  params,
}: Readonly<{
  params: Promise<{ projectId: string }>
}>) {
  const { projectId } = await params

  const projectData = await db.query.ProjectsTable.findFirst({
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
        <h1 className="text-2xl font-bold">Feladatok</h1>
        <div className="flex flex-col justify-start pt-4 mb-2 sm:flex-row">
          <CreateTask>
            <Button variant="outline" className="flex items-center gap-2">
              <PlusIcon className="w-4 h-4" />
              Feladat hozzáadása
            </Button>
          </CreateTask>
          {/* <div className="flex items-center gap-2 mt-4 sm:mt-0 sm:ml-auto">
            <SegmentedControl.Root defaultValue="inbox" radius="medium">
              <SegmentedControl.Item value="listView">
                Lista nézet
              </SegmentedControl.Item>
              <SegmentedControl.Item value="dndView">
                Kanban tábla
              </SegmentedControl.Item>
              <SegmentedControl.Item value="dataView">
                Adattábla
              </SegmentedControl.Item>
            </SegmentedControl.Root>
          </div> */}
        </div>
        <DndTaskMain enrichedTasks={enrichedTasks} projectId="" />
      </main>
    </>
  )
}
