import { IconButton } from "@radix-ui/themes"
import { Bell } from "lucide-react"
import Link from "next/link"
import ProfileAvatar from "./ProfileAvatar"
import BreadcrumbComponent from "../Breadcrumb"
import { Breadcrumb } from "../Breadcrumb"
import NotificationBell from "./notification/NotificationBell"

export default async function Navbar({
  breadCrumb,
}: {
  breadCrumb: Breadcrumb[]
}) {
  return (
      <nav className="flex justify-between items-center p-4 border-b-2 border-foreground/10">
        {/* breadcrumbs */}
        <BreadcrumbComponent breadcrumbs={breadCrumb} />
        <div className="flex items-center gap-4">
          {/* notifications */}
          <NotificationBell />
          {/* profile avatar */}
          <ProfileAvatar />
        </div>
      </nav>
  )
}
