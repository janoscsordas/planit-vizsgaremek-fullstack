import { useDraggable } from "@dnd-kit/core"
import { Badge } from "@radix-ui/themes"
import { Clock, Ellipsis } from "lucide-react"
import { format } from "date-fns"
import { hu } from "date-fns/locale"
import { EnrichedTask } from "@/lib/definitions/tasks"
import { AssignedAvatars } from "@/components/projects/tasks-list/task-group"
import { Button } from "@/components/ui/button"
import EditAndShowSheet from "../../tasks/EditAndShowSheet"

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
    <EditAndShowSheet task={task}>
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className="p-5 transition-shadow duration-200 rounded-lg shadow-lg select-none bg-neutral-800 hover:shadow-xl"
        style={style}
      >
        <div
          className="flex items-start justify-between"
          title={task.taskName}
        >
          <div className="flex flex-row gap-3 lg:flex-col lg:items-start lg:gap-0">
            <span
              className="uppercase text-[0.7rem] text-gray-400"
              title={"ID: " + task.id}
            >
              ID-{task.id.slice(0, 2)}
            </span>
            <h3
              className="overflow-hidden font-semibold text-white break-words text-ellipsis"
              style={{
                maxWidth: "calc(var(--vw) * 30)",
              }}
            >
              {task.taskName}
            </h3>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 p-0 text-gray-500 transition-opacity duration-200 hover:text-gray-300 hover:opacity-100"
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <Ellipsis aria-label="Szerkeztés" />
            </Button>
            {!task.assigns.length ? (
              <span className="w-6 h-6" />
            ) : (
              <AssignedAvatars assigns={task.assigns} />
            )}
          </div>
        </div>
        <p
          className="mb-6 overflow-hidden text-sm text-gray-400 break-words text-ellipsis"
          style={{
            maxWidth: "calc(var(--vw) * 30)",
          }}
        >
          {task.taskDescription}
        </p>
        <div className="flex items-center justify-between gap-3 mt-3 text-xs text-gray-400">
          <div className="">
            <Badge
              color={
                task.priority === "low"
                  ? "green"
                  : task.priority === "medium"
                    ? "yellow"
                    : "red"
              }
            >
              {task.priority === "low"
                ? "Alacsony"
                : task.priority === "medium"
                  ? "Közepes"
                  : "Magas"}
            </Badge>
          </div>
          <span className="flex items-center justify-end text-muted-foreground">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {format(task.createdAt, "MMM d", { locale: hu })}
            </div>
            <span
              className="ml-2 overflow-hidden font-medium text-right break-words line-clamp-1 dark:text-primary text-ellipsis"
              style={{
                maxWidth: "calc(var(--vw) * 30)",
              }}
            >
              {task.createdByUser.name}
            </span>
          </span>
        </div>
      </div>
    </EditAndShowSheet>
  )
}
