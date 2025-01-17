"use client"

import { changeMembershipStatus, removeUserFromProject } from "@/actions/projects.action"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Ban, Loader2, UserCheck, UserMinus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function MembershipModifierComponent({
  memberId,
  memberName,
  projectId,
  children,
  isAdmin
}: {
  memberId: string
  memberName: string
  projectId: string
  children: React.ReactNode
  isAdmin: boolean
}) {
  const [removing, setRemoving] = useState(false)

  const handleRemoveMemberFromProject = async () => {
    setRemoving(true)
    const response = await removeUserFromProject(projectId, memberId)

    if (!response.success) {
      toast.error(response.message, { duration: 3000, position: "top-center" })
      setRemoving(false)
      return
    }

    setRemoving(false)
    toast.success(response.message, { duration: 3000, position: "top-center" })
  }

  const handleMembershipChange = async (isAdmin: boolean) => {
    const response = await changeMembershipStatus(projectId, memberId, isAdmin)

    if (!response.success) {
      toast.error(response.message, { duration: 3000, position: "top-center" })
      return
    }

    toast.success(response.message, { duration: 3000, position: "top-center" })
  }

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="text-center">
            {memberName}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleMembershipChange(isAdmin)}>
            {
              isAdmin ? (
                <div className="flex items-center gap-2">
                  <UserMinus className="w-4 h-4 mr-2" /> Taggá fokozás
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 mr-2" /> Adminná tétel
                </div>
              )
            }
          </DropdownMenuItem>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem>
              <div className="flex items-center gap-2 text-red-500">
                <Ban className="w-4 h-4 mr-2" /> Eltávolítás
              </div>
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Biztosan eltávolítod a(z) {memberName} tagot?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Később, ha meggondolnád magad, visszahívhatod.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Mégse</AlertDialogCancel>
          <AlertDialogAction
            className="text-white bg-red-500 hover:bg-red-600"
            disabled={removing}
            onClick={handleRemoveMemberFromProject}
          >
            {removing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <>Eltávolítás</>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
