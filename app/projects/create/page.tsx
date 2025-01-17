import Navbar from "@/components/projects/Navbar"
import CreateForm from "./create-form"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { NotificationsProvider } from "@/context/NotificationsContext"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Planitapp - Készíts projektet",
  description: "Planitapp - Készíts projektet",
  publisher: "Planitapp",
  openGraph: {
    title: "Planitapp - Készíts projektet",
    description: "Planitapp - Készíts projektet",
    siteName: "Planitapp",
    locale: "hu-HU",
    type: "website",
  },
}

export default async function CreateProject() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <NotificationsProvider userId={session.user.id}>
      {/* navbar + breadcrumbs */}
      <Navbar
        breadCrumb={[
          {
            label: "Főoldal",
            href: "/",
          },
          {
            label: `${session.user.name} projektjei`,
            href: `/projects`,
          },
          {
            label: "Új projekt készítése",
            href: `/projects/create`,
            active: true,
          },
        ]}
        session={session}
      />

      {/* create project form */}
      <CreateForm />
    </NotificationsProvider>
  )
}
