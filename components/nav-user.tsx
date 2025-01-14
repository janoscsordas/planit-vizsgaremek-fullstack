"use client"

import { Bell, ChevronsUpDown, LogOutIcon, Sparkles, User } from "lucide-react"

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
import DialogLogoutButton from "./projects/dialog-logout-button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AlertDialogFooter, AlertDialogHeader } from "./ui/alert-dialog"

export function NavUser({ userSession }: { userSession: Session }) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="border-t rounded-lg outline-none bg-sidebar-accent dark:bg-sidebar-accent-dark border-sidebar-accent-dark focus:ring-2 focus:ring-emerald-hover"
            >
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                {userSession.user.image ? (
                  <Avatar
                    src={userSession.user.image}
                    alt="Profilkép"
                    className="w-8 h-8 transition-opacity rounded-lg cursor-pointer hover:opacity-80"
                    fallback={userSession.user.name?.charAt(0) || "?"}
                  />
                ) : (
                  <Avatar
                    radius="large"
                    fallback={userSession.user.name?.charAt(0) || "?"}
                    className="w-8 h-8 transition-opacity cursor-pointer hover:opacity-80"
                  />
                )}
                <div className="grid flex-1 text-sm leading-tight text-left">
                  <span className="font-semibold truncate">
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
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
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
                      className="w-8 h-8 transition-opacity rounded-full cursor-pointer hover:opacity-80"
                      fallback={userSession.user.name?.charAt(0) || "?"}
                    />
                  ) : (
                    <Avatar
                      radius="full"
                      fallback={userSession.user.name?.charAt(0) || "?"}
                      className="w-8 h-8 transition-opacity cursor-pointer hover:opacity-80"
                    />
                  )}
                  <div className="grid flex-1 text-sm leading-tight text-left">
                    <span className="font-semibold truncate">
                      {userSession.user.name}
                    </span>
                    <span className="text-xs truncate text-muted-foreground">
                      {userSession.user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem disabled title="Hamarosan...">
                  <Sparkles />
                  <Link href="#">Váltás Pro-ra</Link>
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
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-red-500 cursor-pointer focus:bg-red-500/80 focus:text-white">
                  <LogOutIcon />
                  Kijelentkezés
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Biztosan ki szeretnél jelentkezni?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Ha most kijelentkezel, bármikor vissza léphetsz.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Mégse</AlertDialogCancel>
              <DialogLogoutButton />
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
