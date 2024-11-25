import type { Metadata } from "next"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import ProjectHeader from "@/app/projects/[projectId]/header"

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
  return (
    <>
      <SidebarProvider>
        <AppSidebar userSession={session} />
        <SidebarInset>
          <ProjectHeader params={params} />
          <main className="px-6 py-2">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
