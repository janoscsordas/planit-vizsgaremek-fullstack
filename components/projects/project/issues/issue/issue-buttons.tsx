"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { User } from "next-auth";
import IssueReplyDelete from "./issue-reply-delete";

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

export default function IssueButtons({
    issueId,
    issueReplyId,
    projectId,
    user
}: {
    issueId: number
    issueReplyId: string
    projectId: string
    user: User
}) {

    return (
        <AlertDialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center justify-center">
                        <Ellipsis className="w-4 h-4" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                    <DropdownMenuLabel>Menü</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Szerkesztés</DropdownMenuItem>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-red-500">Hozzászólás törlése</DropdownMenuItem>
                    </AlertDialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Biztosan törölni szeretnéd a hozzászólást?</AlertDialogTitle>
                <AlertDialogDescription>
                    A hozzászólás törlése nem visszafordítható!
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Mégse</AlertDialogCancel>
                    <IssueReplyDelete
                        issueId={issueId}
                        issueReplyId={issueReplyId}
                        projectId={projectId}
                    />
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        
    )
}