"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const message = searchParams.get("message")

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 rounded-lg shadow-lg bg-accent">
        <h1 className="mb-4 text-xl font-bold text-red-500">
          Autentikációs Hiba!
        </h1>
        <p className="text-gray-300">
          {message || error || "Hiba történt az Autentikáció közben!"}
        </p>
        <Link
          href="/login"
          className="inline-block px-4 py-2 mt-4 rounded bg-emerald text-primary hover:bg-emerald-hover"
        >
          Vissza az autentikációs oldalra
        </Link>
      </div>
    </div>
  )
}
