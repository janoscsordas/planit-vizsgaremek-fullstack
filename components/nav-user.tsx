"use client"

import { Bell, ChevronsUpDown, LogOut, Sparkles, User } from "lucide-react"

import { Avatar } from "@radix-ui/themes"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Session } from "next-auth"
import Link from "next/link"

export function NavUser({ userSession }: { userSession: Session }) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="outline-none bg-sidebar-accent dark:bg-sidebar-accent-dark border-t border-sidebar-accent-dark rounded-lg"
          >
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {userSession.user.image ? (
                <Avatar
                  src={userSession.user.image}
                  alt="Profilkép"
                  className="cursor-pointer rounded-full hover:opacity-80 transition-opacity w-9 h-9"
                  fallback={userSession.user.name?.charAt(0) || "?"}
                />
              ) : (
                <Avatar
                  radius="full"
                  fallback={userSession.user.name?.charAt(0) || "?"}
                  className="cursor-pointer rounded-full hover:opacity-80 transition-opacity w-9 h-9"
                />
              )}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {userSession.user.name}
                </span>
                <span className="truncate text-muted-foreground text-[10px]">
                  {userSession.user.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                {userSession.user.image ? (
                  <Avatar
                    src={userSession.user.image}
                    alt="Profilkép"
                    className="cursor-pointer rounded-full hover:opacity-80 transition-opacity w-9 h-9"
                    fallback={userSession.user.name?.charAt(0) || "?"}
                  />
                ) : (
                  <Avatar
                    radius="full"
                    fallback={userSession.user.name?.charAt(0) || "?"}
                    className="cursor-pointer rounded-full hover:opacity-80 transition-opacity w-9 h-9"
                  />
                )}
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {userSession.user.name}
                  </span>
                  <span className="truncate text-muted-foreground text-xs">
                    {userSession.user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem disabled title="Hamarosan...">
                <Sparkles />
                <Link href="/upgrade">Váltás Pro-ra</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href="/profile">
                <DropdownMenuItem className="cursor-pointer">
                  <User />
                  Profil
                </DropdownMenuItem>
              </Link>
              <Link href="/notifications">
                <DropdownMenuItem className="cursor-pointer">
                  <Bell />
                  Értesítések
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <Link href="/logout">
              <DropdownMenuItem className="cursor-pointer">
                <LogOut />
                {/* Alert dialog kijelentkezés megerősítéséhez */}
                Kijelentkezés
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
