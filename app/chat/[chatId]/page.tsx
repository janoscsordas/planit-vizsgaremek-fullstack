import { auth } from "@/auth";
import MainChatComponent from "@/components/aichat/MainChatComponent";
import { db } from "@/database";
import { ChatConversationsTable, ChatMessagesTable } from "@/database/schema/chat";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";

export default async function ChatPage({ params }: { params: Promise<{ chatId: string }> }) {
    const session = await auth()

    if (!session || !session.user) {
        return redirect('/login')
    }

    const { chatId } = await params;

    const [conversation] = await db
        .select()
        .from(ChatConversationsTable)
        .where(eq(ChatConversationsTable.id, chatId))

    if (!conversation) {
        return notFound()
    }

    const chatMessages = await db
        .select()
        .from(ChatMessagesTable)
        .where(eq(ChatMessagesTable.conversationId, chatId))
    
    return (
        <MainChatComponent user={session.user} messages={chatMessages} />
    )
}