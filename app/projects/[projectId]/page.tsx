import { getProjectById } from "@/actions/projects.action"
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AnalyticsCards from "@/components/projects/project/overview/AnalyticsCards";
import RecentActivity from "@/components/projects/project/overview/RecentActivity";
import { UserActivity } from "@/components/projects/project/overview/UserActivity";

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8">
        <AnalyticsCards />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="mt-8 p-6 border border-border rounded-lg">
          <h1 className="text-xl font-bold">Legutóbbi tevékenységek</h1>
          <p className="text-muted-foreground text-sm mt-1 mb-6">Legutóbb felvett feladatok</p>
          <RecentActivity />
        </div>
        <div className="mt-8 p-6 border border-border rounded-lg">
          <UserActivity />
          <h1></h1>
        </div>
      </div>
    </div>
  )
}
