"use client"

import React, { useState, useEffect } from "react"
import { List, Grid, Table } from "lucide-react"
import { EnrichedTask } from "@/lib/definitions/tasks"
import { columns } from "@/components/projects/tasks/columns"
import dynamic from "next/dynamic"

const TasksListView = dynamic(
  () => import("@/components/projects/tasks-list/task-list")
)
const TaskKanbanView = dynamic(
  () => import("@/components/projects/project/dnd-tasks/DndTaskMain")
)
const TasksTableView = dynamic(
  () => import("@/components/projects/tasks/data-table")
)

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

  // possible view modes: list, kanbantable, datatable
  const renderTasks = () => {
    switch (viewMode) {
      case "list":
        return <TasksListView enrichedTasks={tasks} projectId={projectId} />

      case "kanbantable":
        return <TaskKanbanView enrichedTasks={tasks} projectId={projectId} />

      // case "datatable":
      //     return (
      //         <TasksTableView columns={columns} data={tasks} />
      //     )

      default: // list view
        return <TasksListView enrichedTasks={tasks} projectId={projectId} />
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Feladatok</h1>
        <div className=" flex items-center gap-4">
          <button
            onClick={() => handleViewChange("list")}
            className={`p-2 rounded ${
              viewMode === "list" ? "bg-emerald-hover" : "hover:bg-emerald-hover"
            }`}
            title="List View"
          >
            <List
              className={`w-4 h-4 ${
                viewMode === "list" ? "text-primary" : "text-white"
              }`}
            />
          </button>
          <button
            onClick={() => handleViewChange("kanbantable")}
            className={`p-2 rounded ${
              viewMode === "kanbantable" ? "bg-emerald-hover" : "hover:bg-emerald-hover"
            }`}
            title="Grid View"
          >
            <Grid
              className={`w-4 h-4 ${
                viewMode === "kanbantable" ? "text-primary" : "text-white"
              }`}
            />
          </button>
          <button
            onClick={() => handleViewChange("datatable")}
            className={`p-2 rounded ${
              viewMode === "datatable" ? "bg-emerald-hover" : "hover:bg-emerald-hover"
            }`}
            title="Table View"
          >
            <Table
              className={`w-4 h-4 ${
                viewMode === "datatable" ? "text-primary" : "text-white"
              }`}
            />
          </button>
        </div>
      </div>
      {renderTasks()}
    </>
  )
}
