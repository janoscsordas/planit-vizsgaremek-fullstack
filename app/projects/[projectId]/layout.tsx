import type { Metadata } from "next"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Bell } from "lucide-react"
import CommandMenu from "@/components/projects/project/CommandMenu"
import { IconButton } from "@radix-ui/themes"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getProjectById } from "@/actions/projects.action"
import ProjectBreadcrumb from "@/components/projects/project/ProjectBreadcrumb"

export const metadata: Metadata = {
  title: "Planitapp - Projekt",
  description: "Planitapp oldalon a felhasználó projektjeinek kezelése",
}

export default async function Layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
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
    <>
      <SidebarProvider>
        <AppSidebar userSession={session} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex justify-between items-center w-full gap-2 p-2">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <ProjectBreadcrumb
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
                    <Bell
                      width="18"
                      height="18"
                      className="text-muted-foreground"
                    />
                  </Link>
                </IconButton>
              </div>
            </div>
          </header>
          <main className="px-6 py-2 border-2 border-red-400 h-screen m-12">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
