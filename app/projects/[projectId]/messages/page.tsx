import ProjectHeader from '../header'
import { getProjectById } from '@/actions/projects.action'
import MessageComponent from './MessageComponent'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function Messages({
	params,
}: Readonly<{
	children: React.ReactNode
	params: Promise<{ projectId: string }>
}>) {
	const session = await auth()

	if (!session || !session.user || !session.user.id) {
		redirect("/login")
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
                  label: "Üzenetek",
                  href: `/projects/${projectData.id}/messages`,
                  active: true,
               },
            ]}
         />
         {/* <div className="px-6 py-2"> */}
         <div className="md:px-6 px-0 py-2">
            <h1 className="text-2xl font-bold md:pl-0 md:mx-0 text-center md:text-left mb-3">Üzenetek</h1> 
            <MessageComponent
               projectId={projectData.id}
               userId={session.user.id}
            />
         </div>
      </>
   )
}
