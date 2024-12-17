import { useDraggable } from "@dnd-kit/core"
import { EnrichedTask } from "@/lib/definitions/tasks"
import { format } from "date-fns"
import { hu } from "date-fns/locale"
import { AssignedAvatars } from "@/app/projects/[projectId]/tasks/task-group"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Clock, Ellipsis } from "lucide-react"

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
         className="rounded-lg bg-neutral-800 p-5 shadow-lg hover:shadow-xl select-none"
         style={style}
      >
         <div className="flex items-center justify-between">
            <div className="flex lg:flex-col items-center lg:items-start lg:gap-0 gap-3 flex-row">
               <span
                  className="uppercase text-[0.7rem] text-gray-400"
                  title={"ID: " + task.id}
               >
                  ID-{task.id.slice(0, 2)}
               </span>
               <h3 className="font-semibold text-white">
                  {task.taskName && task.taskName.length > 20
                     ? `${task.taskName.slice(0, 20)}...`
                     : task.taskName || ""}
               </h3>
            </div>
            <div className="flex flex-col items-end gap-1">
               <Ellipsis
                  className="w-6 h-6 text-gray-500 hover:text-gray-300"
                  aria-label="Szerkeztés"
               />
               {!task.assigns.length ? (
                  <span className="w-6 h-6" />
               ) : (
                  <AssignedAvatars assigns={task.assigns} />
               )}
            </div>
         </div>
         <p className="mt-3 text-sm text-gray-400 line-clamp-2">
            {task.taskDescription && task.taskDescription.length > 35
               ? `${task.taskDescription.slice(0, 35)}...`
               : task.taskDescription || ""}
         </p>
         <div className="mt-3 flex items-center justify-between gap-3 text-gray-400 text-xs">
            <div className="">
               <Badge
                  variant="secondary"
                  className={cn(
                     "px-2 py-1 text-xs",
                     task.priority === "low" && "bg-blue-500/10 text-blue-400",
                     task.priority === "medium" &&
                        "bg-yellow-500/10 text-yellow-400",
                     task.priority === "high" && "bg-red-500/10 text-red-400"
                  )}
               >
                  {task.priority === "low"
                     ? "Alacsony"
                     : task.priority === "medium"
                       ? "Közepes"
                       : "Magas"}
               </Badge>
            </div>
            <span className="text-muted-foreground flex items-center justify-end">
               <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {format(task.createdAt, "MMM d", { locale: hu })}
               </div>
               <span className="dark:text-primary font-medium ml-2 text-right">
                  {task.createdByUser.name &&
                  task.createdByUser.name.length > 24
                     ? `${task.createdByUser.name.slice(0, 21)}...`
                     : task.createdByUser.name || ""}
               </span>
            </span>
         </div>
      </div>
   )
}
