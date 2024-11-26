import { getProjectById } from '@/actions/projects.action'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import ProjectHeader from './header'

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
			</main>
		</>
	)
}
