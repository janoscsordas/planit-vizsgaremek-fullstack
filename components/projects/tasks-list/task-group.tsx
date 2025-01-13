"use client"

import React, { useState, useMemo } from "react"
import dynamic from "next/dynamic"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronRight, Circle, Clock, Loader2, SquarePen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { hu } from "date-fns/locale/hu"
import { EnrichedTask } from "@/lib/definitions/tasks"

// Lazy load heavy components
export const TaskDelete = dynamic(() => import("./task-delete"), {
  loading: () => (
    <Loader2 className="w-3 h-3 text-muted-foreground animate-spin" />
  ),
})

const TaskCreate = dynamic(() => import("./task-create"), {
  loading: () => (
    <Loader2 className="w-3 h-3 ml-auto text-muted-foreground animate-spin" />
  ),
})

export const EditAndShowSheet = dynamic(
  () => import("@/components/projects/tasks/EditAndShowSheet"),
  {
    loading: () => (
      <Loader2 className="w-3 h-3 text-muted-foreground animate-spin" />
    ),
  }
)

interface TaskGroupProps {
  title: string
  count: number
  tasks: EnrichedTask[]
  projectId: string
}

// Memoized Assigned Avatars Component
export const AssignedAvatars = React.memo(({ assigns }: { assigns: any[] }) => (
  <div className="flex -space-x-2">
    <TooltipProvider>
      {assigns.map((assign) => (
        <Tooltip key={assign.id}>
          <TooltipTrigger asChild>
            <Avatar className="w-6 h-6 cursor-default select-none">
              <AvatarImage
                src={assign.user.image || undefined}
                alt={assign.user.name || ""}
                loading="lazy"
              />
              <AvatarFallback>
                {assign.user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <p>{assign.user.name || "Ismeretlen Felhasználó"}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </TooltipProvider>
  </div>
))

// Memoized Task Item Component
const TaskItem = React.memo(({ task }: { task: EnrichedTask }) => {
  return (
    <div className="flex items-center gap-2 px-2 py-1 transition-colors duration-200 rounded-md group hover:bg-muted/50">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Circle
          className={cn(
            "h-2 w-2",
            task.status === "in progress" && "fill-blue-500",
            task.status === "finished" && "fill-green-500",
            task.status === "pending" && "fill-yellow-500"
          )}
        />
        <span className="uppercase" title={"ID: " + task.id}>
          ID-{task.id.slice(0, 2)}
        </span>
        <EditAndShowSheet task={task}>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 p-0 md:opacity-0 md:group-hover:opacity-100 md:transition-opacity md:duration-200"
          >
            <SquarePen className="w-3 h-3" />
          </Button>
        </EditAndShowSheet>
      </div>
      <span className="flex-grow text-sm font-medium" title={task.taskName}>
        {/* {task.taskName
          ? task.taskName.length > (window.innerWidth > 768 ? 20 : 50)
            ? `${task.taskName.slice(0, window.innerWidth < 768 ? 20 : 50)}...`
            : task.taskName
          : ""} */}
        {task.taskName}
      </span>
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
          {task.priority === "low"
            ? "Alacsony"
            : task.priority === "medium"
              ? "Közepes"
              : "Magas"}
        </Badge>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          {format(task.createdAt, "MMM d", { locale: hu })}
        </div>
        <AssignedAvatars assigns={task.assigns} />
        <TaskDelete taskId={task.id} projectId={task.projectId} />
      </div>
    </div>
  )
})

// Main TaskGroup Component
const TaskGroup = React.memo(
  ({ title, count, tasks, projectId }: TaskGroupProps) => {
    const [isOpen, setIsOpen] = useState(true)

    // Memoize status information
    const statusInfo = useMemo(() => {
      switch (title) {
        case "In Progress":
          return {
            color: "fill-blue-500 text-blue-500",
            label: "Folyamatban",
          }
        case "Finished":
          return {
            color: "fill-green-500 text-green-500",
            label: "Befejezett",
          }
        default:
          return {
            color: "fill-yellow-500 text-yellow-500",
            label: "Elvégzendő",
          }
      }
    }, [title])

    // Memoize task rendering
    const renderedTasks = useMemo(() => {
      if (tasks.length === 0) {
        return (
          <div className="flex items-center gap-2 px-2 py-1 transition-colors duration-200 rounded-md group hover:bg-muted/50">
            <Circle className="w-2 h-2" />
            <span className="text-sm text-muted-foreground">
              Még nem készítettél ide feladatot.
            </span>
          </div>
        )
      }

      return tasks.map((task) => <TaskItem key={task.id} task={task} />)
    }, [tasks])

    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <div className="flex items-center w-full py-2">
          <CollapsibleTrigger className="flex items-center gap-2 text-sm hover:text-primary">
            <ChevronRight
              className={`h-4 w-4 transition-transform duration-200 ${
                isOpen ? "rotate-90" : ""
              }`}
            />
            <Circle className={`h-4 w-4 ${statusInfo.color}`} />
            <span className="font-medium">{statusInfo.label}</span>
            <span className="text-muted-foreground">{count}</span>
          </CollapsibleTrigger>
          <TaskCreate
            status={
              title.toLowerCase() as "pending" | "in progress" | "finished"
            }
            projectId={projectId}
          >
            <Button variant="ghost" size="icon" className="ml-auto">
              +
            </Button>
          </TaskCreate>
        </div>
        <CollapsibleContent className="w-full">
          <div className="pl-6 space-y-1">{renderedTasks}</div>
        </CollapsibleContent>
      </Collapsible>
    )
  }
)

export default TaskGroup
