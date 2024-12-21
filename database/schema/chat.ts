import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { UsersTable } from "./user";


export const ChatConversationsTable = pgTable("chat_conversations", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
        .notNull()
        .references(() => UsersTable.id, { onDelete: "cascade" }),
    title: text("title")
        .notNull(),
    createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
})

export const ChatMessagesTable = pgTable("chat_messages", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    conversationId: text("conversation_id")
        .notNull()
        .references(() => ChatConversationsTable.id, { onDelete: "cascade" }),
    userInput: text("user_input")
        .notNull(),
    botResponse: text("bot_response")
        .notNull(),
    createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
})