import { TasksContext, TasksContextProps } from "@/context/TasksContext"
import { useContext } from "react"

export const useTaskContext = (): TasksContextProps => {
  const context = useContext(TasksContext)
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TasksProvider!")
  }
  return context
}
