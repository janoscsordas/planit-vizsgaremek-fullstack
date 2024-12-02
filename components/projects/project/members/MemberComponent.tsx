import { Avatar } from "@radix-ui/themes"

export default async function MemberComponent({
    image,
    name,
    email,
    role,
}: {
    image: string | null
    name: string | null
    email: string | null
    role: string
}) {
    return (
        <div className="flex items-center mt-6">
            <span className="relative flex shrink-0 overflow-hidden rounded-full h-9 w-9">
                <Avatar radius="full" src={image || ""} alt={name || ""} fallback={name?.charAt(0) || ""} />
            </span>
            <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none tracking-tighter">{name}</p>
                <p className="text-xs text-muted-foreground">{email}</p>
            </div>
            <div className="ml-auto font-medium text-xs border px-2 py-1 rounded-lg">
                {role}
            </div>
        </div>
    )
}