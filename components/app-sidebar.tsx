"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
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

// This is sample data.
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Feladatok",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Üzenetek",
      url: "#",
      icon: Bot,
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
