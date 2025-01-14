"use client"

import { useEffect, useState } from "react"
import { ChevronUp } from "lucide-react"
import { Button } from "./ui/button"

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > window.innerHeight) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  if (!isVisible) return null

  return (
    <Button
      type="button"
      className="fixed bottom-8 right-8 z-50 rounded-full p-4 transition ease-in-out text-white hover:text-emerald bg-emerald-hover border hover:bg-primary-foreground"
      onClick={scrollToTop}
    >
      <ChevronUp height={16} width={16} /> <span>Vissza a tetejére</span>
    </Button>
  )
}
