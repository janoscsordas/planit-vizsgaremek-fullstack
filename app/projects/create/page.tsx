import Navbar from "@/components/projects/Navbar"
import CreateForm from "./create-form"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { NotificationsProvider } from "@/context/NotificationsContext"

export default async function CreateProject() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <NotificationsProvider userId={session.user.id}>
      {/* navbar + breadcrumbs */}
      <Navbar breadCrumb={
        [
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
          }
        ]
      } session={session} />

      {/* create project form */}
      <CreateForm />
    </NotificationsProvider>
  )
}
