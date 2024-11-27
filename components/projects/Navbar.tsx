import { IconButton } from "@radix-ui/themes"
import { Bell } from "lucide-react"
import Link from "next/link"
import ProfileAvatar from "./ProfileAvatar"
import BreadcrumbComponent from "../Breadcrumb"
import { Breadcrumb } from "../Breadcrumb"

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
        <IconButton
          variant="ghost"
          color="gray"
          className="cursor-pointer group hover:bg-emerald/15"
        >
          <Link href="/notifications">
            <Bell width="18" height="18" className="text-muted-foreground" />
          </Link>
        </IconButton>

        {/* profile avatar */}
        <ProfileAvatar />
      </div>
    </nav>
  )
}
