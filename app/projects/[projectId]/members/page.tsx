import ProjectHeader from '../header'
import { getProjectById } from '@/actions/projects.action'

export default async function Members({
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
						label: 'Tagok',
						href: `/projects/${projectData.id}/members`,
						active: true,
					},
				]}
			/>
			<main className="px-6 py-2">
				<h1 className="text-2xl font-bold">Tagok</h1>
			</main>
		</>
	)
}
