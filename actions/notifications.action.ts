"use server"

import { auth } from "@/auth"
import { db } from "@/database";
import { UsersTable } from "@/database/schema/user";
import { validEmailSchema } from "@/lib/schemas/notificationSchema";
import { supabase } from "@/lib/utils/supabase";
import { inArray } from "drizzle-orm";

export async function sendProjectInvites(projectId: string, emails: string[]) {
    const session = await auth()

    if (!session || !session.user) {
        return {
            success: false,
            message: "Nem vagy bejelentkezve!"
        };
    }

    try {
        const validEmails = emails.filter(email => validEmailSchema.safeParse({ email }).success)

        if (!validEmails.length) {
            return {
                success: false,
                message: "Nem adtál meg valid címet!"
            }
        }

        const getIdsByEmail = await db.select({ id: UsersTable.id }).from(UsersTable).where(inArray(UsersTable.email, validEmails))

        if (!getIdsByEmail.length) {
            return {
                success: false,
                message: "Nem található a megadott email címek Közül valid cím!"
            }
        }

        await supabase.from('notifications').insert(getIdsByEmail.map(id => ({
            senderId: session.user.id,
            senderProjectId: projectId,
            receiverId: id.id
        })))

        return {
            success: true,
            message: "Meghívók elküldve a létező email címeknek!"
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Hiba történt a meghívók elküldése közben!"
        }
    }
}