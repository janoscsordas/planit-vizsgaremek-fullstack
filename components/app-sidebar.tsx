'use client'

import * as React from 'react'
import Link from 'next/link'

import { Session } from 'next-auth'
import { usePathname } from 'next/navigation'

import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenuButton,
	SidebarRail,
} from '@/components/ui/sidebar'

import {
	MessageCircle,
	Settings2,
	ClipboardList,
	Binoculars,
	Users,
	ChevronLeft,
} from 'lucide-react'

const generateNavItems = (projectId: string, pathName: string, isOwner: boolean) => {
	const baseNavItems = [
		{
		  title: 'Áttekintés',
		  url: `/projects/${projectId}`,
		  icon: Binoculars,
		  isActive: pathName === `/projects/${projectId}` ? true : false,
		},
		{
		  title: 'Feladatok',
		  url: `/projects/${projectId}/tasks`,
		  icon: ClipboardList,
		  isActive: pathName === `/projects/${projectId}/tasks` ? true : false,
		},
		{
		  title: 'Üzenetek',
		  url: `/projects/${projectId}/messages`,
		  icon: MessageCircle,
		  isActive: pathName === `/projects/${projectId}/messages` ? true : false,
		},
		{
		  title: 'Tagok',
		  url: `/projects/${projectId}/members`,
		  icon: Users,
		  isActive: pathName === `/projects/${projectId}/members` ? true : false,
		}
	];
	if (isOwner) {
		baseNavItems.push({
			title: 'Beállítások',
			url: `/projects/${projectId}/settings`,
			icon: Settings2,
			isActive: pathName === `/projects/${projectId}/settings` ? true : false,
		});
	}

	return baseNavItems;
}

export function AppSidebar({
	isOwner,
	userSession,
	projectId,
	...props
}: React.ComponentProps<typeof Sidebar> & {
	isOwner: boolean
	userSession: Session
	projectId: string
}) {
	const pathName = usePathname()
	const navMain = generateNavItems(projectId, pathName, isOwner)

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<Link href="/projects">
					<SidebarMenuButton
						tooltip="Vissza a projektekhez"
						variant="default"
						size="lg"
						className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full"
					>
						<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-emerald-hover text-sidebar-primary-foreground">
							<ChevronLeft className="size-4" />
						</div>
						<div className="grid flex-1 text-left text-sm leading-tight p-2">
							<span className="truncate font-semibold">
								Vissza a projektekhez
							</span>
						</div>
					</SidebarMenuButton>
				</Link>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser userSession={userSession} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
