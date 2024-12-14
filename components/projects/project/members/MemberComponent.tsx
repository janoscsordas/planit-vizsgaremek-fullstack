import { Avatar } from "@radix-ui/themes"
import { formatDate } from "date-fns"

export default function MemberComponent({
    image,
    name,
    email,
    role,
    ownerId,
    addedAt,
}: {
    image: string | null
    name: string | null
    email: string | null
    role: string
    ownerId?: string
    addedAt?: Date
}) {
    return (
        <div className="flex items-center mt-6">
            <span className="flex justify-center items-center shrink-0 overflow-hidden rounded-full h-9 w-9">
                <Avatar radius="full" src={image || ""} alt={name || ""} fallback={name?.charAt(0) || ""} />
            </span>
            <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none tracking-tighter flex items-center gap-1">{name} {ownerId && "👑"}</p>
                <p className="text-xs text-muted-foreground">{email}</p>
                {addedAt && <p className="text-xs text-emerald">Csatlakozott: {formatDate(addedAt, "yyyy.MM.dd")}</p>}
            </div>
            <div className="ml-auto font-medium text-xs border px-2 py-1 rounded-lg">
                {role === "admin" && "Admin" || role === "owner" && "Tulajdonos" || "Tag"}
            </div>
        </div>
    )
}