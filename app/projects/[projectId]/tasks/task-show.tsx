import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EnrichedTask } from "./task-list";
import { formatDate, formatDistance } from "date-fns";
import { hu } from "date-fns/locale/hu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function TaskShow({
    task,
    children,
}: {
    task: EnrichedTask
    children: React.ReactNode
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Feladat megtekintése</DialogTitle>
                    <DialogDescription className="mb-4">
                        Itt láthatod a feladat részleteit.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-3">
                    <p className="text-white">{task.taskName}</p>
                    <div className="relative text-muted-foreground border p-2 my-4 text-sm rounded-lg">
                        <span className="absolute -top-2.5 text-xs bg-background px-1 left-1 select-none">Leírás:</span>
                        <p>{task.taskDescription}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge className={cn("px-2 py-[.1rem] rounded-md", 
                                task.priority === "low" && "bg-blue-500/10 text-blue-500 hover:bg-blue-500/10 hover:text-blue-500",
                                task.priority === "medium" && "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-500",
                                task.priority === "high" && "bg-red-500/10 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                        )}>
                            {task.priority === "low" ? 
                            "Alacsony" : task.priority === "medium" ? 
                            "Közepes" : "Magas"}
                        </Badge>
                        <Badge className={cn("px-2 py-[.1rem] rounded-md", 
                                task.status === "pending" && "bg-blue-500/10 text-blue-500 hover:bg-blue-500/10 hover:text-blue-500",
                                task.status === "in progress" && "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-500",
                                task.status === "finished" && "bg-green-500/10 text-green-500 hover:bg-green-500/10 hover:green-500"
                        )}>
                            {task.status === "pending" ? 
                            "Elvégzendő" : task.status === "in progress" ? 
                            "Folyamatban" : "Befejezett"}
                        </Badge>
                    </div>
                </div>
                <DialogFooter className="pt-4">
                    <p className="text-sm">{task.createdByUser.name} <span className="text-muted-foreground">készítette {formatDistance(task.createdAt, new Date(), { locale: hu, addSuffix: true })}</span></p>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}