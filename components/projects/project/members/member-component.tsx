import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar } from "@radix-ui/themes"
import { formatDate } from "date-fns"
import Link from "next/link"

export default function MemberComponent({
  id,
  image,
  name,
  email,
  role,
  ownerId,
  addedAt,
}: {
  id: string
  image: string | null
  name: string | null
  email: string | null
  role: string
  ownerId?: string
  addedAt?: Date
}) {
  return (
    <div className="flex items-center mt-6">
      <span className="flex items-center justify-center overflow-hidden rounded-full shrink-0 h-9 w-9">
        <Avatar
          radius="full"
          src={image || ""}
          alt={name || ""}
          fallback={name?.charAt(0) || ""}
        />
      </span>
      <div className="ml-4 space-y-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={`/profile/${id}`} className="flex items-center gap-1 text-sm hover:underline font-medium leading-none tracking-tighter">
              {name} {ownerId && "👑"}
            </Link>
          </TooltipTrigger>
          <TooltipContent align="start">profil megtekintése</TooltipContent>
        </Tooltip>
        <p className="text-xs text-muted-foreground">{email}</p>
        {addedAt && (
          <p className="text-xs text-emerald">
            Csatlakozott: {formatDate(addedAt, "yyyy.MM.dd")}
          </p>
        )}
      </div>
      <div className="px-2 py-1 ml-auto text-xs font-medium border rounded-lg">
        {(role === "admin" && "Admin") ||
          (role === "owner" && "Tulajdonos") ||
          "Tag"}
      </div>
    </div>
  )
}
