import { IconButton } from "@radix-ui/themes"
import { Bell } from "lucide-react"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import NavbarBreadcrumb from "./NavbarBreadcrumb"
import ProfileAvatar from "./ProfileAvatar"

export default async function Navbar() {
  const session = await auth()

  if (!session?.user) {
    return redirect("/login")
  }

  return (
    <nav className="flex justify-between items-center p-4 border-b-2 border-foreground/10">
      {/* breadcrumbs */}
      <NavbarBreadcrumb />

      <div className="flex items-center gap-4">
        {/* notifications */}
        <IconButton
          variant="ghost"
          color="gray"
          className="cursor-pointer group hover:bg-emerald/15"
        >
          <Link href="/notifications">
            <Bell
              width="18"
              height="18"
              className="text-muted-foreground group-hover:-rotate-12 transition-transform duration-300"
            />
          </Link>
        </IconButton>

        {/* profile avatar */}
        <ProfileAvatar />
      </div>
    </nav>
  )
}
