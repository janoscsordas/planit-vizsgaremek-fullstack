"use client"

import { useState, useEffect } from "react"
import { X, Cookie } from "lucide-react"

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("token")
    if (!consent) {
      setTimeout(() => setIsVisible(true), 1000)
    }
  }, [])

  const handleAccept = () => {
    setIsClosing(true)
    localStorage.setItem("token", "true")
    setTimeout(() => setIsVisible(false), 500)
  }

  const handleDecline = () => {
    setIsClosing(true)
    setTimeout(() => setIsVisible(false), 500)
  }

  if (!isVisible) return null

  return (
    <div
      className={`fixed md:bottom-8 md:right-8 bottom-2 max-w-2xl w-[95%] p-6 bg-card border-2 rounded-xl shadow-lg text-left z-50 transition-all duration-500 ease-out ${
        isClosing ? "opacity-0 translate-y-10" : "opacity-100 translate-y-0"
      }`}
    >
      <button
        onClick={handleDecline}
        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X size={20} />
      </button>

      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
        <Cookie size={20} /> Süti beállítások
      </h3>

      <p className="text-muted-foreground mb-4">
        A weboldalunk sütiket használ a jobb működéshez és a felhasználói élmény
        javításához. A további böngészéshez kérjük, tekintse át{" "}
        <a
          href="/privacy-policy"
          className="text-emerald hover:underline font-medium"
        >
          Adatvédelmi szabályzatunkat
        </a>
        .
      </p>

      <div className="flex gap-4 justify-end">
        <button
          onClick={handleAccept}
          className="bg-emerald hover:bg-emerald/90 px-6 py-2 text-sm font-medium rounded-md text-black transition-colors"
        >
          Elfogadom
        </button>
      </div>
    </div>
  )
}

export default CookieConsent
