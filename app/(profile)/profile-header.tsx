import { Tooltip, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import ProfileHeaderNavButtons from "./profile-header-nav-buttons";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { Cake } from "lucide-react";

export default function ProfileHeader({ birthDate }: { birthDate: Date | null }) {
	const isThisMonth = birthDate && birthDate.getMonth() === new Date().getMonth();
	const isToday = birthDate && birthDate.getDate() === new Date().getDate();

	return (
		<TooltipProvider>
			<section className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold">Fiókbeállítások</h2>
					<p className="text-muted-foreground pt-2">
						Fiókbeállítások kezelése és testreszabása.
					</p>
				</div>
				<div className="flex gap-6 items-center">
					{birthDate && isThisMonth && isToday && (
						<Tooltip>
							<TooltipTrigger asChild>
								<Cake className="w-6 h-6 cursor-pointer" />
							</TooltipTrigger>
							<TooltipContent>
								<p>Boldog születésnapot kíván a PlanitApp csapata!</p>
							</TooltipContent>
						</Tooltip>
					)}
					<ProfileHeaderNavButtons />
				</div>
			</section>
			<hr className="my-6" />
		</TooltipProvider>
	)
}
