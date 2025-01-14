"use server"

import { db } from "@/database"
import { UsersTable } from "@/database/schema/user"
import { supabase } from "@/lib/utils/supabase"
import { inArray } from "drizzle-orm"
import { decryptMultipleMessages } from "@/actions/encryptDecryptMessages.action"
import { EnrichedMessage, Message } from "@/lib/definitions/messages"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export async function fetchMessageWithUserDetails(messages: Message[]) {
  const session = await auth()

  if (!session || !session.user) {
    redirect("/login")
  }

  if (messages.length === 0) return []

  // Decrypting messages
  const decryptedMessages = await decryptMultipleMessages(
    messages.map((message) => message.content)
  )

  // Put user ids in a Set
  const userIds = [...new Set(messages.map((message) => message.user_id))]

  // Fetching user details with the user ids from userIds[]
  const userDetails = await db
    .select({
      id: UsersTable.id,
      name: UsersTable.name,
      email: UsersTable.email,
      image: UsersTable.image,
    })
    .from(UsersTable)
    .where(inArray(UsersTable.id, userIds))

  // Returning enriched messages with user details
  return messages.map((message) => {
    const user = userDetails.find((user) => user.id === message.user_id)
    return {
      ...message,
      content: decryptedMessages[messages.indexOf(message)],
      user,
    }
  }) as EnrichedMessage[]
}

export async function removeDeletedUsersMessages(userId: string) {
  if (!userId) {
    return {
      success: false,
      message: "Nem adott meg user ID-t!",
    }
  }

  try {
    await supabase.from("messages").delete().eq("user_id", userId)

    return {
      success: true,
      message: "Törölt felhasználó üzenetei sikeresen törölve!",
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      success: false,
      message: "Hiba történt a felhasználó üzeneteinek törlésekor!",
    }
  }
}
