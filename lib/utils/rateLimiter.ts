import { and } from 'drizzle-orm';
import { count, eq } from 'drizzle-orm';
import { db } from "@/database"
import { ChatMessagesTable, DailyMessageCounts } from "@/database/schema/chat"


export async function checkMessageLimit(userId: string): Promise<{
    canSend: boolean,
    error?: string
}> {
    // Get the start of the current day
    const startOfDay = new Date()
    startOfDay.setUTCHours(0, 0, 0, 0)

    // Count messages sent today
    const dailyCount = await db
        .select()
        .from(DailyMessageCounts)
        .where(
            and(
                eq(DailyMessageCounts.userId, userId),
                eq(DailyMessageCounts.date, startOfDay)
            )
        )
        .execute()

    const currentCount = dailyCount[0]?.count ?? 0;
    const DAILY_LIMIT = 20;

    if (currentCount >= DAILY_LIMIT) {
        // Calculate time until reset
        const tomorrow = new Date(startOfDay)
        tomorrow.setDate(tomorrow.getDate() + 1)
        const hoursUntilReset = (tomorrow.getTime() - new Date().getTime()) / (1000 * 60 * 60);

        return {
            canSend: false,
            error: `A napi ${DAILY_LIMIT} üzenet limitet elérted! Legközelebb ${hoursUntilReset.toFixed(1)} óra múlva tudsz üzenetet küldeni!`
        }
    }

    return { canSend: true }
}