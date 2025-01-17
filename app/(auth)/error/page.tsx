"use client"

import Link from "next/link"

export default function ErrorPage() {

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 rounded-lg shadow-lg bg-accent">
        <h1 className="mb-4 text-xl font-bold text-red-500">
          Autentikációs Hiba!
        </h1>
        <p className="text-gray-300">
          Hiba történt az Autentikáció közben!
        </p>
        <Link
          href="/login"
          className="inline-block px-4 py-2 mt-4 rounded bg-emerald text-primary hover:bg-emerald-hover"
          aria-label="Vissza az autentikációs oldalra"
        >
          Vissza az autentikációs oldalra
        </Link>
      </div>
    </div>
  )
}
