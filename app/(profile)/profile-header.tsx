import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip"
import ProfileHeaderNavButtons from "./profile-header-nav-buttons"
import { TooltipTrigger } from "@radix-ui/react-tooltip"
import { Cake } from "lucide-react"

export default function ProfileHeader({
  birthDate,
}: {
  birthDate: Date | null
}) {
  const isThisMonth =
    birthDate && birthDate.getMonth() === new Date().getMonth()
  const isToday = birthDate && birthDate.getDate() === new Date().getDate()

  return (
    <TooltipProvider>
      <section className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Fiókbeállítások</h2>
          <p className="pt-2 text-muted-foreground">
            Fiókbeállítások kezelése és testreszabása.
          </p>
        </div>
        <div className="flex items-center gap-6">
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
