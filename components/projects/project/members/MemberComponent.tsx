import TempImg from "@/public/icon.png"

export default function MemberComponent() {
    return (
        <div className="flex items-center mt-6">
            <span className="relative flex shrink-0 overflow-hidden rounded-full h-9 w-9">
                <img className="aspect-square h-full w-full" src={TempImg.src} alt="Avatar" />
            </span>
            <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none tracking-tighter">Vásári András</p>
                <p className="text-xs text-muted-foreground">andrasvasari47@gmail.com</p>
            </div>
            <div className="ml-auto font-medium text-xs border px-2 py-1 rounded-lg">
                member
            </div>
        </div>
    )
}