import { DropdownMenu, DropdownMenuSeparator, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { IconButton } from "@radix-ui/themes";
import { MenuIcon, Trash, XIcon } from "lucide-react";

export default function WhiteBoardHeader({ onClose }: { onClose: () => void }) {
    return (
        <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-transparent p-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <IconButton className="cursor-pointer" variant="ghost" size="2" color="green" radius="medium">
                        <MenuIcon className="h-5 w-5" />
                        <span className="sr-only">Open menu</span>
                    </IconButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Menuüsor</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Trash className="w-4 h-4" />
                        <span className="ml-2">Törlés</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <nav className="flex items-center gap-3">
                
            </nav>

            <IconButton onClick={onClose} className="cursor-pointer" variant="ghost" size="2" color="red" radius="medium">
                <XIcon className="h-5 w-5" />
            </IconButton>

        </header>
    )
}