"use client"

import {
   addAssignsToTask,
   changeTaskStatus,
   removeUserFromTaskAssignsAction,
   updateTaskDescription,
   updateTaskName,
   updateTaskPriority,
} from "@/actions/projectTask.action"
import { type TaskStatus } from "@/lib/definitions/tasks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
   SelectLabel,
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select"
import {
   Sheet,
   SheetContent,
   SheetDescription,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { SelectGroup } from "@radix-ui/react-select"
import { Avatar, Badge } from "@radix-ui/themes"
import { formatDistance } from "date-fns"
import { hu } from "date-fns/locale"
import {
   ArrowDown,
   ArrowRight,
   ArrowUp,
   Check,
   Edit2,
   Loader2,
   Search,
} from "lucide-react"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Member, User } from "@/lib/definitions/projects"
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { EnrichedTask } from "@/lib/definitions/tasks"
import { cn } from "@/lib/utils"

export default function EditAndShowSheet({
   task,
   children,
}: {
   task: EnrichedTask
   children: React.ReactNode
}) {
   const handlePriorityChange = async (priority: string) => {
      const response = await updateTaskPriority(
         task.id,
         priority,
         task.projectId
      )

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
      <Sheet>
         <SheetTrigger asChild>{children}</SheetTrigger>
         <SheetContent className="w-full sm:w-[75%]">
            <SheetHeader className="pt-10 space-y-1">
               <SheetTitle className="text-[1.4rem]">
                  <TaskTitle task={task} />
               </SheetTitle>
               <SheetDescription className="flex items-center gap-4 pt-1 pb-6 border-b">
                  <TaskStatus task={task} />

                  <span className="text-muted-foreground">
                     <span className="mr-3 text-primary">
                        {task.createdByUser.name}
                     </span>
                     készítette{" "}
                     {formatDistance(new Date(task.createdAt), new Date(), {
                        locale: hu,
                        addSuffix: true,
                     })}
                  </span>
               </SheetDescription>
            </SheetHeader>
            <section className="flex flex-col w-full h-full md:flex-row">
               <TaskDescription task={task} />

               <div className="md:w-[38%] w-full pl-3 flex flex-col">
                  <div className="flex items-center justify-between mt-3 mb-4">
                     <p className="text-muted-foreground text-[.8rem]">
                        Kiosztás:
                     </p>
                     <AssignTask
                        members={task.members}
                        projectOwner={task.projectOwner}
                        task={task}
                     />
                  </div>
                  <div className="flex flex-col mt-3 mb-4">
                     <p className="text-muted-foreground text-[.8rem]">
                        Kiosztva a Következö{task.assigns.length > 1 ? "k" : ""}
                        nek:
                     </p>
                     <ul className="flex flex-col gap-2 mt-4">
                        {task.assigns.length > 0 ? (
                           task.assigns.map((assign) => (
                              <li
                                 key={assign.id}
                                 className="flex items-center gap-2"
                              >
                                 <Avatar
                                    className="w-6 h-6 mx-2 rounded-full"
                                    src={assign.user.image!}
                                    fallback={
                                       assign.user.name
                                          ?.charAt(0)
                                          .toUpperCase() || "U"
                                    }
                                    alt={assign.user.name!}
                                 />
                                 <span
                                    className="text-muted-foreground text-[.8rem]"
                                    title={assign.user.name!}
                                 >
                                    {assign.user.name!.slice(0, 20)}
                                    {assign.user.name!.length > 20 ? "..." : ""}
                                 </span>
                              </li>
                           ))
                        ) : (
                           <li className="flex items-center gap-2">
                              <span className="text-muted-foreground text-[.8rem]">
                                 Nincs kiosztva senkinek.
                              </span>
                           </li>
                        )}
                     </ul>
                  </div>
                  <div className="flex flex-col items-start justify-between gap-2 mt-3 mb-3 sm:flex-row sm:items-center">
                     <p className="text-muted-foreground text-[.8rem]">
                        Prioritás:
                     </p>
                     <Select
                        onValueChange={(value) => handlePriorityChange(value)}
                     >
                        <SelectTrigger className="w-[150px]">
                           <SelectValue
                              placeholder={
                                 task.priority === "low"
                                    ? "Alacsony"
                                    : task.priority === "medium"
                                      ? "Közepes"
                                      : "Magas"
                              }
                           />
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
      </Sheet>
   )
}

