import { auth } from "@/auth"
import ChatSidebar from "@/components/aichat/chat-sidebar"
import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
    title: "Planitapp - Planie Chat",
    description: "Planitapp AI chat. Beszélgess Planie-vel!",
}

export default async function Layout({ children }: { children: React.ReactNode }) {

    const session = await auth()

    if (!session || !session.user) {
        return redirect('/login')
    }

    return (
        <>
            <ChatSidebar user={session.user} />
            <main className="w-full h-full pl-12">
                {children}
            </main>
        </>
    )
}