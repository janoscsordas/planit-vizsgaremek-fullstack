import { auth } from "@/auth"
import { db } from "@/database"
import { eq, and, ilike, desc } from "drizzle-orm"
import { ChatConversationsTable } from "@/database/schema/chat"
import { redirect } from "next/navigation"
import HistoryCard from "@/components/aichat/history-card"
import SearchForm from "./search-form"


export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>
}) {
  const session = await auth()

  if (!session || !session.user) {
    return redirect("/login")
  }

  const { query } = (await searchParams) || ""

  async function getChatsByQuery(query: string, userId: string) {
    // If query is empty, return all conversations for the user
    if (!query) {
      return await db
        .select()
        .from(ChatConversationsTable)
        .where(eq(ChatConversationsTable.userId, userId))
        .orderBy(desc(ChatConversationsTable.createdAt))
    }

    // Otherwise, search with the query
    return await db
      .select()
      .from(ChatConversationsTable)
      .where(
        and(
          eq(ChatConversationsTable.userId, userId),
          ilike(ChatConversationsTable.title, `%${query}%`)
        )
      )
      .orderBy(desc(ChatConversationsTable.createdAt))
  }

  const results = await getChatsByQuery(query, session.user.id)

  return (
    <>
      <header>
        <div className="border-b border-muted">
          <h1 className="py-3 pl-2 text-lg font-semibold">Könyvtár</h1>
        </div>
        <div className="border-b border-muted">
          <SearchForm defaultValue={query} />
        </div>
      </header>
      <section className="pl-2 py-3 min-h-[calc(100dvh-110px)] mr-2 flex flex-col gap-2 max-h-[calc(100dvh-110px)] overflow-y-auto">
        {results && results.length > 0 ? (
          results.map((conversation) => (
            <HistoryCard
              key={conversation.id}
              user={session.user}
              conversation={conversation}
            />
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            Még nincs chat előzményed!
          </p>
        )}
      </section>
    </>
  )
}
