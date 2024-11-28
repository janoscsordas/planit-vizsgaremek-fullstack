"use client"

import { createTask, State } from "@/actions/projectTask.action"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectLabel, SelectGroup } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { ArrowDown, ArrowRight, ArrowUp, CircleCheckBig, CircleDashed, Loader, PlusIcon } from "lucide-react"
import { useParams } from "next/navigation"
import { useActionState, useState } from "react"

export default function CreateTask() {
    return (
        <Dialog>
            <DialogTrigger className="flex gap-1 items-center text-[.8rem] px-3 py-1 font-medium text-primary rounded-md border border-emerald hover:border-emerald-hover">
                <PlusIcon className="w-4 h-4" />
                Új feladat
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
    const params = useParams()
    const projectId = params.projectId

    const initialState: State = { message: null, errors: {} }
    const [state, formAction] = useActionState(createTask, initialState)

    const [numberOfCharacter, setNumberOfCharacter] = useState<number>(0)


    return (
      <form action={formAction} className={cn("grid items-start gap-4")}>
        {/* Hidden input with the projectId inside it */}
        <input type="hidden" name="projectId" value={projectId} />
        <div className="grid gap-2">
          <Label htmlFor="taskName">Feladat Címe</Label>
          <Input 
            type="text" 
            name="taskName" 
            id="taskName" 
            placeholder="Dokumentáció elkészítése..." 
            maxLength={128}
            required
            aria-describedby="taskName-error"
            />
            <div id="taskName-error" aria-live="polite" aria-atomic="true">
                {state?.errors?.taskName &&
                state?.errors.taskName.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                    </p>
                ))}
            </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="taskDescription">Feladat Leírása</Label>
          <div className="relative">
            <Textarea
                name="taskDescription"
                id="taskDescription"
                placeholder="A feladat leírása"
                rows={3}
                className="resize-none"
                maxLength={256}
                required
                aria-describedby="taskDescription-error"
                onChange={(e) => {
                    setNumberOfCharacter(e.target.value.length)
                }}
            />
            <span className="absolute -bottom-5 right-2 text-[.6rem] text-muted-foreground select-none">Még {256 - numberOfCharacter} karaktert írhatsz.</span>
          </div>

          <div id="taskDescription-error" aria-live="polite" aria-atomic="true">
                {state?.errors?.taskDescription &&
                state?.errors.taskDescription.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                    </p>
                ))}
            </div>
        </div>
        <div className="grid gap-2">
            <Label htmlFor="taskPriority">Priorítás</Label>
            <Select required name="taskPriority">
                <SelectTrigger>
                    <SelectValue placeholder="Prioritás" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Prioritás</SelectLabel>
                        <SelectItem value="low">
                            <div className="flex items-center gap-2 text-green-600">
                                <ArrowDown className="w-4 h-4 text-muted-foreground" />
                                Alacsony
                            </div>
                        </SelectItem>
                        <SelectItem value="medium">
                            <div className="flex items-center gap-2 text-orange-600">
                                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                Közepes
                            </div>
                        </SelectItem>
                        <SelectItem value="high">
                            <div className="flex items-center gap-2 text-red-600">
                                <ArrowUp className="w-4 h-4 text-muted-foreground" />
                                Magas
                            </div>
                        </SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <div id="priority-error" aria-live="polite" aria-atomic="true">
                {state?.errors?.priority &&
                state?.errors.priority.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                    </p>
                ))}
            </div>
        </div>
        <div className="grid gap-2">
            <Label htmlFor="taskStatus">Státusz</Label>
            <Select name="taskStatus" required>
                <SelectTrigger>
                    <SelectValue placeholder="Státusz" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Státusz</SelectLabel>
                        <SelectItem value="pending">
                            <div className="flex items-center gap-2">
                                <CircleDashed className="w-4 h-4 text-muted-foreground" />
                                Elvégzendő
                            </div>
                        </SelectItem>
                        <SelectItem value="in progress">
                            <div className="flex items-center gap-2">
                                <Loader className="w-4 h-4 animate-spin text-muted-foreground" />
                                Folyamatban
                            </div>
                        </SelectItem>
                        <SelectItem value="finished">
                            <div className="flex items-center gap-2">
                                <CircleCheckBig className="w-4 h-4 text-muted-foreground" />
                                Befejezett
                            </div>
                        </SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <div id="status-error" aria-live="polite" aria-atomic="true">
                {state?.errors?.status &&
                state?.errors.status.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                    </p>
                ))}
            </div>
        </div>
        {state?.message && <p className={`mt-2 text-sm ${state?.message.startsWith('Hiba') ? 'text-red-500' : 'text-green-500'}`}>{state.message}</p>}
        <Button type="submit" className="w-1/2 mx-auto block bg-emerald hover:bg-emerald-hover font-bold">Készítés</Button>
      </form>
    )
}