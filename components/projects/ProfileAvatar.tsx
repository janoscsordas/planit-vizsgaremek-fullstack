import { auth } from "@/auth"
import { Avatar, Link } from "@radix-ui/themes"

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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { redirect } from "next/navigation"
import Image from "next/image"
import DialogLogoutButton from "./DialogLogoutButton"
import { LogOutIcon, UserIcon } from "lucide-react"

export default async function ProfileAvatar() {
  const session = await auth()

  if (!session?.user) {
    return redirect("/login")
  }

  return (
    <div className="flex justify-end items-center">
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt="Profilkép"
                width={32}
                height={32}
                className="rounded-full cursor-pointer hover:opacity-80 transition-opacity focus-visible:outline-none"
                style={{ width: "auto", height: "auto" }}
              />
            ) : (
              <Avatar
                radius="full"
                fallback={session.user.name?.charAt(0) || "?"}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Profil Menü</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/profile" className="no-underline">
              <DropdownMenuItem>
                <UserIcon className="w-4 h-4 mr-2" />
                Profil
              </DropdownMenuItem>
            </Link>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="text-red-500 focus:bg-red-500/80 focus:text-white">
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
