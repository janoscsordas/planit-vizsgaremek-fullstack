"use client";

import { deleteConversation } from "@/actions/aichat.action";
import { Avatar } from "@radix-ui/themes";
import { formatDistance } from "date-fns";
import { hu } from "date-fns/locale/hu";
import { Trash2Icon } from "lucide-react";
import { User } from "next-auth";
import Link from "next/link";
import { toast } from "sonner";

export default function HistoryCard({
    user,
    conversation,
}: {
    user: User,
    conversation: { 
        id: string, 
        title: string, 
        userId: string,
        createdAt: Date
    }
}) {

    const removeConversation = async (conversationId: string) => {
        // Remove conversation from database
        const response = await deleteConversation(conversationId);

        if (!response.success) {
            toast.error(response.message, { position: "top-center" });
        }

        toast.success("Chat törölve!", { position: "top-center" });
    }

    return (
        <div key={conversation.id} className="w-full border border-secondary rounded-md py-2 px-3"> 
            <Link href={`/chat/${conversation.id}`}>
                <h3 className="text-sm font-semibold">{conversation.title}</h3>
            </Link>
            <div className="border-t border-muted w-full mt-1 pt-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Avatar 
                        className="w-4 h-4" 
                        src={user.image || ""} 
                        fallback={user.name?.charAt(0) || "F"} 
                        radius="full"
                    />
                    <p className="text-xs">{user.name}</p>
                    <p className="text-[.65rem] text-muted-foreground">Készítetted {formatDistance(conversation.createdAt, new Date(), { addSuffix: true, locale: hu })}</p>
                </div>
                <div>
                    <button className="text-red-500" onClick={() => removeConversation(conversation.id)}>
                        <Trash2Icon className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}