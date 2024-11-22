"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  MessageCircle,
  Command,
  GalleryVerticalEnd,
  Settings2,
  ClipboardList,
  VenetianMaskIcon,
  Binoculars,
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
  navMain: [
    {
      title: "Áttekintés",
      url: "#",
      icon: Binoculars,
      isActive: true,
    },
    {
      title: "Feladatok",
      url: "#",
      icon: ClipboardList,
    },
    {
      title: "Üzenetek",
      url: "#",
      icon: MessageCircle,
    },
    {
      title: "Dokumentáció",
      url: "#",
      icon: BookOpen,
    },
    {
      title: "Beállítások",
      url: "#",
      icon: Settings2,
    },
  ],
}

export function AppSidebar({
  userSession,
  ...props
}: React.ComponentProps<typeof Sidebar> & { userSession: Session }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser userSession={userSession} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
