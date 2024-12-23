"use server";

import { auth } from "@/auth";
import { db } from "@/database";
import { ChatConversationsTable, ChatMessagesTable } from "@/database/schema/chat";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { OpenAI } from "openai";

const client = new OpenAI({
    baseURL: "https://api-inference.huggingface.co/v1/",
    apiKey: process.env.HUGGING_FACE_API_KEY!
});

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
            message: z.string().nonempty().max(1536), 
            userId: z.string().nonempty() 
        }).safeParse({ message, userId });
    
        if (!validatedFields.success) {
            throw new Error("Hibás adatokat adott meg!");
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

        const responseFromBot = await sendMessageToAI(message);

        if (!responseFromBot.success) {
            throw new Error(responseFromBot.message? responseFromBot.message : "Hiba történt a válasz létrehozása közben!");
        }

        await db
            .insert(ChatMessagesTable)
            .values({
                conversationId: conversation.id,
                userInput: message,
                botResponse: responseFromBot.data ? responseFromBot.data : "Nem sikerült válaszolni!",
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

export async function sendMessageToAI(message: string) {
    const session = await auth();

    if (!session || !session.user) {
        return {
            success: false,
            message: "Nem vagy bejelentkezve!"
        }
    }

    if (!message) {
        return {
            success: false,
            message: "Nem adott meg üzenetet!"
        }
    }

    const validatedFields = z.string().max(1536).nonempty().safeParse(message);

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Hibás adatokat adott meg!"
        }
    }

    const chatCompletion = await client.chat.completions.create({
        model: "mistralai/Mistral-7B-Instruct-v0.3",
        messages: [
            {
                role: "user",
                content: validatedFields.data
            }
        ],
        max_tokens: 1000
    });

    if (!chatCompletion.choices || chatCompletion.choices.length === 0) {
        return {
            success: false,
            message: "Hiba történt a válasz létrehozása közben!"
        }
    }

    return {
        success: true,
        data: chatCompletion.choices[0].message.content
    };
}

export async function sendNewMessage(conversationId: string, userId: string, message: string) {
    const session = await auth();

    if (!session || !session.user) {
        return {
            success: false,
            message: "Nem vagy bejelentkezve!"
        }
    }

    try {
        const validatedFields = z.object({ 
            conversationId: z.string().nonempty(), 
            userId: z.string().nonempty(), 
            message: z.string().nonempty().max(1536) 
        }).safeParse({ conversationId, userId, message });
    
        if (!validatedFields.success) {
            throw new Error("Hibás adatokat adott meg!");
        }

        const responseFromBot = await sendMessageToAI(validatedFields.data.message);

        if (!responseFromBot.success) {
            throw new Error(responseFromBot.message? responseFromBot.message : "Hiba történt a válasz létrehozása közben!");
        }

        const [addedMessage] = await db
            .insert(ChatMessagesTable)
            .values({
                conversationId: validatedFields.data.conversationId,
                userInput: validatedFields.data.message,
                botResponse: responseFromBot.data ? responseFromBot.data : "Nem sikerült válaszolni!",
            })
            .returning({
                id: ChatMessagesTable.id,
                conversationId: ChatMessagesTable.conversationId,
                userInput: ChatMessagesTable.userInput,
                botResponse: ChatMessagesTable.botResponse,
                createdAt: ChatMessagesTable.createdAt
            })

        if (!addedMessage) {
            throw new Error("Hiba történt az üzenet küldése közben!");
        }

        return {
            success: true,
            data: addedMessage
        }
    } catch (error: any) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Hiba történt!"
        }
    }
}