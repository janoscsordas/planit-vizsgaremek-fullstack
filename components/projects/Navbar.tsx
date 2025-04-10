import ProfileAvatar from "./profile-navbar"
import BreadcrumbComponent from "../Breadcrumb"
import { Breadcrumb } from "../Breadcrumb"
import NotificationBell from "./notification/notification-bell"
import { Session } from "next-auth"
import Link from "next/link"
import { Button } from "../ui/button"
import Image from "next/image"

export default function Navbar({
  breadCrumb,
  session,
}: {
  breadCrumb: Breadcrumb[]
  session: Session
}) {
  return (
    <nav className="flex items-center justify-between p-4 border-b-2 border-foreground/10">
      {/* Icon link to homepage **Only visible below sm** */}
      <Link href="/" className="block sm:hidden" aria-label="Főoldal">
        <Image
          src="/icon.png"
          alt="PlanitApp Logo"
          className="w-auto h-auto"
          width={28}
          height={28}
        />
      </Link>
      {/* breadcrumbs */}
      <BreadcrumbComponent breadcrumbs={breadCrumb} />
      <div className="flex items-center gap-4">
        {/* AI Chat */}
        <Link href="/chat" className="mr-5">
          <Button variant="outline" aria-label="Planie Ai">🤖 Planie AI</Button>
        </Link>
        {/* notifications */}
        <NotificationBell />
        {/* profile avatar */}
        <ProfileAvatar session={session} />
      </div>
    </nav>
  )
}
