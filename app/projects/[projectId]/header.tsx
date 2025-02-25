import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import CommandMenu from "@/components/projects/simpleProjectPage/command-menu"
import BreadcrumbComponent from "@/components/Breadcrumb"
import { Breadcrumb } from "@/components/Breadcrumb"
import NotificationBell from "@/components/projects/notification/notification-bell"

export default function ProjectHeader({
  breadCrumb,
}: {
  breadCrumb: Breadcrumb[]
}) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center justify-between w-full gap-2 p-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4 mr-2" />
          <BreadcrumbComponent breadcrumbs={breadCrumb} />
        </div>
        <div className="flex items-center gap-4 px-4">
          <CommandMenu />

          <NotificationBell />
        </div>
      </div>
    </header>
  )
}
