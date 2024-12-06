import AnalyticsCards from '@/components/projects/project/overview/AnalyticsCards'
import RecentActivity from '@/components/projects/project/overview/RecentActivity'
import UserActivityChart from '@/components/projects/project/overview/UserActivityChart'
import { getProjectById } from '@/actions/projects.action'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import ProjectHeader from './header'
import {
	fetchAnalyticsForProject,
	fetchRecentActivity,
} from '@/actions/analytics.action'

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
		// ha nincs projekt id akkor hiba
		// TODO: design not-found id
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-center">
					<h1 className="text-4xl font-bold">Nincs ilyen projekt</h1>
					<p className="text-lg text-muted-foreground mt-4">
						A projekt azonosítója ({projectId}) nem létezik.
					</p>
				</div>
			</div>
		)
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
						<AnalyticsCards analyticsForCards={analyticsForCards} />
					</div>
					<div className="grid gap-4 md:grid-cols-2">
						<div className="mt-8 p-6 border border-border rounded-lg shadow ">
							<h1 className="text-xl font-bold">
								Legutóbbi tevékenységek
							</h1>
							<p className="text-muted-foreground text-sm mt-1 mb-6">
								Legutóbb felvett feladatok
							</p>
							<RecentActivity recentActivity={recentActivity} />
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
