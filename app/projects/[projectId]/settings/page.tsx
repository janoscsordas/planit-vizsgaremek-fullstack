import ProjectHeader from "../header"
import { getProjectById } from "@/actions/projects.action"
import DeleteProject from "../../../../components/settings/delete-project"
import ProjectNameForm from "../../../../components/settings/project-name-form"
import UpgradeToPro from "../../../../components/settings/upgrade-to-pro"
import ChangeStatus from "../../../../components/settings/change-status"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import ProjectData from "../../../../components/settings/project-data"

export default async function Settings({
  params,
}: Readonly<{
  params: Promise<{ projectId: string }>
}>) {
  const session = await auth()

  if (!session || !session.user) {
    return redirect("/login")
  }

  const { projectId } = await params

  const project = await getProjectById(projectId)

  if (!project.success || !project.data) {
    return <div>{project.message}</div>
  }

  const projectData = Array.isArray(project.data)
    ? project.data[0]
    : project.data

  // If user is not creator redirect to overview page
  const isOwner = projectData.userId === session.user.id

  if (!isOwner) {
    return redirect(`/projects/${projectData.id}`)
  }

  return (
    <>
      <ProjectHeader
        breadCrumb={[
          {
            label: projectData.name,
            href: `/projects/${projectData.id}`,
          },
          {
            label: "Beállítások",
            href: `/projects/${projectData.id}/settings`,
            active: true,
          },
        ]}
      />
      <main className="px-6 py-2">
        <div className="w-full lg:w-2/4">
          <section className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold">Beállítások</h1>
              <p className="pt-2 text-muted-foreground">
                Beállítások kezelése és testreszabása.
              </p>
            </div>
          </section>
          <hr className="my-6" />
          <ProjectData
            projectId={projectData.id}
            projectData={{
              projectName: projectData.name,
              projectNameChangedAt: projectData.nameChanged,
              projectCreatedAt: projectData.createdAt,
              projectTier: projectData.tier,
              projectStatus: projectData.status,
            }}
          />
          <ProjectNameForm
            projectData={{
              projectName: projectData.name,
              projectNameChangedAt: projectData.nameChanged,
            }}
            projectId={projectData.id}
          />
          <ChangeStatus
            projectId={projectData.id}
            projectStatus={projectData.status}
          />
          <UpgradeToPro />
          <DeleteProject
            projectName={projectData.name}
            projectId={projectData.id}
          />
        </div>
      </main>
    </>
  )
}
