import ProjectHeader from '../header'
import { getProjectById } from '@/actions/projects.action'
import DeleteProject from './components/delete-project'

export default async function Settings({
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
						label: 'Beállítások',
						href: `/projects/${projectData.id}/settings`,
						active: true,
					},
				]}
			/>
			<main className="px-6 py-2">
				<h1 className="text-2xl font-bold">Beállítások</h1>
				<div className="w-2/4">
					<DeleteProject />
				</div>
			</main>
		</>
	)
}
