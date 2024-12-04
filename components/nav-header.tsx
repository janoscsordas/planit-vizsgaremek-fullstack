'use client'

import * as React from 'react'
import {
	ChevronsUpDown,
	GalleryVerticalEnd,
	ChevronLeft,
	LogOut,
} from 'lucide-react'

import Link from 'next/link'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenuButton, useSidebar } from '@/components/ui/sidebar'

export function NavHeader({
	projectName,
	isOwner,
}: {
	projectName: string
	isOwner: boolean
}) {
	const { isMobile } = useSidebar()
	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger
					asChild
					className="focus:ring-2 focus:ring-emerald-hover"
				>
					<SidebarMenuButton
						size="lg"
						className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-emerald-hover text-sidebar-primary-foreground">
							<GalleryVerticalEnd className="size-4" />
						</div>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-semibold">
								{projectName}
							</span>
							{/* Projektneve / vissza a porjektekhez / kilépés a prjektből */}
						</div>
						<ChevronsUpDown className="ml-auto" />
					</SidebarMenuButton>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
					align="start"
					side={isMobile ? 'bottom' : 'right'}
					sideOffset={4}
				>
					<DropdownMenuLabel className="text-xs text-muted-foreground">
						{projectName}
					</DropdownMenuLabel>
					<DropdownMenuItem className="gap-2 p-2">
						<ChevronLeft className="size-4 shrink-0" />
						<Link href="/projects">Vissza a projektekhez</Link>
					</DropdownMenuItem>
					{!isOwner && (
						<DropdownMenuItem className="gap-2 p-2 text-red-500 focus:bg-red-500/80 focus:text-white cursor-pointer">
							<LogOut className="size-4 shrink-0" />
							<Link href="/">Kilépés a projektből</Link>
						</DropdownMenuItem>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	)
}
