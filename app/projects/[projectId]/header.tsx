import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import CommandMenu from '@/components/projects/simpleProjectPage/CommandMenu'
import { IconButton } from '@radix-ui/themes'
import { Bell } from 'lucide-react'
import Link from 'next/link'
import BreadcrumbComponent from '@/components/Breadcrumb'
import { Breadcrumb } from '@/components/Breadcrumb'

export default async function ProjectHeader({
	breadCrumb,
}: {
	breadCrumb: Breadcrumb[]
}) {
	return (
		<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
			<div className="flex justify-between items-center w-full gap-2 p-2">
				<div className="flex items-center gap-2 px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="mr-2 h-4" />
					<BreadcrumbComponent breadcrumbs={breadCrumb} />
				</div>
				<div className="flex items-center gap-4 px-4">
					<CommandMenu />

					<IconButton
						variant="ghost"
						color="gray"
						className="cursor-pointer group hover:bg-emerald/15"
					>
						<Link href="/notifications">
							<Bell
								width="18"
								height="18"
								className="text-muted-foreground"
							/>
						</Link>
					</IconButton>
				</div>
			</div>
		</header>
	)
}
