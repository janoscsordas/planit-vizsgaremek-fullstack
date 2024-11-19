import Navbar from "@/components/projects/Navbar"
import CreateForm from "./create-form"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function CreateProject() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div>
      {/* navbar + breadcrumbs */}
      <Navbar />

      {/* create project form */}
      <CreateForm />
    </div>
  )
}
