"use client"

import * as React from "react"

import { Session } from "next-auth"
import { usePathname } from "next/navigation"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { NavHeader } from "@/components/nav-header"
import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarHeader,
   SidebarRail,
} from "@/components/ui/sidebar"

import {
   Binoculars,
   ClipboardList,
   MessageCircle,
   Users,
   Settings2,
   Presentation,
} from "lucide-react"

const generateNavItems = (
   projectId: string,
   pathName: string,
   isOwner: boolean
) => {
   const baseNavItems = [
      {
         title: "Áttekintés",
         url: `/projects/${projectId}`,
         icon: Binoculars,
         isActive: pathName === `/projects/${projectId}`,
      },
      {
         title: "Feladatok",
         url: `/projects/${projectId}/tasks`,
         icon: ClipboardList,
         isActive: pathName === `/projects/${projectId}/tasks`,
      },
      {
         title: "Üzenetek",
         url: `/projects/${projectId}/messages`,
         icon: MessageCircle,
         isActive: pathName === `/projects/${projectId}/messages`,
      },
      {
         title: "Ötlettábla",
         url: `/projects/${projectId}/whiteboard`,
         icon: Presentation,
         isActive: pathName === `/projects/${projectId}/whiteboard`,
      },
      {
         title: "Tagok",
         url: `/projects/${projectId}/members`,
         icon: Users,
         isActive: pathName === `/projects/${projectId}/members`,
      },
   ]
   if (isOwner) {
      baseNavItems.push({
         title: "Beállítások",
         url: `/projects/${projectId}/settings`,
         icon: Settings2,
         isActive: pathName === `/projects/${projectId}/settings`,
      })
   }

   return baseNavItems
}

export function AppSidebar({
   projectName,
   isOwner,
   userSession,
   projectId,
   ...props
}: React.ComponentProps<typeof Sidebar> & {
   projectName: string
   isOwner: boolean
   userSession: Session
   projectId: string
}) {
   const pathName = usePathname()
   const navMain = generateNavItems(projectId, pathName, isOwner)

   return (
      <Sidebar collapsible="icon" {...props}>
         <SidebarHeader>
            <NavHeader
               userSession={userSession}
               projectId={projectId}
               isOwner={isOwner}
               projectName={projectName}
            />
         </SidebarHeader>
         <SidebarContent>
            <NavMain items={navMain} />
         </SidebarContent>
         <SidebarFooter>
            <NavUser userSession={userSession} />
         </SidebarFooter>
         <SidebarRail />
      </Sidebar>
   )
}
