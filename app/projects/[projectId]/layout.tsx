import type { Metadata } from "next"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { NotificationsProvider } from "@/context/NotificationsContext"
import { db } from "@/database"
import { ProjectsTable } from "@/database/schema/projects"
import { eq } from "drizzle-orm"

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

    const isProjectCreator = await db.query.ProjectsTable.findFirst({
        where: eq(ProjectsTable.id, projectId),
    })

    const isOwner = isProjectCreator?.userId === session.user.id

    return (
      <SidebarProvider>
        <AppSidebar projectName={isProjectCreator?.name ?? ''} isOwner={isOwner} userSession={session} projectId={projectId} />
        <NotificationsProvider userId={session.user.id}>
          <SidebarInset>{children}</SidebarInset>
        </NotificationsProvider>
      </SidebarProvider>
    )
}
