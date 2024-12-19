import { auth } from "@/auth";
import ChatComponent from "@/components/aichat/ChatComponent";
import ChatSidebar from "@/components/aichat/ChatSidebar";
import { redirect } from "next/navigation";


export default async function Page() {
    const session = await auth()

    if (!session || !session.user) {
        return redirect('/login')
    }

    return (
        <>
            <ChatSidebar user={session.user} />
            <main className="w-full h-full pl-10">
                <ChatComponent user={session.user} />
            </main>
        </>
    )
}