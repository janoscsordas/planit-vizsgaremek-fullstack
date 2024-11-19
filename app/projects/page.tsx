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
      <Navbar />
      <Projects userSession={session.user} />
    </>
  )
}
