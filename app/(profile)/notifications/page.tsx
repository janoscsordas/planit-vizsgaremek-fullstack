import ProfileNavbar from '@/components/profile/ProfileNavbar'
import ProfileHeader from '../ProfileHeader'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export default function NotificationsPage() {
	return (
		<div className="w-[90%] mx-auto pt-8 md:pt-16">
			<ProfileHeader />
			<div className="flex flex-col md:flex-row">
				<ProfileNavbar />
				<div className="ml-0 md:ml-12 mt-2 w-full md:w-[50%]">
					<h3 className="text-xl font-medium">Értesítések</h3>
					<p className="text-muted-foreground text-sm pt-2">
						Állítsd be, hogy milyen értesítéseket kapsz.
					</p>
					<hr className="my-6" />
					<div className="space-y-4 border border-muted rounded-md p-6">
						<h4 className="font-medium text-sm">
							Legutóbbi meghívások:
						</h4>
						<Card className="p-4 hover:border-emerald-hover transition-all ease-in border-2 w-full">
							<div className="flex flex-col lg:flex-row items-center justify-between gap-2">
								<div className="flex items-center gap-2">
									<Avatar>
										<AvatarImage src="https://github.com/shadcn.png" />
										<AvatarFallback>CN</AvatarFallback>
									</Avatar>
									<div className="flex flex-col gap-2 md:mt-0">
										<p className="text-sm font-medium">
											Shadcn
										</p>
										<p className="text-xs text-muted-foreground">
											20 órával ezelőtt
										</p>
									</div>
									<p>
										<span className="text-xs text-muted-foreground">
											Meghívott téged a {} nevű projektbe.
										</span>
									</p>
								</div>
								<div className="flex items-center gap-2 mt-4 md:mt-0">
									<Button className="w-full md:w-auto bg-emerald hover:bg-emerald-hover">
										Elfogadás
									</Button>
									<Button className="w-full md:w-auto bg-red-400 hover:bg-red-800">
										Elutasítás
									</Button>
								</div>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</div>
	)
}
