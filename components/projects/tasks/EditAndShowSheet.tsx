"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@radix-ui/themes";
import { formatDistance } from "date-fns";
import { hu } from "date-fns/locale";
import { Edit2 } from "lucide-react";

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

    return (
        <SheetContent className="w-[95%] sm:w-[75%]">
            <SheetHeader className="space-y-1 pt-10">
                <SheetTitle className="text-[1.4rem]">
                    <div className="flex items-center justify-between gap-10">
                    {task.taskName}
                    <Button className="text-[.7rem] px-3" variant={"ghost"} title="Szerkesztés">
                        <Edit2 />
                    </Button>
                    </div>
                </SheetTitle>
                <SheetDescription className="pt-1 flex items-center gap-4 border-b pb-6">
                    <Badge className="px-2 py-[.1rem] rounded-md" color={task.status === "pending" ? "orange" : task.status === "in progress" ? "blue" : "green"}>
                        {task.status === "pending" ? "Elvégzendő" : task.status === "in progress" ? "Folyamatban" : "Befejezett"}
                    </Badge>
                    <span className="text-muted-foreground"><span className="text-primary mr-3">{task.createdByUser.name}</span>készítette {formatDistance(new Date(task.createdAt), new Date(), { locale: hu, addSuffix: true })}</span>
                </SheetDescription>
            </SheetHeader>
            <section className="flex w-full h-full">
                <div className="w-[62%] border-r pr-3">
                    <div className="flex gap-6 items-center justify-between my-3">
                        <p className="text-muted-foreground text-[.8rem]">Feladat leírása:</p>
                        <span title="Szerkesztés" className="cursor-pointer rounded-md text-[.8rem]">
                            Szerkesztés
                        </span>
                    </div>
                    <p className="text-sm w-[80%]">{task.taskDescription}</p>
                </div>
                <div className="w-[38%] pl-3">
                    <div className="mt-3">
                        <p className="text-muted-foreground text-[.8rem] mb-3">Kiosztva neki(k):</p>
                        {/* {task.assigns.map((assign) => (
                            <div key={assign.id} className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={assign.user[0].image ? assign.user[0].image : ""} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <p className="text-sm">{assign.user[0].name}</p>
                            </div>
                        ))} */}
                    </div>
                    <div className="mt-3 flex gap-2 items-center">
                        <p className="text-muted-foreground text-[.8rem] mb-3">Prioritás:</p>
                    </div>
                </div>
            </section>
        </SheetContent>
    )
}