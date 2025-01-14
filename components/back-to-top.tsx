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
      className="fixed z-50 p-4 text-white transition ease-in-out border rounded-full bottom-8 right-8 hover:text-emerald bg-emerald-hover hover:bg-primary-foreground"
      onClick={scrollToTop}
    >
      <ChevronUp height={16} width={16} /> <span>Vissza a tetejére</span>
    </Button>
  )
}
