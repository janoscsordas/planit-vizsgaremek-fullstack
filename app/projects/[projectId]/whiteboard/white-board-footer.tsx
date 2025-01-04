import { ZoomIn, ZoomOut } from "lucide-react";


export default function WhiteBoardFooter({ 
    userName, 
    zoom, 
    setZoom 
}: { 
    userName: string, 
    zoom: number, 
    setZoom: (number: number) => void 
}) {
    
    const handleZoomDecrease = () => {
        if (zoom <= 0.1) return
        setZoom(zoom - 0.1)
    }

    const handleZoomIncrease = () => {
        if (zoom >= 3) return
        setZoom(zoom + 0.1)
    }

    const handleZoomReset = () => {
        setZoom(1)
    }

    return (
        <footer className="fixed bg-white bottom-0 left-0 z-50 flex items-center justify-between bg-transparent p-2 w-full border-t border-t-muted-foreground">
            <div>
                <p className="text-xs text-muted-foreground">Bejelentkezve, mint: {userName}</p>
            </div>
            <div className="flex items-center gap-2 bg-muted-foreground p-1 rounded-full">
                <button 
                    className="bg-emerald hover:bg-emerald-hover rounded-full p-1" 
                    onClick={handleZoomDecrease}
                >
                    <ZoomOut className="w-4 h-4" />
                </button>
                <button onClick={handleZoomReset} className="text-sm text-black">{Math.floor(zoom * 100)}%</button>
                <button 
                    className="bg-emerald hover:bg-emerald-hover rounded-full p-1"
                    onClick={handleZoomIncrease}
                >
                    <ZoomIn className="w-4 h-4" />
                </button>
            </div>
        </footer>
    )
}