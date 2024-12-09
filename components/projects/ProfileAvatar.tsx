import { Avatar } from '@radix-ui/themes'
import Link from 'next/link'

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import DialogLogoutButton from './DialogLogoutButton'
import { LogOutIcon, UserIcon } from 'lucide-react'
import { Session } from 'next-auth'

export default function ProfileAvatar({ session }: { session: Session }) {
	return (
		<div className="flex justify-end items-center">
			<AlertDialog>
				<DropdownMenu>
					<DropdownMenuTrigger className="outline-none">
						{session.user.image ? (
							<Avatar
								radius="full"
								src={session.user.image}
								fallback={session.user.name?.charAt(0) || '?'}
								className="cursor-pointer hover:opacity-80 transition-opacity"
							/>
						) : (
							<Avatar
								radius="full"
								fallback={session.user.name?.charAt(0) || '?'}
								className="cursor-pointer hover:opacity-80 transition-opacity"
							/>
						)}
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<div className="grid flex-1 text-left text-sm leading-tight p-[10px]">
							<span className="truncate font-semibold">
								{session.user.name}
							</span>
							<span className="truncate text-muted-foreground text-xs">
								{session.user.email}
							</span>
						</div>
						<DropdownMenuSeparator />
						<Link href="/profile" className="no-underline">
							<DropdownMenuItem className="cursor-pointer">
								<UserIcon className="w-4 h-4 mr-2" />
								Profil
							</DropdownMenuItem>
						</Link>
						<AlertDialogTrigger asChild>
							<DropdownMenuItem className="text-red-500 focus:bg-red-500/80 focus:text-white cursor-pointer">
								<LogOutIcon className="w-4 h-4 mr-2" />
								Kijelentkezés
							</DropdownMenuItem>
						</AlertDialogTrigger>
					</DropdownMenuContent>
				</DropdownMenu>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Biztosan ki szeretnél jelentkezni?
						</AlertDialogTitle>
						<AlertDialogDescription>
							Ha most kijelentkezel, bármikor vissza léphetsz.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Mégse</AlertDialogCancel>
						<DialogLogoutButton />
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	)
}
