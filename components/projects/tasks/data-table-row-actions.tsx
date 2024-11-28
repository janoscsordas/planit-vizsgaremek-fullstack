"use client"

import { Edit, Eye, Loader2, MoreHorizontal, Trash2 } from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { z } from "zod"
import { ProjectData } from "@/lib/definitions/projects"
import { deleteTask } from "@/actions/projectTask.action"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const taskSchema = z.object({
  id: z.string(),
  taskName: z.string(),
  taskDescription: z.string(),
  status: z.enum(["pending", "in progress", "finished"]),
  createdAt: z.date(),
  priority: z.enum(["low", "medium", "high"]),
  projectId: z.string(),
  assigns: z.array(
    z.object({ 
      id: z.string(), 
      userId: z.string(), 
      taskId: z.string(), 
      assignedAt: z.date(), 
      user: z.array(
        z.object({ 
          id: z.string(), 
          createdAt: z.date(),
          name: z.string(), 
          email: z.string(), 
          image: z.string().nullable(),
    })) }))
})

interface DataTableRowActionsProps {
  row: { original: ProjectData["tasks"][number] },
}
export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const task = taskSchema.parse(row.original)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleTaskDelete = async (taskId: string) => {
    setLoading(true)

    try {
      await deleteTask(taskId, task.projectId)
    } catch (error) {
      toast({
        title: "Sikertelen törlés",
        description: (error instanceof Error ? error.message : "Adatbázis hiba. Hiba történt a feladat törlése Közben!"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DropdownMenu>
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
        <DropdownMenuItem className="text-orange-600 focus:bg-orange-700 focus:text-orange-100">
          <Edit />
          Szerkesztés
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Eye />
          Megtekintés
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600 focus:text-red-100 focus:bg-red-700" onClick={() => handleTaskDelete(task.id)}>
          <Trash2 />
          {loading ? "Törlés..." : "Törlés"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
