import AnalyticsCards from "@/components/projects/project/overview/AnalyticsCards";
import RecentActivity from "@/components/projects/project/overview/RecentActivity";
import UserActivityChart from "@/components/projects/project/overview/UserActivityChart";
import { getProjectById } from '@/actions/projects.action'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import ProjectHeader from './header'
import AnalyticsCards from '@/components/projects/project/AnalyticsCards'
import RecentActivity from '@/components/projects/project/RecentActivity'
import UserActivityChart from '@/components/projects/project/UserActivity'

export default async function ProjectPage({
	params,
}: {
	params: Promise<{ projectId: string }>
}) {
	const session = await auth()

	if (!session || !session.user) {
		redirect('/login')
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
		<>
			<ProjectHeader
				breadCrumb={[
					{
						label: projectData.name,
						href: `/projects/${projectData.id}`,
					},
					{
						label: 'Áttekintés',
						href: `/projects/${projectData.id}/`,
						active: true,
					},
				]}
			/>
			<main className="px-6 py-2">
				<h1 className="text-2xl font-bold">{projectData.name}</h1>
				<div>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8">
						<AnalyticsCards />
					</div>
					<div className="grid gap-4 md:grid-cols-2">
						<div className="mt-8 p-6 border border-border rounded-lg shadow ">
						<h1 className="text-xl font-bold">Legutóbbi tevékenységek</h1>
						<p className="text-muted-foreground text-sm mt-1 mb-6">Legutóbb felvett feladatok</p>
						<RecentActivity />
						</div>
						<div className="mt-8 mb-4 md:mb-0 rounded-lg">
						<UserActivityChart />
						</div>
					</div>
				</div>
			</main>
		</>
	)
}
