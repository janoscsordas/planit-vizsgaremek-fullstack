import ProjectHeader from '../header'
import { getProjectById } from '@/actions/projects.action'
import DeleteProject from './components/delete-project'
import ProjectNameForm from './components/project-name-form'
import UpgradeToPro from './components/upgrade-to-pro'

export default async function Settings({
	params,
}: Readonly<{
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
				<div className="w-full lg:w-2/4">
					<section className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold">Beállítások</h1>
							<p className="text-muted-foreground pt-2">
								Beállítások kezelése és testreszabása.
							</p>
						</div>
					</section>
					<hr className="my-6" />
					<ProjectNameForm projectData={{ projectName: projectData.name, projectNameChangedAt: projectData. }} />
					<UpgradeToPro />
					<DeleteProject projectName={projectData.name} />
				</div>
			</main>
		</>
	)
}