// child component for changing the task's status inside the sheet
function TaskStatus({ task }: { task: EnrichedTask }) {
   // handling status change for the specific task
   const handleStatusChange = async (changedStatus: string) => {
      const { status } = task

      if (status === changedStatus) {
         return
      }

      // changing changedStatus into unknown then into Status so it works
      const statusToEnum: TaskStatus = changedStatus as unknown as TaskStatus
      const response = await changeTaskStatus(
         statusToEnum,
         task.id,
         task.projectId
      )

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
            <Badge
               className="px-2 py-[.1rem] rounded-md cursor-pointer"
               color={
                  task.status === "pending"
                     ? "orange"
                     : task.status === "in progress"
                       ? "blue"
                       : "green"
               }
            >
               {task.status === "pending"
                  ? "Elvégzendő"
                  : task.status === "in progress"
                    ? "Folyamatban"
                    : "Befejezett"}
            </Badge>
         </DropdownMenuTrigger>
         <DropdownMenuContent className="w-max">
            <DropdownMenuLabel>Feladat Státusza</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
               <DropdownMenuItem onClick={() => handleStatusChange("pending")}>
                  <Badge
                     className="px-2 py-[.1rem] rounded-md w-full"
                     color="orange"
                  >
                     Elvégzendő
                  </Badge>
               </DropdownMenuItem>
               <DropdownMenuItem
                  onClick={() => handleStatusChange("in progress")}
               >
                  <Badge
                     className="px-2 py-[.1rem] rounded-md w-full"
                     color="blue"
                  >
                     Folyamatban
                  </Badge>
               </DropdownMenuItem>
               <DropdownMenuItem onClick={() => handleStatusChange("finished")}>
                  <Badge
                     className="px-2 py-[.1rem] rounded-md w-full"
                     color="green"
                  >
                     Befejezett
                  </Badge>
               </DropdownMenuItem>
            </DropdownMenuGroup>
         </DropdownMenuContent>
      </DropdownMenu>
   )
}

function TaskDescription({ task }: { task: EnrichedTask }) {
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

         const response = await updateTaskDescription(
            task.id,
            taskDescription,
            task.projectId
         )

         if (response.success) {
            toast("Sikeres módosítás!", {
               description: response.message,
               position: "bottom-left",
            })
         }
      } catch (error) {
         toast("Hiba történt!", {
            description:
               error instanceof Error
                  ? error.message
                  : "Hiba történt a feladat leírásának módosítása Közben!",
            position: "bottom-left",
         })
      } finally {
         setIsLoading(false)
         setIsEditing(false)
      }
   }

   return (
      <div className="md:w-[62%] md:border-r border-b w-full md:pr-3 p-2">
         <div className="flex items-center justify-between gap-6 my-3">
            <p className="text-muted-foreground text-[.8rem]">
               Feladat leírása:
            </p>
            {isEditing ? (
               <Button
                  disabled={isLoading}
                  variant={"ghost"}
                  className="cursor-pointer rounded-md text-[.8rem]"
                  onClick={handleSubmit}
               >
                  Mentés
               </Button>
            ) : (
               <Button
                  variant={"ghost"}
                  className="cursor-pointer rounded-md text-[.8rem]"
                  onClick={() => setIsEditing(!isEditing)}
               >
                  Szerkesztés
               </Button>
            )}
         </div>
         <div>
            {isEditing ? (
               <Textarea
                  required
                  rows={4}
                  placeholder="Feladat leírása..."
                  disabled={isLoading}
                  className="resize-none w-[80%] h-32 bg-muted-foreground/5 rounded-md p-2"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
               ></Textarea>
            ) : (
               <p className="text-sm w-[80%] break-words">
                  {task.taskDescription}
               </p>
            )}
         </div>
      </div>
   )
}

function TaskTitle({ task }: { task: EnrichedTask }) {
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

         const response = await updateTaskName(
            task.id,
            taskTitle,
            task.projectId
         )

         if (response.success) {
            toast("Sikeres módosítás!", {
               description: response.message,
               position: "bottom-left",
            })
         }
      } catch (error) {
         toast("Hiba történt!", {
            description:
               error instanceof Error
                  ? error.message
                  : "Hiba történt a feladat nevének módosítása Közben!",
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
               <Input
                  required
                  placeholder="Feladat neve..."
                  disabled={isLoading}
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
               />
               <Button
                  disabled={isLoading}
                  variant={"ghost"}
                  title="Mentés"
                  onClick={handleSubmit}
               >
                  <Check className="w-4 h-4" />
               </Button>
            </>
           ) : (
            <>
               <h1
                  className={cn(
                     "font-semibold text-left",
                     task.taskName.length > 50 && "text-sm"
                  )}
               >
                  {task.taskName}
               </h1>
               <Button
                  className="text-[.7rem] px-3"
                  variant={"ghost"}
                  title="Szerkesztés"
                  onClick={() => setIsEditing(!isEditing)}
               >
                  <Edit2 />
               </Button>
            </>
         )}
      </div>
   )
}

// Type definitions to improve type safety
interface UserAssignment {
   id: string
   name: string | null
   image: string | null
   isChecked?: boolean
}

interface AssignTaskProps {
   members: Member[]
   projectOwner?: {
      id: string
      name: string | null
      image: string | null
      email: string | null
   }
   task: EnrichedTask
}

