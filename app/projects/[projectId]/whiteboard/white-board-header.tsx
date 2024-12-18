import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { IconButton } from "@radix-ui/themes";
import { MenuIcon, XIcon } from "lucide-react";

export default function WhiteBoardHeader({ onClose }: { onClose: () => void }) {

    return (
        <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-transparent p-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <IconButton variant="ghost" size="2" color="green">
                        <MenuIcon className="h-5 w-5" />
                        <span className="sr-only">Open menu</span>
                    </IconButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Menüsor</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                </DropdownMenuContent>
            </DropdownMenu>

            <nav className="flex items-center gap-3">
                
            </nav>

            <IconButton onClick={onClose} variant="ghost" size="2" color="red">
                <XIcon className="h-5 w-5" />
            </IconButton>

        </header>
    )
}