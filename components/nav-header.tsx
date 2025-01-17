"use client"

import * as React from "react"
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import { leaveProject } from "@/actions/projects.action"

import {
  ChevronsUpDown,
  GalleryVerticalEnd,
  ChevronLeft,
  LogOut,
} from "lucide-react"
import { Session } from "next-auth"

export function NavHeader({
  userSession,
  projectId,
  projectName,
  isOwner,
}: {
  userSession: Session
  projectId: string
  projectName: string
  isOwner: boolean
}) {
  const { isMobile } = useSidebar()

  const handleLeaveProject = async () => {
    const response = await leaveProject(projectId, userSession.user.id)

    if (!response.success) {
      return
    }
  }

  return (
    <>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="focus:ring-2 focus:ring-emerald-hover"
          >
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex items-center justify-center rounded-lg aspect-square size-8 bg-emerald-hover text-sidebar-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="grid flex-1 text-sm leading-tight text-left">
                <span className="font-semibold truncate">{projectName}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="gap-2 p-2 text-xs text-muted-foreground">
              {projectName}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/projects">
              <DropdownMenuItem className="gap-2 p-2">
                <ChevronLeft className="w-4 h-4 shrink-0" />
                Vissza a projektekhez
              </DropdownMenuItem>
            </Link>
            {!isOwner && (
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="gap-2 p-2 text-red-500 focus:text-red-50 focus:bg-red-500">
                  <LogOut className="w-4 h-4 shrink-0" />
                  Kilépés a projektből
                </DropdownMenuItem>
              </AlertDialogTrigger>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Biztosan ki szeretnél lépni a projektből?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Ha kilépsz a projektből később csak egy új meghívóval tudsz
              belépni! A feladataid és az üzeneteid kilépés után is megmaradnak.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Mégse</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 text-red-50 hover:bg-red-600"
              onClick={handleLeaveProject}
            >
              Kilépés
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
