"use client"

import { useState, useEffect } from "react"
import { Cookie } from "lucide-react"

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookiesAllowed")
    if (!consent) {
      setTimeout(() => setIsVisible(true), 1000)
    }
  }, [])

  const handleAccept = () => {
    setIsClosing(true)
    localStorage.setItem("cookiesAllowed", "true")
    setTimeout(() => setIsVisible(false), 500)
  }

  if (!isVisible) return null

  return (
    <div
      className={`fixed md:bottom-6 md:right-6 bottom-2 max-w-2xl w-[95%] p-6 bg-card border-2 rounded-xl shadow-lg text-left z-50 transition-all duration-500 ease-out ${
        isClosing ? "opacity-0 translate-y-10" : "opacity-100 translate-y-0"
      }`}
    >
      <h3 className="flex items-center gap-2 mb-2 text-lg font-semibold">
        <Cookie size={20} /> Süti beállítások
      </h3>

      <p className="mb-4 text-muted-foreground">
        A weboldalunk sütiket használ a jobb működéshez és a felhasználói élmény
        javításához. A további böngészéshez kérjük, tekintse át{" "}
        <a
          href="/privacy-policy"
          className="font-medium text-emerald hover:underline"
        >
          Adatvédelmi szabályzatunkat
        </a>
        .
      </p>

      <div className="flex justify-end gap-4">
        <button
          onClick={handleAccept}
          className="px-6 py-2 text-sm font-medium text-black transition-colors rounded-md bg-emerald hover:bg-emerald/90"
        >
          Elfogadom
        </button>
      </div>
    </div>
  )
}

export default CookieConsent
