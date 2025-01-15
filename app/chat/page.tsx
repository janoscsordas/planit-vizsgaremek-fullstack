import { auth } from "@/auth"
import ChatComponent from "@/components/aichat/chat-component"
import { redirect } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Planitapp - Planie Chat",
  description: "Planitapp AI chat. Beszélgess Planie-vel!",
  publisher: "Planitapp",
  openGraph: {
    title: "Planitapp - Planie Chat",
    description: "Planitapp AI chat. Beszélgess Planie-vel!",
    siteName: "Planitapp",
    locale: "hu-HU",
    type: "website",
  },
}

export default async function Page() {
  const session = await auth()

  if (!session || !session.user) {
    return redirect("/login")
  }

  return <ChatComponent user={session.user} />
}
