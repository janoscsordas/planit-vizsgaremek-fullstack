import ProjectHeader from '../header'
import { getProjectById } from '@/actions/projects.action'

export default async function Messages({
	params,
}: Readonly<{
	children: React.ReactNode
	params: Promise<{ projectId: string }>
}>) {
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
						label: 'Üzenetek',
						href: `/projects/${projectData.id}/messages`,
						active: true,
					},
				]}
			/>
			<main className="px-6 py-2">
				<h1 className="text-2xl font-bold">Üzenetek</h1>
			</main>
		</>
	)
}
