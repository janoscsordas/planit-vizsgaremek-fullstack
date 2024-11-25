import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import CommandMenu from "@/components/projects/project/CommandMenu"
import { IconButton } from "@radix-ui/themes"
import { Bell } from "lucide-react"
import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getProjectById } from "@/actions/projects.action"
import BreadcrumbComponent from "@/components/Breadcrumb"

export default async function ProjectHeader({
  params,
}: Readonly<{
  params: Promise<{ projectId: string }>
}>) {
  const session = await auth()

  if (!session) {
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

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex justify-between items-center w-full gap-2 p-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <BreadcrumbComponent
            breadcrumbs={[
              {
                label: "projektek",
                href: `/projects`,
              },
              {
                label: projectData.name,
                href: `/projects/${projectId}`,
              },
              {
                label: "Áttekintés",
                href: `/projects/${projectId}`,
                active: true,
              },
            ]}
          />
        </div>
        <div className="flex items-center gap-4 px-4">
          <CommandMenu />

          <IconButton
            variant="ghost"
            color="gray"
            className="cursor-pointer group hover:bg-emerald/15"
          >
            <Link href="/notifications">
              <Bell width="18" height="18" className="text-muted-foreground" />
            </Link>
          </IconButton>
        </div>
      </div>
    </header>
  )
}
