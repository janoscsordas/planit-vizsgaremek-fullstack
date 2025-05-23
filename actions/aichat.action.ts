"use server"

import { ChatCompletionMessageParam } from "openai/resources/chat/completions"
import { auth } from "@/auth"
import { db } from "@/database"
import {
  ChatConversationsTable,
  ChatMessagesTable,
  DailyMessageCounts,
} from "@/database/schema/chat"
import { eq, sql, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { OpenAI } from "openai"
import {
  checkMessageLimit,
  cleanupExpiredCounts,
} from "@/lib/utils/rateLimiter"
import { NUMBER_OF_TOKENS_FOR_AI_COMPLETION } from "@/lib/utils/globalVariables"

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/together/v1",
  apiKey: process.env.HUGGING_FACE_API_KEY!,
})

export async function initiateConversation({
  message,
  userId,
}: {
  message: string
  userId: string
}) {
  const session = await auth()

  if (!session || !session.user) {
    return {
      success: false,
      message: "Nem vagy bejelentkezve!",
    }
  }

  try {
    const validatedFields = z
      .object({
        message: z.string().nonempty().max(1536),
        userId: z.string().nonempty(),
      })
      .safeParse({ message, userId })

    if (!validatedFields.success) {
      throw new Error("Hibás adatokat adott meg!")
    }

    // Cleaning up expired counts in the db
    await cleanupExpiredCounts()

    const { canSend, error } = await checkMessageLimit(
      validatedFields.data.userId
    )

    if (!canSend) {
      throw new Error(`${error}`)
    }

    // Here we create a new conversation with the given userId
    const [conversation] = await db
      .insert(ChatConversationsTable)
      .values({
        userId,
        title: validatedFields.data.message.length > 32 ? validatedFields.data.message.trim().slice(0, 32) + "..." : validatedFields.data.message.trim(),
      })
      .returning({
        id: ChatConversationsTable.id,
      })

    if (!conversation) {
      throw new Error("Hiba történt a beszélgetés létrehozása közben!")
    }

    const responseFromBot = await sendMessageToAI(
      message,
      userId,
      conversation.id
    )

    if (!responseFromBot.success) {
      throw new Error(
        responseFromBot.message
          ? responseFromBot.message
          : "Hiba történt a válasz létrehozása közben!"
      )
    }

    const startOfDay = new Date()
    startOfDay.setUTCHours(0, 0, 0, 0)

    await db.insert(ChatMessagesTable).values({
      conversationId: conversation.id,
      userInput: message,
      botResponse: responseFromBot.data
        ? responseFromBot.data
        : "Nem sikerült válaszolni!",
      userId,
    })

    await db
      .insert(DailyMessageCounts)
      .values({
        userId,
        date: startOfDay,
        count: 1,
      })
      .onConflictDoUpdate({
        target: [DailyMessageCounts.userId, DailyMessageCounts.date],
        set: {
          count: sql`${DailyMessageCounts.count} + 1`,
        },
      })

    return {
      success: true,
      conversationId: conversation.id,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Hiba történt!",
    }
  }
}

export async function deleteConversation(conversationId: string) {
  const session = await auth()

  if (!session || !session.user) {
    return {
      success: false,
      message: "Nem vagy bejelentkezve!",
    }
  }

  try {
    await db
      .delete(ChatConversationsTable)
      .where(eq(ChatConversationsTable.id, conversationId))
  } catch (error: any) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Hiba történt!",
    }
  }

  revalidatePath("/chat/history")
  return {
    success: true,
    message: "Beszélgetés törölve!",
  }
}

