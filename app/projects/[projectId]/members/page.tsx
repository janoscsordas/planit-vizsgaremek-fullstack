import { auth } from '@/auth'
import ProjectHeader from '../header'
import AddMemberForm from '@/components/projects/project/members/AddMemberForm'
import MemberComponent from '@/components/projects/project/members/MemberComponent'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { db } from '@/database'
import { ProjectsTable } from '@/database/schema/projects'
import { eq } from 'drizzle-orm'
import { Suspense } from 'react'
import { notFound, redirect } from 'next/navigation'
import { UsersTable } from '@/database/schema/user'


export default async function Members({
	params,
}: Readonly<{
	children: React.ReactNode
	params: Promise<{ projectId: string }>
}>) {
	const session = await auth()

	if (!session || !session.user) {
		return redirect('/login')
	}

	const { projectId } = await params

	const projectData = await db.query.ProjectsTable.findFirst({
		where: eq(ProjectsTable.id, projectId),
		with: {
		  members: {
			columns: {
			  	userId: true,
			  	projectId: true,
			  	id: true,
			  	role: true,
			  	addedAt: true
			},
			with: {
			  	user: {
					columns: {
					  id: true,
					  name: true,
					  email: true,
					  image: true
					}
			  	}
			}
		  },
		  owner: {
			columns: {
			  id: true,
			  name: true,
			  email: true,
			  image: true,
			}
		  }
		},
	})

	if (!projectData) {
		return notFound()
	}

	const isOwner = projectData.userId === session.user.id

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
				<div className="mt-8 border p-4 rounded-xl w-full lg:w-[75%]">
					<h1 className="text-md font-bold mb-1">Projekt tagjai</h1>
					{
						isOwner ? (
							<>
								<p className="text-muted-foreground text-sm mb-4">Adj hozzá tagokat a projektedhez.</p>
								<Suspense fallback={<Skeleton className='w-full h-[35px]' />}>
									<AddMemberForm projectId={projectData.id} />
								</Suspense>
							</>
						) : (
							<p className='text-sm text-muted-foreground mb-4'>Itt láthatod a projekt tagjait</p>
						)
					}
					<Separator orientation="horizontal" className="mb-4 mt-6" />
					<MemberComponent ownerId={projectData.owner.id} image={projectData.owner.image} name={projectData.owner.name} email={projectData.owner.email} role="owner" />
					{projectData.members && projectData.members.map((member) => (
						<MemberComponent key={member.id} image={member.user.image} name={member.user.name} email={member.user.email} role={member.role} addedAt={member.addedAt} />
					))}
					{!projectData.members.length && <p className="text-muted-foreground text-sm mt-6">Jelenleg más nincs tagja a projektnek. Hívj meg valakit a folytatáshoz.</p>}
				</div>
			</main>
		</>
	)
}