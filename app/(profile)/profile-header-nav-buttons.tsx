"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronUp } from "lucide-react"
import Link from "next/link"

export default function ProfileHeaderNavButtons() {
    return (
        <div className="flex gap-2 items-center">
            <Button variant={"outline"} onClick={() => window.history.back()} className="group">
                <ChevronUp className="group-hover:-rotate-90 transition-transform duration-200" /> Előző oldal
            </Button>
            <Link href="/projects" className="group">
                <Button variant={"outline"}>
                    <ChevronLeft className="group-hover:rotate-90 transition-transform duration-200" /> Projektek
                </Button>
            </Link>
        </div>
    )
}