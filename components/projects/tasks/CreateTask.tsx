import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export default function CreateTask() {


    return (
        <Dialog>
            <DialogTrigger>
                <span className="px-3 py-1 text-sm font-medium text-primary-foreground rounded-sm h-full bg-emerald hover:bg-emerald-hover">
                    Új feladat
                </span>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Új feladat készítése</DialogTitle>
                    <DialogDescription className="mb-4">
                        Itt tudsz új feladatot készíteni.
                    </DialogDescription>
                </DialogHeader>
                <TaskForm />
            </DialogContent>
        </Dialog>
    )
}

function TaskForm() {
    return (
      <form className={cn("grid items-start gap-4")}>
        <div className="grid gap-2">
          <Label htmlFor="taskName">Feladat Címe</Label>
          <Input type="text" name="taskName" id="taskName" placeholder="Dokumentáció elkészítése..." />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="taskDescription">Feladat Leírása</Label>
          <Textarea
            name="taskDescription"
            id="taskDescription"
            placeholder="A feladat leírása"
            rows={3}
            className="resize-none"
          />
        </div>
        <div className="grid gap-2">
            <Label htmlFor="taskPriority">Priorítás</Label>
            
        </div>
        <Button type="submit" className="w-1/2 mx-auto block bg-emerald hover:bg-emerald-hover font-bold">Készítés</Button>
      </form>
    )
}