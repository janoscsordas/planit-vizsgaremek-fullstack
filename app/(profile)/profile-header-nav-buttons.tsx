"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronUp } from "lucide-react"
import Link from "next/link"

export default function ProfileHeaderNavButtons() {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={"outline"}
        onClick={() => window.history.back()}
        className="group"
      >
        <ChevronUp className="transition-transform duration-200 group-hover:-rotate-90" />{" "}
        Előző oldal
      </Button>
      <Link href="/projects" className="group">
        <Button variant={"outline"}>
          <ChevronLeft className="transition-transform duration-200 group-hover:rotate-90" />{" "}
          Projektek
        </Button>
      </Link>
    </div>
  )
}
