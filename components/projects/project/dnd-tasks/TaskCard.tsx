import { useDraggable } from "@dnd-kit/core"
import { Badge } from "@radix-ui/themes"
import { Clock, Ellipsis } from "lucide-react"
import { format } from "date-fns"
import { hu } from "date-fns/locale"
import { EnrichedTask } from "@/lib/definitions/tasks"
import { AssignedAvatars } from "@/app/projects/[projectId]/tasks/task-group"
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
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="p-5 rounded-lg shadow-lg select-none bg-neutral-800 hover:shadow-xl transition-shadow duration-200"
      style={style}
    >
      <div className="flex items-center justify-between" title={task.taskName}>
        <div className="flex flex-row items-center gap-3 lg:flex-col lg:items-start lg:gap-0">
          <span
            className="uppercase text-[0.7rem] text-gray-400"
            title={"ID: " + task.id}
          >
            ID-{task.id.slice(0, 2)}
          </span>
          <h3 className="font-semibold text-white">
            {task.taskName && task.taskName.length > 32
              ? `${task.taskName.slice(0, 32)}...`
              : task.taskName || ""}
          </h3>
        </div>
        <div className="flex flex-col items-end gap-1">
          <EditAndShowSheet task={task}>
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 p-0 text-gray-500 transition-opacity duration-200 hover:text-gray-300 hover:opacity-100"
            >
              <Ellipsis aria-label="Szerkeztés" />
            </Button>
          </EditAndShowSheet>
          {!task.assigns.length ? (
            <span className="w-6 h-6" />
          ) : (
            <AssignedAvatars assigns={task.assigns} />
          )}
        </div>
      </div>
      <p className="mb-6 text-sm text-gray-400 line-clamp-2">
        {task.taskDescription && task.taskDescription.length > 35
          ? `${task.taskDescription.slice(0, 35)}...`
          : task.taskDescription || ""}
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
          <span className="ml-2 font-medium text-right dark:text-primary">
            {task.createdByUser.name && task.createdByUser.name.length > 24
              ? `${task.createdByUser.name.slice(0, 21)}...`
              : task.createdByUser.name || ""}
          </span>
        </span>
      </div>
    </div>
  )
}
