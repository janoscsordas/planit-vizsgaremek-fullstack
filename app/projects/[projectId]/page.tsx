import { getProjectById } from "@/actions/projects.action"


export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params

  const project = await getProjectById(projectId)

  if (!project.success || !project.data) {
    return <div>{project.message}</div>
  }

  const projectData = Array.isArray(project.data) ? project.data[0] : project.data
  return <div>{projectData.name}</div>
}