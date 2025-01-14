import { useDroppable } from "@dnd-kit/core"
import { TaskCard } from "./task-card"
import { EnrichedTask } from "@/lib/definitions/tasks"
import { ColumnType } from "./dnd-task-main"
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
    <div className="flex flex-col w-full h-auto min-h-[calc(100vh-11.5rem)] rounded-lg dark:border-none bg-neutral-100 dark:bg-neutral-900 p-4 shadow-lg dark:shadow-none transition-shadow duration-200">
      <div className="flex items-center gap-2 p-2 mb-4 text-sm font-semibold border-b-2 text-muted-foreground border-neutral-200 dark:border-neutral-800">
        <Circle
          className={cn(
            "h-4 w-4",
            column.title === "Folyamatban" && "text-blue-500 fill-blue-500",
            column.title === "Befejezett" && "text-green-500 fill-green-500",
            column.title === "Elvégzendő" && "text-yellow-500 fill-yellow-500"
          )}
        />
        <h2 className="font-bold uppercase dark:text-neutral-100">
          {column.title}
        </h2>
      </div>
      <div ref={setNodeRef} className="flex flex-col flex-1 gap-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">
              Még nincsenek "{column.title}" feladatok.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
