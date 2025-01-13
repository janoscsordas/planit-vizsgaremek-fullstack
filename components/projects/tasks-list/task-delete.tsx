import { deleteTask } from "@/actions/projectTask.action"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

export default function TaskDelete({
  taskId,
  projectId,
}: {
  taskId: string
  projectId: string
}) {
  const handleTaskDelete = async () => {
    const respone = await deleteTask(taskId, projectId)

    if (!respone.success) {
      toast.error("Hiba történt!", {
        description: respone.message,
        position: "top-center",
      })
    }

    toast.success("Sikeres törlés!", {
      description: respone.message,
      position: "top-center",
    })
  }

  return (
    <Button
      onClick={handleTaskDelete}
      variant="ghost"
      size="icon"
      className="w-6 h-6 p-0 md:opacity-0 md:group-hover:opacity-100 md:transition-opacity md:duration-200"
    >
      <Trash2 className="w-3 h-3" />
    </Button>
  )
}
