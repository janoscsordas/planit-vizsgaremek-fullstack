import { getProjectById } from "@/actions/projects.action"
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import TodoCard from "@/components/projects/project/TodoCard"
import InprogressCard from "@/components/projects/project/InprogressCard"
import DoneCard from "@/components/projects/project/DoneCard"

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 my-8">
        <TodoCard />
        <InprogressCard />
        <DoneCard />
      </div>
    </div>
  )
}
