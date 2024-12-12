"use client"

import { useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronRight, Circle, Clock, Edit2, EyeIcon, Plus, SquarePen, Tag, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import TaskDelete from "./task-delete"
import { hu } from "date-fns/locale/hu"
import TaskCreate from "./task-create"
import { EnrichedTask } from "@/lib/definitions/tasks"
import EditAndShowSheet from "@/components/projects/tasks/EditAndShowSheet"


interface TaskGroupProps {
    title: string
    count: number
    tasks: EnrichedTask[]
    projectId: string
}
  
export default function TaskGroup({ title, count, tasks, projectId }: TaskGroupProps) {
    const [isOpen, setIsOpen] = useState(true)
  
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <div className="flex items-center py-2 w-full">
          <CollapsibleTrigger className="flex items-center gap-2 text-sm hover:text-primary">
            <ChevronRight
              className={`h-4 w-4 transition-transform duration-200 ${
                isOpen ? "rotate-90" : ""
              }`}
            />
            {title === "In Progress" && <Circle className="h-4 w-4  fill-blue-500 text-blue-500" />}
            {title === "Finished" && <Circle className="h-4 w-4 fill-green-500 text-green-500" />}
            {title === "Pending" && <Circle className="h-4 w-4 fill-yellow-500 text-yellow-500" />}
            <span className="font-medium">{title === "In Progress" ? "Folyamatban" : title === "Finished" ? "Befejezett" : "Elvégzendő"}</span>
            <span className="text-muted-foreground">{count}</span>
          </CollapsibleTrigger>
            <TaskCreate status={title.toLowerCase() as unknown as "pending" | "in progress" | "finished"} projectId={projectId}>
                <Button variant="ghost" size="icon" className="ml-auto">
                    <Plus className="h-4 w-4" />
                </Button>
            </TaskCreate>
        </div>
        <CollapsibleContent className="w-full">
            <div className="space-y-1 pl-6">
                {tasks.length > 0 ? tasks.map((task) => (
                    <div
                        key={task.id}
                        className="group flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted/50 transition-colors duration-200"
                    >
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Circle className={cn(
                                "h-2 w-2",
                                task.status === "in progress" && "fill-blue-500",
                                task.status === "finished" && "fill-green-500",
                                task.status === "pending" && "fill-yellow-500"
                            )} />
                            <span className="uppercase" title={"ID: " + task.id}>ID-{task.id.slice(0, 2)}</span>
                            <EditAndShowSheet task={task}>
                                <Button variant="ghost" size="icon" className="h-6 w-6 p-0 md:opacity-0 md:group-hover:opacity-100 md:transition-opacity md:duration-200">
                                    <SquarePen className="h-3 w-3" />
                                </Button>
                            </EditAndShowSheet>
                        </div>
                        <span className="text-sm font-medium flex-grow">{task.taskName}</span>
                        <div className="flex items-center gap-2 ml-auto">
                            <Badge
                                variant="secondary"
                                className={cn(
                                "px-1 py-0 text-xs",
                                task.priority === "low" && "bg-blue-500/10 text-blue-500",
                                task.priority === "medium" && "bg-yellow-500/10 text-yellow-500",
                                task.priority === "high" && "bg-red-500/10 text-red-500"
                                )}
                            >
                                {task.priority === "low" ? "Alacsony" : task.priority === "medium" ? "Közepes" : "Magas"}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {format(task.createdAt, 'MMM d', { locale: hu })}
                            </div>
                            <div className="flex -space-x-2">
                                <TooltipProvider>
                                    {task.assigns.map((assign) => (
                                        <Tooltip key={assign.id}>
                                            <TooltipTrigger asChild>
                                                <Avatar className="h-6 w-6 border-2 border-background cursor-default select-none">
                                                <AvatarImage src={assign.user.image || undefined} alt={assign.user.name || ''} />
                                                <AvatarFallback>
                                                    {assign.user.name
                                                    ? assign.user.name.split(" ").map((n) => n[0]).join("")
                                                    : 'U'}
                                                </AvatarFallback>
                                                </Avatar>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{assign.user.name || 'Ismeretlen Felhasználó'}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    ))}
                                </TooltipProvider>
                            </div>
                            <TaskDelete taskId={task.id} projectId={task.projectId} />
                        </div>
                    </div>
                )) : (
                    <div className="group flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted/50 transition-colors duration-200">
                        <Circle className="h-2 w-2" />
                        <span className="text-sm text-muted-foreground">Még nem készült ide feladat.</span>
                    </div>
                )}
            </div>
        </CollapsibleContent>
      </Collapsible>
    )
}