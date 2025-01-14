import ProfileNavbar from "@/components/profile/profile-navbar"
import ProfileHeader from "../profile-header"
import Notifications from "./Notifications"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { NotificationsProvider } from "@/context/NotificationsContext"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default async function NotificationsPage() {
  const session = await auth()

  if (!session?.user) {
    return redirect("/login")
  }

  return (
    <NotificationsProvider userId={session.user.id}>
      <div className="w-[90%] mx-auto pt-8 md:pt-16">
        <ProfileHeader birthDate={null} />
        <div className="flex flex-col md:flex-row">
          <ProfileNavbar />
          <div className="ml-0 md:ml-12 mt-2 w-full md:w-[75%]">
            <h3 className="text-xl font-medium">Értesítések</h3>
            <hr className="my-6" />
            <div className="p-6 space-y-4 border rounded-md border-muted">
              <h4 className="text-sm font-medium">Legutóbbi meghívások:</h4>
              <Suspense fallback={<Skeleton className="w-full h-48" />}>
                <Notifications />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </NotificationsProvider>
  )
}
