"use client"
import * as React from "react"
import {
  AudioWaveform,
  MessageCircle,
  Command,
  GalleryVerticalEnd,
  Settings2,
  ClipboardList,
  Binoculars,
  Users,
} from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Session } from "next-auth"
import { usePathname } from "next/navigation"

const generateNavItems = (projectId: string, pathName: string) => [
  {
    title: "Áttekintés",
    url: `/projects/${projectId}`,
    icon: Binoculars,
    isActive: pathName === `/projects/${projectId}` ? true : false,
  },
  {
    title: "Feladatok",
    url: `/projects/${projectId}/tasks`,
    icon: ClipboardList,
    isActive: pathName === `/projects/${projectId}/tasks` ? true : false,
  },
  {
    title: "Üzenetek",
    url: `/projects/${projectId}/messages`,
    icon: MessageCircle,
    isActive: pathName === `/projects/${projectId}/messages` ? true : false,
  },
  {
    title: "Tagok",
    url: `/projects/${projectId}/members`,
    icon: Users,
    isActive: pathName === `/projects/${projectId}/members` ? true : false,
  },
  {
    title: "Beállítások",
    url: `/projects/${projectId}/settings`,
    icon: Settings2,
    isActive: pathName === `/projects/${projectId}/settings` ? true : false,
  },
]

const data = {
  teams: [
    {
      name: "Villámcsapat",
      logo: GalleryVerticalEnd,
    },
    {
      name: "Harcosok",
      logo: AudioWaveform,
    },
    {
      name: "Csillagvadászok",
      logo: Command,
    },
  ],
}

export function AppSidebar({
  userSession,
  projectId,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  userSession: Session
  projectId: string
}) { 
  const pathName = usePathname()
  const navMain = generateNavItems(projectId, pathName)

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
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