function AssignTask({ members, projectOwner, task }: AssignTaskProps) {
   // State management
   const [isPopoverOpen, setIsPopoverOpen] = useState(false)
   const [selectedUsers, setSelectedUsers] = useState<Set<string>>(
      new Set(task.assigns.map((assign) => assign.userId))
   )
   const [searchQuery, setSearchQuery] = useState("")
   const [isLoading, setIsLoading] = useState(false)

   // When opening the popover, reset the selected users to match current assignments
   useEffect(() => {
      if (isPopoverOpen) {
         setSelectedUsers(new Set(task.assigns.map((assign) => assign.userId)))
      }
   }, [isPopoverOpen, task.assigns])

   // Memoized list of all users including project owner
   const allUsers = useMemo<UserAssignment[]>(
      () => [
         ...(projectOwner
            ? [
                 {
                    id: projectOwner.id,
                    name: projectOwner.name,
                    image: projectOwner.image,
                 },
              ]
            : []),
         ...members.map((member) => ({
            id: member.user.id,
            name: member.user.name,
            image: member.user.image,
         })),
      ],
      [projectOwner, members]
   )

   // Memoized and filtered users based on search query
   const filteredUsers = useMemo<UserAssignment[]>(
      () =>
         allUsers
            .filter((user) =>
               user.name?.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((user) => ({
               ...user,
               isChecked: task.assigns.some(
                  (assign) => assign.userId === user.id
               ),
            })),
      [allUsers, searchQuery, task.assigns]
   )

   // Toggle user selection
   const toggleUserSelection = useCallback(
      async (userId: string) => {
         setIsLoading(true)
         try {
            if (selectedUsers.has(userId)) {
               // Remove user for selectedUsers
               setSelectedUsers((prev) => {
                  const updated = new Set(prev)
                  updated.delete(userId)
                  return updated
               })
            } else {
               // Add user
               setSelectedUsers((prev) => new Set(prev).add(userId))
            }
         } catch (error) {
            toast.error("Hiba történt", {
               description:
                  error instanceof Error ? error.message : "Szerverhiba",
               position: "bottom-left",
            })
         } finally {
            setIsLoading(false)
         }
      },
      [removeUserFromTaskAssignsAction, task.id, task.projectId, task.assigns]
   )

   // Handle task assignment
   const handleTaskAssignment = async () => {
      if (isLoading) return

      setIsLoading(true)
      try {
         const selectedUserIds = Array.from(selectedUsers)

         // Find new assignments (users not currently assigned)
         const newAssignments = selectedUserIds.filter(
            (userId) => !task.assigns.some((assign) => assign.userId === userId)
         )

         // Find users to remove (currently assigned but not in selected)
         const usersToRemove = task.assigns
            .filter((assign) => !selectedUserIds.includes(assign.userId))
            .map((assign) => assign.userId)

         // Add new assignments
         if (newAssignments.length > 0) {
            await addAssignsToTask(newAssignments, task.id, task.projectId)
         }

         // Remove unselected users
         for (const userId of usersToRemove) {
            await removeUserFromTaskAssignsAction(
               userId,
               task.id,
               task.projectId
            )
         }

         // Provide feedback
         if (newAssignments.length > 0 || usersToRemove.length > 0) {
            toast.success("Feladat sikeresen frissítve!", {
               position: "bottom-left",
            })
         }

         setIsPopoverOpen(false)
      } catch (error) {
         toast.error("Hiba történt a feladat kiosztása közben", {
            description: error instanceof Error ? error.message : "Szerverhiba",
            position: "bottom-left",
         })
      } finally {
         setIsLoading(false)
         setIsPopoverOpen(false)
      }
   }

   return (
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
         <PopoverTrigger asChild>
            <Button variant="outline">Feladat Kirendelés</Button>
         </PopoverTrigger>
         <PopoverContent className="w-80">
            <div className="space-y-4">
               <h4 className="font-medium leading-none">Tagok Kiválasztása</h4>

               <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                     placeholder="Search team members..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="pl-8"
                     name="search"
                     id="search"
                  />
               </div>

               <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {filteredUsers.length > 0 ? (
                     filteredUsers.map((member) => (
                        <div
                           key={member.id}
                           className="flex items-center space-x-2"
                        >
                           <Checkbox
                              id={`user-${member.id}`}
                              checked={selectedUsers.has(member.id)}
                              onCheckedChange={() =>
                                 toggleUserSelection(member.id)
                              }
                              disabled={isLoading}
                              name="chekbox"
                           />
                           <Label
                              htmlFor={`user-${member.id}`}
                              className="flex items-center space-x-2 text-sm font-medium"
                           >
                              <Avatar
                                 src={member.image ?? ""}
                                 fallback={
                                    member.name?.charAt(0).toUpperCase() ?? "??"
                                 }
                                 alt={member.name ?? "Ismeretlen"}
                                 className="w-6 h-6 rounded-full"
                              />
                              <span title={member.name ?? "Ismeretlen"}>
                                 {member.name
                                    ? `${member.name.slice(0, 20)}${member.name.length > 20 ? "..." : ""}`
                                    : "Unknown User"}
                              </span>
                           </Label>
                        </div>
                     ))
                  ) : (
                     <p className="text-sm text-muted-foreground">
                        Nem található tag.
                     </p>
                  )}
               </div>

               <Button
                  disabled={isLoading}
                  onClick={handleTaskAssignment}
                  className="w-full"
               >
                  {isLoading ? (
                     <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                     "Hozzáadás"
                  )}
               </Button>
            </div>
         </PopoverContent>
      </Popover>
   )
}
