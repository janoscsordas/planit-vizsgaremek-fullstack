"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"


export default function BackButton() {
    const router = useRouter()

    const goBack = () => {
        router.back()
    }

    return (
        <Button variant="link" onClick={goBack} className="flex items-center hover:underline group gap-2 mx-auto">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-2 transition-transform duration-75" />
            <span>Vissza az előző oldalra</span>
        </Button>
    )
}