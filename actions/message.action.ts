"use server"

import { db } from "@/database";
import { UsersTable } from "@/database/schema/user";
import { inArray } from "drizzle-orm";

export type Message = {
    id: string;
    user_id: string;
    project_id: string;
    content: string;
    created_at: Date;
}

export type EnrichedMessage = Message & {
    user: {
        id: string;
        name: string;
        email: string;
        image: string;
    }
}

export async function fetchMessageWithUserDetails(messages: Message[]) {
    const userIds = [...new Set(messages.map((message) => message.user_id))];

    const userDetails = await db
        .select({ id: UsersTable.id, name: UsersTable.name, email: UsersTable.email, image: UsersTable.image })
        .from(UsersTable)
        .where(inArray(UsersTable.id, userIds));

    // Map user details back to messages
    return messages.map((message) => ({
        ...message,
        user: userDetails.find((user) => user.id === message.user_id),
    })) as EnrichedMessage[]
}