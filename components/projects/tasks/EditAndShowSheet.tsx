"use client"

import { changeTaskStatus, Status, updateTaskDescription, updateTaskName, updateTaskPriority } from "@/actions/projectTask.action";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { SelectLabel, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { SelectGroup } from "@radix-ui/react-select";
import { Badge } from "@radix-ui/themes";
import { formatDistance } from "date-fns";
import { hu } from "date-fns/locale";
import { ArrowDown, ArrowRight, ArrowUp, Check, Edit2 } from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


type Task = {
    id: string;
    taskName: string;
    taskDescription: string;
    status: 'pending' | 'in progress' | 'finished';
    createdAt: Date;
    priority: 'low' | 'medium' | 'high';
    projectId: string;
    createdBy: string;
    createdByUser: {
        id: string;
        createdAt: Date;
        name: string;
        email: string;
        image: string | null;
    };
    assigns: {
      id: string;
      userId: string;
      taskId: string;
      assignedAt: Date;
      user: {
        id: string;
        createdAt: Date;
        name: string;
        email: string;
        image: string | null;
      }[];
    }[];
};

export default function EditAndShowSheet({ task }: { task: Task }) {

    const handlePriorityChange = async (priority: string) => {
        const response = await updateTaskPriority(task.id, priority, task.projectId)

        if (!response.success) {
            toast("Hiba történt!", {
                description: response.message,
                position: "bottom-left",
            })
            return
        }

        toast("Siker!", {
            description: response.message,
            position: "bottom-left",
        })
    }

    return (
        <SheetContent className="w-[95%] sm:w-[75%]">
            <SheetHeader className="space-y-1 pt-10">
                <SheetTitle className="text-[1.4rem]">
                    
                    <TaskTitle task={task} />

                </SheetTitle>
                <SheetDescription className="pt-1 flex items-center gap-4 border-b pb-6">
                    
                    <TaskStatus task={task} />

                    <span className="text-muted-foreground"><span className="text-primary mr-3">{task.createdByUser.name}</span>készítette {formatDistance(new Date(task.createdAt), new Date(), { locale: hu, addSuffix: true })}</span>
                </SheetDescription>
            </SheetHeader>
            <section className="flex w-full h-full">
                
                <TaskDescription task={task} />

                <div className="w-[38%] pl-3">
                    <div className="mt-3 flex items-center justify-between mb-4">
                        <p className="text-muted-foreground text-[.8rem]">Kiosztva neki(k):</p>
                    </div>
                    <div className="mt-3 flex flex-col items-start sm:flex-row mb-3 gap-2 sm:items-center justify-between">
                        <p className="text-muted-foreground text-[.8rem]">Prioritás:</p>
                        <Select onValueChange={(value) => handlePriorityChange(value)}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder={task.priority === "low" ? "Alacsony" : task.priority === "medium" ? "Közepes" : "Magas"} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Prioritás</SelectLabel>
                                    <SelectItem value="low">
                                        <div className="flex items-center gap-2">
                                            <ArrowDown className="w-4 h-4 text-muted-foreground" /> 
                                            Alacsony
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="medium">
                                        <div className="flex items-center gap-2">
                                            <ArrowRight className="w-4 h-4 text-muted-foreground" /> 
                                            Közepes
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="high">
                                        <div className="flex items-center gap-2">
                                            <ArrowUp className="w-4 h-4 text-muted-foreground" /> 
                                            Magas
                                        </div>
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </section>
        </SheetContent>
    )
}

// child component for changing the task's status inside the sheet
function TaskStatus({ task }: { task: Task }) {

    // handling status change for the specific task
    const handleStatusChange = async (changedStatus: string) => {
        const { status } = task;

        if (status === changedStatus) {
            return
        }

        // changing changedStatus into unknown then into Status so it works
        const statusToEnum: Status = changedStatus as unknown as Status;
        const response = await changeTaskStatus(statusToEnum, task.id, task.projectId)

        if (!response.success) {
            toast("Hiba történt!", {
                description: response.message,
                position: "bottom-left",
            })
            return
        }

        toast("Sikeres módosítás", {
            description: response.message,
            position: "bottom-left",
        })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Badge className="px-2 py-[.1rem] rounded-md cursor-pointer" color={task.status === "pending" ? "orange" : task.status === "in progress" ? "blue" : "green"}>
                    {task.status === "pending" ? "Elvégzendő" : task.status === "in progress" ? "Folyamatban" : "Befejezett"}
                </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-max">
                <DropdownMenuLabel>Feladat Státusza</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => handleStatusChange("pending")}>
                    <Badge className="px-2 py-[.1rem] rounded-md w-full" color="orange">
                        Elvégzendő
                    </Badge>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("in progress")}>
                    <Badge className="px-2 py-[.1rem] rounded-md w-full" color="blue">
                        Folyamatban
                    </Badge>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("finished")}>
                    <Badge className="px-2 py-[.1rem] rounded-md w-full" color="green">
                        Befejezett
                    </Badge>
                </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function TaskDescription({ task }: { task: Task }) {
    const [isEditing, setIsEditing] = useState(false)
    const [taskDescription, setTaskDescription] = useState(task.taskDescription)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async () => {
        setIsLoading(true)
        setIsEditing(true)
        try {
            if (taskDescription === task.taskDescription) {
                setIsEditing(false)
                return
            }

            const response = await updateTaskDescription(task.id, taskDescription, task.projectId)

            if (response.success) {
                toast("Sikeres módosítás!", {
                    description: response.message,
                    position: "bottom-left",
                })
            }
        } catch (error) {
            toast("Hiba történt!", {
                description: error instanceof Error ? error.message : "Hiba történt a feladat leírásának módosítása Közben!",
                position: "bottom-left",
            })
        } finally {
            setIsLoading(false)
            setIsEditing(false)
        }
    }

    return (
        <div className="w-[62%] border-r pr-3">
            <div className="flex gap-6 items-center justify-between my-3">
                <p className="text-muted-foreground text-[.8rem]">Feladat leírása:</p>
                {
                    isEditing ? (
                        <Button disabled={isLoading} variant={"ghost"} className="cursor-pointer rounded-md text-[.8rem]" onClick={handleSubmit}>
                            Mentés
                        </Button>
                    ) : (
                        <Button variant={"ghost"} className="cursor-pointer rounded-md text-[.8rem]" onClick={() => setIsEditing(!isEditing)}>
                            Szerkesztés
                        </Button>
                    )
                }
            </div>
            <div>
            {isEditing ? (
                <Textarea required rows={4} placeholder="Feladat leírása..." disabled={isLoading} className="resize-none w-[80%] h-32 bg-muted-foreground/5 rounded-md p-2" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)}></Textarea>
            ) : (
                <p className="text-sm w-[80%]">
                    {task.taskDescription}
                </p>
            )}
            </div>
        </div>
    )
}

