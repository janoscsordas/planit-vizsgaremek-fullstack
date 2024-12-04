import { auth } from '@/auth'
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
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { redirect } from 'next/navigation'
import DialogLogoutButton from './DialogLogoutButton'
import { LogOutIcon, UserIcon } from 'lucide-react'

export default async function ProfileAvatar() {
	const session = await auth()

	if (!session?.user) {
		return redirect('/login')
	}

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
						{/* TODO: Make this shit look like the one in the sidebar */}
						<div className="grid flex-1 text-left text-sm leading-tight p-[10px]">
							<span className="truncate font-semibold">
								{session.user.name}
							</span>
							<span className="truncate text-muted-foreground text-xs">
								{session.user.email}
							</span>
						</div>
						{/* <DropdownMenuLabel>Profil Menü</DropdownMenuLabel> */}
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
