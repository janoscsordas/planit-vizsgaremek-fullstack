import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Projects from "@/components/projects/Projects"
import Navbar from "@/components/projects/Navbar"

export default async function ProjectsPage() {
  const session = await auth()

  // checking if the user is logged in
  if (!session?.user) {
    redirect("/login")
  }

  return (
    <>
      <Navbar breadCrumb={
        [
          {
            label: "Főoldal",
            href: "/",
          },
          {
            label: `${session.user.name} projektjei`,
            href: `/projects`,
            active: true
          },
        ]
      } />
      <Projects userSession={session.user} />
    </>
  )
}
