import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Projects from "@/components/projects/Projects"
import Navbar from "@/components/projects/Navbar"
import { NotificationsProvider } from "@/context/NotificationsContext"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Planitapp - Projektek",
  description: "Planitapp - Projektek",
  publisher: "Planitapp",
  openGraph: {
    title: "Planitapp - Projektek",
    description: "Planitapp - Projektek",
    siteName: "Planitapp",
    locale: "hu-HU",
    type: "website",
  },
}

export default async function ProjectsPage() {
  const session = await auth()

  // checking if the user is logged in
  if (!session?.user) {
    redirect("/login")
  }

  return (
    <NotificationsProvider userId={session.user.id}>
      <Navbar
        breadCrumb={[
          {
            label: "Főoldal",
            href: "/",
          },
          {
            label: `${session.user.name} projektjei`,
            href: `/projects`,
            active: true,
          },
        ]}
        session={session}
      />
      <Projects userSession={session.user} />
    </NotificationsProvider>
  )
}
