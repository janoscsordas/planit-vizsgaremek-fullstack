import { promises as fs } from 'fs'
import path from 'path'
import { z } from 'zod'
import ProjectHeader from '../header'
import { getProjectById } from '@/actions/projects.action'

import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { taskSchema } from './data/schema'

async function getTasks() {
	const data = await fs.readFile(
		path.join(process.cwd(), 'app/(app)/examples/tasks/data/tasks.json')
	)

	const tasks = JSON.parse(data.toString())

	return z.array(taskSchema).parse(tasks)
}

export default async function Tasks({
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
						label: 'Feldatok',
						href: `/projects/${projectData.id}/tasks`,
						active: true,
					},
				]}
			/>
			<main className="px-6 py-2">
				<h1 className="text-2xl font-bold">Feldatok</h1>
				<div className="w-full md:w-4/5 mx-auto px-6">
					<DataTable data={tasks} columns={columns} />
				</div>
			</main>
		</>
	)
}
