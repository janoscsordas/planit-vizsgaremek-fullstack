"use server";

import { auth } from "@/auth";
import { db } from "@/database";
import { ChatConversationsTable, ChatMessagesTable } from "@/database/schema/chat";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function initiateConversation({ 
    message, 
    userId 
}: {
    message: string, 
    userId: string 
}) {
    const session = await auth();
    
    if (!session || !session.user) {
        return {
            success: false,
            message: "Nem vagy bejelentkezve!"
        }
    }

    try {
        const validatedFields = z.object({ 
            message: z.string().nonempty(), 
            userId: z.string().nonempty() 
        }).safeParse({ message, userId });
    
        if (!validatedFields.success) {
            throw new Error("Hibás adatokat adott meg!");
        }

        const botResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/ai-model`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt: message })
        })

        if (!botResponse.ok) {
            const error = await botResponse.json();
            throw new Error("Hiba történt az AI hívás közben! " + error.error);
        }

        // Here we create a new conversation with the given userId
        const [conversation] = await db
            .insert(ChatConversationsTable)
            .values({
                userId,
                title: message.trim().slice(0, 16) + "..."
            })
            .returning({
                id: ChatConversationsTable.id
            })

        if (!conversation) {
            throw new Error("Hiba történt a beszélgetés létrehozása közben!");
        }

        const responseFromBot = await botResponse.json();

        await db
            .insert(ChatMessagesTable)
            .values({
                conversationId: conversation.id,
                userInput: message,
                botResponse: responseFromBot
            })

        console.log("conversation", conversation);

        return {
            success: true,
            conversationId: conversation.id
        }
    } catch (error: any) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Hiba történt!"
        }
    }
}

export async function deleteConversation(conversationId: string) {
    const session = await auth();

    if (!session || !session.user) {
        return {
            success: false,
            message: "Nem vagy bejelentkezve!"
        }
    }

    try {
        await db.delete(ChatConversationsTable).where(eq(ChatConversationsTable.id, conversationId));
    } catch(error: any) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Hiba történt!"
        }
    }

    revalidatePath("/chat/history");
    return {
        success: true,
        message: "Beszélgetés törölve!"
    }
}