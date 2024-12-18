"use client"

import { Button } from "@/components/ui/button"
import { Maximize } from "lucide-react"
import dynamic from "next/dynamic"
import { useState } from "react"

const WhiteBoard = dynamic(() => import("./white-board"), { ssr: false })

export default function WhiteBoardWrapper({ 
    userId, 
    projectId, 
    projectName, 
    userName 
}: { 
    userId: string, 
    projectId: string, 
    projectName: string, 
    userName: string 
}) {
    const [canvasOpen, setCanvasOpen] = useState(false)

    return (
        <>
            <Button 
                onClick={() => setCanvasOpen(true)}
                className="flex items-center gap-2"
            >
                <Maximize className="mr-2 h-4 w-4" />
                Whiteboard megnyitása
            </Button>

            {canvasOpen &&
                <WhiteBoard 
                    userId={userId} 
                    projectId={projectId} 
                    projectName={projectName} 
                    userName={userName} 
                    onClose={() => setCanvasOpen(false)} 
                />
            }
        </>
    )
}