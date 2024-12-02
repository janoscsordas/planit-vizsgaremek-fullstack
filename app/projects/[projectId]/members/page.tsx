import ProjectHeader from '../header'
import { getProjectById } from '@/actions/projects.action'
import MemberComponent from '@/components/projects/project/members/MemberComponent'
import { Separator } from '@/components/ui/separator'


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
				<div className="mt-8 border p-4 rounded-xl w-full lg:w-[50%]">
					<h1 className="text-md font-bold mb-1">Projekt tagjai</h1>
					<p className="text-muted-foreground text-sm mb-4">Adj hozzá tagokat a projektedhez.</p>
					<Separator orientation="horizontal" className="mb-4 mt-6" />
					<MemberComponent />
					<MemberComponent />
					<MemberComponent />
					<MemberComponent />
					<MemberComponent />
					<MemberComponent />
					<MemberComponent />
				</div>
			</main>
		</>
	)
}
