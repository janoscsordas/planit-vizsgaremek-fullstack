"use client"

import { Suspense, useId, useState } from "react"
import type { Task, EnrichedTask } from "@/lib/definitions/tasks"
import { Column } from "./Column"
import { DndContext, DragEndEvent } from "@dnd-kit/core"

export type TaskStatus = "pending" | "in progress" | "finished"

export type ColumnType = {
    id: TaskStatus;
    title: string;
}

const COLUMNS: ColumnType[] = [
  { id: "pending", title: "Elvégzendő" },
  { id: "in progress", title: "Folyamatban" },
  { id: "finished", title: "Befejezett" },
]

export default function DndTaskMain({ enrichedTasks } : { enrichedTasks: EnrichedTask[]}) {
  const [tasks, setTasks] = useState<EnrichedTask[]>(enrichedTasks)

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as Task["status"]

    setTasks(() =>
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
            }
          : task
      )
    )
  }

  const id = useId()

  return (
    <div className="p-4">
      <div className="flex flex-col xl:flex-row gap-8">
        <DndContext id={id} onDragEnd={handleDragEnd}>
          <Suspense fallback={<div>Loading...</div>}>
            {COLUMNS.map((column) => {
                return (
                <Column
                    key={column.id}
                    column={column}
                    tasks={tasks.filter((task) => task.status === column.id)}
                />
                )
            })}
          </Suspense>
        </DndContext>
      </div>
    </div>
  )
}