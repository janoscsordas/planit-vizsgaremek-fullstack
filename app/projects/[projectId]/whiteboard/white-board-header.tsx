import { DropdownMenu, DropdownMenuSeparator, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/utils/supabase";
import { IconButton } from "@radix-ui/themes";
import { MenuIcon, Trash, XIcon } from "lucide-react";
import { toast } from "sonner";

export default function WhiteBoardHeader({ 
    onClose, 
    handleClear,
    projectId,
}: { 
    onClose: () => void,
    handleClear: ([]: any) => void,
    projectId: string
}) {

    const handleClearDrawings = async () => {
        handleClear([])

        await supabase
            .from("drawings")
            .delete()
            .eq('project_id', projectId)

        toast.success("Rajz törölve!", { position: "top-center" })
    }

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
                    <DropdownMenuItem onClick={handleClearDrawings}>
                        <Trash className="w-4 h-4" />
                        <span className="ml-2">Rajz Törlése</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <IconButton onClick={onClose} className="cursor-pointer" variant="ghost" size="2" color="red" radius="medium">
                <XIcon className="h-5 w-5" />
            </IconButton>

        </header>
    )
}