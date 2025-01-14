"use client"

import React, { useState, useEffect } from "react"
import { EnrichedTask } from "@/lib/definitions/tasks"
import dynamic from "next/dynamic"
import { TasksProvider } from "@/context/TasksContext"

const TasksListView = dynamic(
  () => import("@/components/projects/tasks-list/task-list"),
  { ssr: false }
)
const TaskKanbanView = dynamic(
  () => import("@/components/projects/project/dnd-tasks/DndTaskMain"),
  { ssr: false }
)
const ViewChanger = dynamic(() => import("./view-switcher-buttons"), {
  ssr: false,
})

function TaskViewContent({
  viewMode,
  handleViewChange,
  tasks,
  projectId,
}: {
  viewMode: string
  handleViewChange: (newView: any) => void
  tasks: EnrichedTask[]
  projectId: string
}) {
  const renderTasks = () => {
    switch (viewMode) {
      case "list":
        return <TasksListView enrichedTasks={tasks} projectId={projectId} />

      case "kanbantable":
        return <TaskKanbanView enrichedTasks={tasks} projectId={projectId} />

      default: // list view
        return <TasksListView enrichedTasks={tasks} projectId={projectId} />
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Feladatok</h1>
        <ViewChanger viewMode={viewMode} handleViewChange={handleViewChange} />
      </div>
      {renderTasks()}
    </>
  )
}

export default function TaskViewSwitcher({
  tasks,
  projectId,
}: {
  tasks: EnrichedTask[]
  projectId: string
}) {
  const [viewMode, setViewMode] = useState("list")

  // Load saved view preference on component mount
  useEffect(() => {
    const savedView = localStorage.getItem("taskViewMode")
    if (savedView) {
      setViewMode(savedView)
    }
  }, [])

  // Save view preference whenever it changes
  const handleViewChange = (newView: any) => {
    setViewMode(newView)
    localStorage.setItem("taskViewMode", newView)
  }
  
  

  return (
    <TasksProvider>
      <TaskViewContent 
        viewMode={viewMode}
        handleViewChange={handleViewChange}
        tasks={tasks}
        projectId={projectId}
      />
    </TasksProvider>
  )
}
