import type { Metadata } from "next"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

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

  return (
      <SidebarProvider>
        <AppSidebar userSession={session} projectId={projectId} />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
  )
}