export async function sendMessageToAI(
  message: string,
  userId: string,
  conversationId: string
) {
  const session = await auth()

  if (!session || !session.user) {
    return {
      success: false,
      message: "Nem vagy bejelentkezve!",
    }
  }

  const { canSend, error } = await checkMessageLimit(userId)

  if (!canSend) {
    return {
      success: false,
      message: error,
    }
  }

  if (!message) {
    return {
      success: false,
      message: "Nem adott meg üzenetet!",
    }
  }

  const validatedFields = z.string().max(1536).nonempty().safeParse(message)

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Hibás adatokat adott meg!",
    }
  }

  // Fetching the recent messages from the conversation (only 4 so it's 8 messages back)
  const recentMessagesFromConversation = await db
    .select()
    .from(ChatMessagesTable)
    .where(eq(ChatMessagesTable.conversationId, conversationId))
    .orderBy(desc(ChatMessagesTable.createdAt))
    .limit(4)

  // Base messages array - always includes system message and current message
  const formattedMessages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: "You are a helpful AI assistant.",
    },
  ]

  // Only add previous messages if they exist
  // Convert each record into two separate messages
  if (
    recentMessagesFromConversation &&
    recentMessagesFromConversation.length > 0
  ) {
    recentMessagesFromConversation.forEach((record) => {
      // Add user message
      formattedMessages.push({
        role: "user",
        content: record.userInput,
      })

      // Add bot response
      formattedMessages.push({
        role: "assistant",
        content: record.botResponse,
      })
    })
  }

  // Always add the current message last
  formattedMessages.push({
    role: "user",
    content: validatedFields.data,
  })

  const chatCompletion = await client.chat.completions.create({
    model: "mistralai/Mistral-7B-Instruct-v0.3",
    messages: formattedMessages,
    max_completion_tokens: NUMBER_OF_TOKENS_FOR_AI_COMPLETION,
  })

  if (!chatCompletion.choices || chatCompletion.choices.length === 0) {
    return {
      success: false,
      message: "Hiba történt a válasz létrehozása közben!",
    }
  }

  return {
    success: true,
    data: chatCompletion.choices[0].message.content,
  }
}

export async function sendNewMessage(
  conversationId: string,
  userId: string,
  message: string
) {
  const session = await auth()

  if (!session || !session.user) {
    return {
      success: false,
      message: "Nem vagy bejelentkezve!",
    }
  }

  // Checking message limit from rate limiter
  const { canSend, error } = await checkMessageLimit(userId)

  // If user's message limit already exceeded 20, deny them from sending a message
  if (!canSend) {
    return {
      success: false,
      message: error,
    }
  }

  try {
    // Validating data sent from client
    const validatedFields = z
      .object({
        conversationId: z.string().nonempty(),
        userId: z.string().nonempty(),
        message: z.string().nonempty().max(1536),
      })
      .safeParse({ conversationId, userId, message })

    if (!validatedFields.success) {
      throw new Error("Hibás adatokat adott meg!")
    }

    // Cleaning up expired counts in the db
    await cleanupExpiredCounts()

    // Awaiting AI response
    const responseFromBot = await sendMessageToAI(
      validatedFields.data.message,
      validatedFields.data.userId,
      conversationId
    )

    if (!responseFromBot.success) {
      throw new Error(
        responseFromBot.message
          ? responseFromBot.message
          : "Hiba történt a válasz létrehozása közben!"
      )
    }

    // Adding the message to the database
    const [addedMessage] = await db
      .insert(ChatMessagesTable)
      .values({
        conversationId: validatedFields.data.conversationId,
        userInput: validatedFields.data.message,
        botResponse: responseFromBot.data
          ? responseFromBot.data
          : "Nem sikerült válaszolni!",
        userId,
      })
      .returning({
        id: ChatMessagesTable.id,
        conversationId: ChatMessagesTable.conversationId,
        userInput: ChatMessagesTable.userInput,
        botResponse: ChatMessagesTable.botResponse,
        createdAt: ChatMessagesTable.createdAt,
      })

    if (!addedMessage) {
      throw new Error("Hiba történt az üzenet küldése közben!")
    }

    // Get the start of today's date
    const startOfDay = new Date()
    startOfDay.setUTCHours(0, 0, 0, 0)

    // Incrementing the count of sent messages that day
    await db
      .insert(DailyMessageCounts)
      .values({
        userId,
        date: startOfDay,
        count: 1,
      })
      .onConflictDoUpdate({
        target: [DailyMessageCounts.userId, DailyMessageCounts.date],
        set: {
          count: sql`${DailyMessageCounts.count} + 1`,
        },
      })

    // Returning message block from db to the client for a "realtime" feel
    return {
      success: true,
      data: addedMessage,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Hiba történt!",
    }
  }
}
