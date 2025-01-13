"use client"

import { createTask, State } from "@/actions/projectTask.action"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react"
import { useActionState, useState } from "react"

export default function TaskCreate({
  status,
  projectId,
  children,
}: {
  status: "in progress" | "pending" | "finished"
  projectId: string
  children: React.ReactNode
}) {
  const initialState: State = { message: null, errors: {} }
  const [state, formAction] = useActionState(createTask, initialState)

  const [descriptionLength, setDescriptionLength] = useState(0)

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>Új feladat készítése</DialogTitle>
          <DialogDescription className="mb-4">
            Itt tudsz új feladatot készíteni.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" action={formAction}>
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="taskName" className="text-left">
              Cím:
            </Label>
            <Input
              type="text"
              name="taskName"
              id="taskName"
              className="col-span-3"
              placeholder="A feladat címe"
              maxLength={128}
              required
            />
          </div>
          {state?.errors?.taskName &&
            state.errors.taskName.map((error: string, index) => (
              <p key={index} className="text-sm text-red-500">
                {error}
              </p>
            ))}
          <div className="grid items-center grid-cols-4 gap-4 mb-3">
            <Label htmlFor="taskDescription" className="text-left">
              Leírás:
            </Label>
            <div className="relative col-span-3">
              <Textarea
                name="taskDescription"
                id="taskDescription"
                className="resize-none"
                placeholder="A feladat leírásának a szövege"
                rows={4}
                required
                maxLength={256}
                onChange={(e) => {
                  setDescriptionLength(e.target.value.length)
                }}
              />
              <span className="absolute right-0 text-xs -bottom-6 text-muted-foreground">
                Még {256 - descriptionLength} karaktert írhatsz
              </span>
            </div>
          </div>
          {state?.errors?.taskDescription &&
            state.errors.taskDescription.map((error: string, index) => (
              <p key={index} className="text-sm text-red-500">
                {error}
              </p>
            ))}
          <div className="grid items-center grid-cols-4 gap-4 my-3">
            <Label htmlFor="taskPriority" className="text-left">
              Prioritás:
            </Label>
            <div className="relative col-span-3">
              <Select name="taskPriority">
                <SelectTrigger>
                  <SelectValue placeholder="Priorítás" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2 text-green-500">
                      <ArrowDown className="w-4 h-4 text-muted-foreground" />
                      Alacsony
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2 text-yellow-500">
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      Közepes
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2 text-red-500">
                      <ArrowUp className="w-4 h-4 text-muted-foreground" />
                      Magas
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {state?.errors?.priority &&
            state.errors.priority.map((error: string, index) => (
              <p key={index} className="text-sm text-red-500">
                {error}
              </p>
            ))}
          <div className="grid items-center grid-cols-4 gap-4 my-1">
            <Label htmlFor="status" className="text-left">
              Státusz:
            </Label>
            <Badge
              variant={"secondary"}
              className={cn(
                "w-max",
                status === "in progress" &&
                  "bg-blue-500/10 text-blue-500 hover:bg-blue-500/10 hover:text-blue-500",
                status === "pending" &&
                  "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-500",
                status === "finished" &&
                  "bg-green-500/10 text-green-500 hover:bg-green-500/10 hover:text-green-500"
              )}
            >
              {status === "pending"
                ? "Elvégzendő"
                : status === "in progress"
                  ? "Folyamatban"
                  : "Befejezett"}
            </Badge>
            <input type="hidden" name="taskStatus" value={status} />
            <input type="hidden" name="projectId" value={projectId} />
          </div>
          {state?.errors?.status &&
            state.errors.status.map((error: string, index) => (
              <p key={index} className="text-sm text-center text-red-500">
                {error}
              </p>
            ))}
          {state?.message && (
            <p
              className={cn(
                "text-sm text-red-500 text-center",
                state?.message.startsWith("Hiba")
                  ? "text-red-500"
                  : "text-green-500"
              )}
            >
              {state.message}
            </p>
          )}
          <DialogFooter>
            <Button
              type="submit"
              variant="outline"
              className="border border-emerald text-emerald hover:bg-emerald hover:text-primary-foreground"
            >
              Feladat elkészítése
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
