"use server"

import { db } from "@/database";
import { UsersTable } from "@/database/schema/user";
import { supabase } from "@/lib/utils/supabase";
import { inArray } from "drizzle-orm";

export type Message = {
    id: string;
    user_id: string;
    project_id: string;
    content: string;
    created_at: Date;
}

export type EnrichedMessage = {
    id: string;
    user_id: string;
    project_id: string;
    content: string;
    created_at: Date;
    user: {
        id: string;
        name: string;
        email: string;
        image: string | undefined;
    }
}

export async function fetchMessageWithUserDetails(messages: Message[]) {
    if (messages.length === 0) return [];

    const userIds = [...new Set(messages.map((message) => message.user_id))];

    const userDetails = await db
        .select({ id: UsersTable.id, name: UsersTable.name, email: UsersTable.email, image: UsersTable.image })
        .from(UsersTable)
        .where(inArray(UsersTable.id, userIds));

    return messages.map((message) => {
        const user = userDetails.find((user) => user.id === message.user_id);
        return { ...message, user };
    }) as EnrichedMessage[];
}

export async function removeDeletedUsersMessages(userId: string) {
    if (!userId) {
        return {
            success: false,
            message: "Nem adott meg user ID-t",
        }
    }

    try {
        await supabase.from('messages').delete().eq('user_id', userId)

        return {
            success: true,
            message: "Törölt felhasználó üzenetei sikeresen törölve",
        }
    } catch (error) {
        console.error(error)
        return {
            success: false,
            message: "Hiba történt a felhasználó üzeneteinek törlésekor",
        }
    }
}