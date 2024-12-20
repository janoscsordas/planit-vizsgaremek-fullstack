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
        <ChatComponent user={session.user} />
    )
}