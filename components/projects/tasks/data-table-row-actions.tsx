"use client"

import { Eye, MoreHorizontal, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { deleteTask } from "@/actions/projectTask.action"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import EditAndShowSheet from "./EditAndShowSheet"
import { enrichedTaskSchema } from "@/lib/schemas/taskSchema"
import { EnrichedTask } from "@/lib/definitions/tasks"

interface DataTableRowActionsProps {
  row: { original: EnrichedTask }
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const task = enrichedTaskSchema.parse(row.original)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleTaskDelete = async (taskId: string) => {
    setLoading(true)

    try {
      await deleteTask(taskId, task.projectId)

      toast({
        title: "Sikeres törlés",
        description: "A feladat sikeresen törölve.",
        variant: "default",
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Sikertelen törlés",
        description: "Adatbázis hiba. Hiba történt a feladat törlése Közben!",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuLabel>Feladat Művelet</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <EditAndShowSheet task={task}>
          <DropdownMenuItem>
            <Eye />
            Megtekintés
          </DropdownMenuItem>
        </EditAndShowSheet>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600 focus:text-red-100 focus:bg-red-700" onClick={() => handleTaskDelete(task.id)}>
          <Trash2 />
          {loading ? "Törlés..." : "Törlés"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