function TaskTitle({ task }: { task: Task }) {
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [taskTitle, setTaskTitle] = useState<string>(task.taskName)

    const handleSubmit = async () => {
        setIsEditing(true)
        setIsLoading(true)

        try {
            if (taskTitle === task.taskName) {
                setIsEditing(false)
                return
            }

            const response = await updateTaskName(task.id, taskTitle, task.projectId)

            if (response.success) {
                toast("Sikeres módosítás!", {
                    description: response.message,
                    position: "bottom-left",
                })
            }
        } catch (error) {
            toast("Hiba történt!", {
                description: error instanceof Error ? error.message : "Hiba történt a feladat nevének módosítása Közben!",
                position: "bottom-left",
            })
        } finally {
            setIsLoading(false)
            setIsEditing(false)
        }
    }

    return (
        <div className="flex items-center justify-between gap-10">
            {isEditing ? (
                <>
                    <Input required placeholder="Feladat neve..." disabled={isLoading} value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
                    <Button disabled={isLoading} variant={"ghost"} title="Mentés" onClick={handleSubmit}>
                        <Check className="w-4 h-4" />
                    </Button>
                </>
            ) : (
                <>
                    {task.taskName}
                    <Button className="text-[.7rem] px-3" variant={"ghost"} title="Szerkesztés" onClick={() => setIsEditing(!isEditing)}>
                        <Edit2 />
                    </Button>
                </>
            )}
        </div>
    )
}