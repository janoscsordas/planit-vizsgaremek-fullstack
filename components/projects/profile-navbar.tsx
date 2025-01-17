import { Avatar } from "@radix-ui/themes"
import Link from "next/link"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import DialogLogoutButton from "./dialog-logout-button"
import { LogOutIcon, UserIcon } from "lucide-react"
import { Session } from "next-auth"

export default function ProfileAvatar({ session }: { session: Session }) {
  return (
    <div className="flex items-center justify-end">
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            {session.user.image ? (
              <Avatar
                radius="full"
                alt="Avatar"
                src={session.user.image}
                fallback={session.user.name?.charAt(0) || "?"}
                className="transition-opacity cursor-pointer hover:opacity-80"
              />
            ) : (
              <Avatar
                radius="full"
                alt="Avatar"
                fallback={session.user.name?.charAt(0) || "?"}
                className="transition-opacity cursor-pointer hover:opacity-80"
              />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div className="grid flex-1 text-left text-sm leading-tight p-[10px]">
              <span className="font-semibold truncate">
                {session.user.name}
              </span>
              <span className="text-xs truncate text-muted-foreground">
                {session.user.email}
              </span>
            </div>
            <DropdownMenuSeparator />
            <Link href="/profile" className="no-underline" aria-label="Profil">
              <DropdownMenuItem className="cursor-pointer">
                <UserIcon className="w-4 h-4 mr-2" />
                Profil
              </DropdownMenuItem>
            </Link>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="text-red-500 cursor-pointer focus:bg-red-500/80 focus:text-white">
                <LogOutIcon className="w-4 h-4 mr-2" />
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
    </div>
  )
}
