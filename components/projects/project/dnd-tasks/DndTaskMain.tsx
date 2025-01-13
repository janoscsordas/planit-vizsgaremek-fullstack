"use client"

import { Suspense, useId, useState } from "react"
import type { Task, EnrichedTask } from "@/lib/definitions/tasks"
import { Column } from "./Column"
import { DndContext, DragEndEvent } from "@dnd-kit/core"
import { restrictToWindowEdges } from "@dnd-kit/modifiers"
import { changeTaskStatus } from "@/actions/projectTask.action"
import { toast } from "sonner"
import Loading from "@/app/projects/[projectId]/tasks/loading"
import CreateTask from "../../tasks/CreateTask"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

export type TaskStatus = "pending" | "in progress" | "finished"

export type ColumnType = {
  id: TaskStatus
  title: string
}

const COLUMNS: ColumnType[] = [
  { id: "pending", title: "Elvégzendő" },
  { id: "in progress", title: "Folyamatban" },
  { id: "finished", title: "Befejezett" },
]
type DndTaskMainProps = {
  enrichedTasks: EnrichedTask[]
  projectId: string
}

export default function DndTaskMain({
  enrichedTasks,
  projectId,
}: DndTaskMainProps) {
  const [tasks, setTasks] = useState<EnrichedTask[]>(enrichedTasks)
  const id = useId()

  // Handle the drag end event where a task is dropped into a new column (or the same column)
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as TaskStatus

    // Find the task being dragged
    const task = tasks.find((task) => task.id === taskId)
    if (!task) return

    // If the task is dragged into the same column, do nothing
    if (task.status === newStatus) {
      return
    }

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    )

    const result = await changeTaskStatus(newStatus, taskId, projectId)

    if (!result.success) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: task.status } : task
        )
      )
      toast.error("Hiba történt!", {
        description: result.message,
        position: "top-center",
      })
      return
    }

    toast.success("Sikeres módosítás!", {
      description: result.message,
      position: "top-center",
    })
  }

  return (
    <div>
      <div className="mb-4">
        <CreateTask>
          <Button variant={"outline"}>
            <PlusIcon className="w-4 h-4" />
            Feladat hozzáadása
          </Button>
        </CreateTask>
      </div>
      <div className="flex flex-col gap-8 xl:flex-row">
        <DndContext
          id={id}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToWindowEdges]}
        >
          <Suspense fallback={<Loading />}>
            {COLUMNS.map((column) => (
              <Column
                key={column.id}
                column={column}
                tasks={tasks.filter((task) => task.status === column.id)}
              />
            ))}
          </Suspense>
        </DndContext>
      </div>
    </div>
  )
}
