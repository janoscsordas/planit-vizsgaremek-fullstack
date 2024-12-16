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
    <div className="flex flex-col w-full h-[calc(100vh-10.5rem)] rounded-lg dark:border-none bg-neutral-100 dark:bg-neutral-900 p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 font-semibold border-b-2 p-2 border-neutral-200 dark:border-neutral-800">
        <Circle
          className={cn(
            "h-4 w-4",
            column.title === "Folyamatban" && "text-blue-500 fill-blue-500",
            column.title === "Befejezett" && "text-green-500 fill-green-500",
            column.title === "Elvégzendő" && "text-yellow-500 fill-yellow-500"
          )}
        />
        <h2 className="uppercase dark:text-neutral-100 font-bold">
          {column.title}
        </h2>
      </div>
      <div ref={setNodeRef} className="flex flex-1 flex-col gap-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-sm">
              Még nincsenek "{column.title}" feladatok.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
