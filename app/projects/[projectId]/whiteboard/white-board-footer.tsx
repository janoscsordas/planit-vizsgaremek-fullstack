import { ZoomIn, ZoomOut } from "lucide-react";


export default function WhiteBoardFooter({ userName }: { userName: string }) {
    
    return (
        <footer className="fixed bottom-0 left-0 z-50 flex items-end justify-between bg-transparent p-4 w-full">
            <div>
                <p className="text-xs text-muted-foreground">Bejelentkezve, mint: {userName}</p>
            </div>
            <div className="flex items-center gap-2 bg-muted-foreground p-1 rounded-full">
                <button className="bg-emerald hover:bg-emerald-hover rounded-full p-1">
                    <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-sm text-black">100%</span>
                <button className="bg-emerald hover:bg-emerald-hover rounded-full p-1">
                    <ZoomIn className="w-4 h-4" />
                </button>
            </div>
        </footer>
    )
}