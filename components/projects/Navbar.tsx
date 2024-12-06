import ProfileAvatar from "./ProfileAvatar"
import BreadcrumbComponent from "../Breadcrumb"
import { Breadcrumb } from "../Breadcrumb"
import NotificationBell from "./notification/NotificationBell"
import { Session } from "next-auth"

export default function Navbar({
  breadCrumb,
  session,
}: {
  breadCrumb: Breadcrumb[]
  session: Session
}) {
  return (
      <nav className="flex justify-between items-center p-4 border-b-2 border-foreground/10">
        {/* breadcrumbs */}
        <BreadcrumbComponent breadcrumbs={breadCrumb} />
        <div className="flex items-center gap-4">
          {/* notifications */}
          <NotificationBell />
          {/* profile avatar */}
          <ProfileAvatar session={session} />
        </div>
      </nav>
  )
}
