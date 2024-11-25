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

const generateNavItems = (projectId?: string) => [
  {
    title: "Áttekintés",
    url: projectId ? `/projects/${projectId}` : "#",
    icon: Binoculars,
    isActive: true,
  },
  {
    title: "Feladatok",
    url: projectId ? `/projects/${projectId}/tasks` : "#",
    icon: ClipboardList,
  },
  {
    title: "Üzenetek",
    url: projectId ? `/projects/${projectId}/messages` : "#",
    icon: MessageCircle,
  },
  {
    title: "Tagok",
    url: projectId ? `/projects/${projectId}/members` : "#",
    icon: Users,
  },
  {
    title: "Beállítások",
    url: projectId ? `/projects/${projectId}/settings` : "#",
    icon: Settings2,
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
  projectId?: string
}) {
  const navMain = generateNavItems(projectId)

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} /> {/* Pass the dynamic nav items */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser userSession={userSession} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
