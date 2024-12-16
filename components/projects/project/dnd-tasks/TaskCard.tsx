import { useDraggable } from "@dnd-kit/core"
import { EnrichedTask } from "@/lib/definitions/tasks"

type TaskCardProps = {
  task: EnrichedTask
}

export function TaskCard({ task }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  })

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="cursor-grab rounded-lg bg-neutral-700 p-4 shadow-sm hover:shadow-md"
      style={style}
    >
      <h3 className="font-medium text-neutral-100">{task.taskName}</h3>
      <p className="mt-2 text-sm text-neutral-400">{task.taskDescription}</p>
    </div>
  )
}
