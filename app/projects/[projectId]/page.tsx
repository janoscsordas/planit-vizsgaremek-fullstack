import { getProjectById } from "@/actions/projects.action"
import DeleteAccount from "./DeleteAccount"
import { redirect } from "next/navigation"
import { auth } from "@/auth"


export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const session = await auth()

  if (!session || !session.user) {
    redirect("/login")
  }

  const { projectId } = await params

  const project = await getProjectById(projectId)

  if (!project.success || !project.data) {
    return <div>{project.message}</div>
  }

  const projectData = Array.isArray(project.data) ? project.data[0] : project.data
  return (
    <div>
      {projectData.name}
      <div>
        <DeleteAccount />
      </div>
    </div>
  )
}