import { useDroppable } from "@dnd-kit/core"
import { TaskCard } from "./TaskCard"
import { EnrichedTask } from "@/lib/definitions/tasks"
import { ColumnType } from "./DndTaskMain"
import { Circle } from "lucide-react"
import { cn } from "@/lib/utils"

type ColumnProps = {
  column: ColumnType
  tasks: EnrichedTask[]
}

export function Column({ column, tasks }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  })

  return (
    <div className="flex flex-col w-full h-[calc(100vh-10.5rem)] rounded-lg bg-neutral-800 p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 font-semibold text-neutral-100">
        <Circle
          className={cn(
            "h-4 *: w-4",
            column.title === "Folyamatban" && "fill-blue-500",
            column.title === "Befejezett" && "fill-green-500",
            column.title === "Elvégzendő" && "fill-yellow-500"
          )}
        />
        <h2 className="uppercase text-neutral-100">{column.title}</h2>
      </div>
      <div ref={setNodeRef} className="flex flex-1 flex-col gap-4">
        {tasks.map((task) => {
          return <TaskCard key={task.id} task={task} />
        })}
      </div>
    </div>
  )
}
