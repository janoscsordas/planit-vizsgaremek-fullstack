import { auth } from "@/auth"
import { db } from "@/database"
import { eq } from "drizzle-orm"
import { ChatConversationsTable } from "@/database/schema/chat"
import { Avatar, TextField } from "@radix-ui/themes"
import { Search, Trash2Icon } from "lucide-react"
import { redirect } from "next/navigation"
import Link from "next/link"
import HistoryCard from "@/components/aichat/HistoryCard"

export default async function Page() {
    const session = await auth()

    if (!session || !session.user) {
        return redirect('/login')
    }

    const conversations = await db
        .select()
        .from(ChatConversationsTable)
        .where(eq(ChatConversationsTable.userId, session.user.id))

    return (
        <>
            <header>
                <div className="border-b border-muted">
                    <h1 className="text-lg font-semibold py-3 pl-2">Könyvtár</h1>
                </div>
                <div className="border-b border-muted">
                    <TextField.Root placeholder="Korábbi chat keresés..." className="my-3 mx-2" color="green">
                        <TextField.Slot>
                            <Search className="w-4 h-4" />
                        </TextField.Slot>
                    </TextField.Root>
                </div>
            </header>
            <section className="pl-2 py-3 min-h-[calc(100dvh-110px)] mr-2 max-h-[calc(100dvh-110px)] overflow-y-auto">
                {
                    conversations && conversations.length > 0 ? (
                        conversations.map(conversation => (
                            <HistoryCard key={conversation.id} user={session.user} conversation={conversation} />
                        ))
                    ) : (
                        <p className="text-muted-foreground text-sm">Még nincs chat előzményed.</p>
                    )
                }
            </section>
        </>
    )
}