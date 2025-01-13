import AnalyticsCards from "@/components/projects/project/overview/AnalyticsCards"
import RecentActivity from "@/components/projects/project/overview/RecentActivity"
import { getProjectById } from "@/actions/projects.action"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import ProjectHeader from "./header"
import {
  fetchAnalyticsForProject,
  fetchRecentActivity,
} from "@/actions/analytics.action"

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
    redirect(`/projects`)
  }

  const projectData = Array.isArray(project.data)
    ? project.data[0]
    : project.data

  // fetching analytics
  const analyticsForCards = await fetchAnalyticsForProject(projectData.id)
  const recentActivity = await fetchRecentActivity(projectData.id)

  return (
    <>
      <ProjectHeader
        breadCrumb={[
          {
            label: projectData.name,
            href: `/projects/${projectData.id}`,
          },
          {
            label: "Áttekintés",
            href: `/projects/${projectData.id}/`,
            active: true,
          },
        ]}
      />
      <main className="px-6 py-2">
        <h1 className="text-2xl font-bold">{projectData.name}</h1>
        <div>
          <div className="grid gap-4 mt-8 md:grid-cols-2 lg:grid-cols-4">
            <AnalyticsCards analyticsForCards={analyticsForCards} />
          </div>
          <div className="">
            <div className="p-6 mt-4 border rounded-lg shadow lg:mt-8 border-border ">
              <h1 className="text-xl font-bold">Legutóbbi tevékenységek</h1>
              <p className="mt-1 mb-6 text-sm text-muted-foreground">
                Legutóbb felvett feladatok
              </p>
              <RecentActivity recentActivity={recentActivity} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
