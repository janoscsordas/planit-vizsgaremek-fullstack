import { getProjectById } from "@/actions/projects.action"
import { redirect } from "next/navigation"
import { auth } from "@/auth"

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const session = await auth()

  if (!session || !session.user) {
    redirect("/login")
  }

  const { projectId } = await params

  const project = await getProjectById(projectId)

  if (!project.success || !project.data) {
    return <div>{project.message}</div>
  }

  const projectData = Array.isArray(project.data)
    ? project.data[0]
    : project.data

  return (
    <div>
      <h1 className="text-2xl font-bold">{projectData.name}</h1>
    </div>
  )
}
