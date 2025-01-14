"use client"

import { Suspense, useEffect, useId, useMemo } from "react"
import type { EnrichedTask } from "@/lib/definitions/tasks"
import { Column } from "./Column"
import { DndContext, DragEndEvent } from "@dnd-kit/core"
import { restrictToWindowEdges } from "@dnd-kit/modifiers"
import { changeTaskStatus } from "@/actions/projectTask.action"
import { toast } from "sonner"
import Loading from "@/app/projects/[projectId]/tasks/loading"
import CreateTask from "../../tasks/CreateTask"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { useTaskContext } from "@/hooks/useTaskContext"

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
  const { tasks, setTasks } = useTaskContext()

  useEffect(() => {
    setTasks(enrichedTasks)
  }, [enrichedTasks, setTasks])

  const id = useId()

  // Sort function
  const sortTasks = (a: EnrichedTask, b: EnrichedTask) => {
    // Sort by priority (high > medium > low)
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }

    // If priority is the same, sort by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  }

  // Memoized sorted tasks for each column
  const sortedColumnTasks = useMemo(() => {
    return COLUMNS.reduce(
      (acc, column) => {
        acc[column.id] = tasks
          .filter((task) => task.status === column.id)
          .sort(sortTasks)
        return acc
      },
      {} as Record<TaskStatus, EnrichedTask[]>
    )
  }, [tasks])

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as TaskStatus

    const task = tasks.find((task) => task.id === taskId)
    if (!task) return

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
                tasks={sortedColumnTasks[column.id]}
              />
            ))}
          </Suspense>
        </DndContext>
      </div>
    </div>
  )
}
