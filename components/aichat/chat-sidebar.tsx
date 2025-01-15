import Image from "next/image"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, IconButton } from "@radix-ui/themes"
import { User } from "next-auth"
import {
  BookOpen,
  LogOut,
  MoveLeftIcon,
  PlusIcon,
  UserIcon,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog"
import DialogLogoutButton from "../projects/dialog-logout-button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"

export default function ChatSidebar({ user }: { user: User }) {
  return (
    <TooltipProvider>
      <aside className="fixed top-0 left-0 h-screen px-2 py-3 border-r w-max bg-card border-r-muted">
        <div className="flex flex-col items-center justify-between h-full gap-3">
          <div className="flex flex-col items-center gap-2">
            <Link href="/" className="mb-4 cursor-pointer">
              <Image
                src="/icon.png"
                alt="Logó"
                width={28}
                height={28}
                priority
              />
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/chat">
                  <IconButton
                    variant={"outline"}
                    color="gray"
                    radius={"large"}
                    className="cursor-pointer"
                  >
                    <PlusIcon className="w-4 h-4 text-primary" />
                  </IconButton>
                </Link>
              </TooltipTrigger>
              <TooltipContent side={"right"}>Új chat</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/chat/history"
                  className="p-2 transition-colors duration-150 rounded-md cursor-pointer hover:bg-emerald"
                >
                  <BookOpen className="w-4 h-4 text-primary" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side={"right"}>Könyvtár</TooltipContent>
            </Tooltip>
          </div>
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <button>
                  <Avatar
                    src={user.image || ""}
                    alt={user.name || "Felhasználó"}
                    fallback={user.name?.charAt(0) || "F"}
                    size={"2"}
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" sideOffset={8}>
                <DropdownMenuLabel>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full w-7 h-7">
                      <Avatar
                        src={user.image || ""}
                        radius={"full"}
                        alt={user.name || "Felhasználó"}
                        className="rounded-full"
                        fallback={user.name?.charAt(0) || "F"}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/projects">
                  <DropdownMenuItem>
                    <MoveLeftIcon className="w-5 h-5 mr-2" />
                    Vissza a projektekhez
                  </DropdownMenuItem>
                </Link>
                <Link href="/profile">
                  <DropdownMenuItem>
                    <UserIcon className="w-5 h-5 mr-2" />
                    Profil
                  </DropdownMenuItem>
                </Link>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-red-500">
                    <LogOut className="w-5 h-5 mr-2" />
                    Kijelentkezés
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
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
            </DropdownMenu>
          </AlertDialog>
        </div>
      </aside>
    </TooltipProvider>
  )
}
