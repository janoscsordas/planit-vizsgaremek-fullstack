import Link from "next/link"
import { XCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen gap-8">
      <div className="relative flex flex-col items-center">
        <XCircle className="w-24 h-24 mb-6 text-emerald-500 animate-pulse" />

        <h1 className="text-6xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-emerald to-emerald animate-fade-in">
          404
        </h1>

        <h2 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Nincs találat!
        </h2>

        <p className="max-w-md mt-4 text-base text-center text-gray-600 dark:text-gray-300">
          A keresett oldal nem található. Ellenőrízd a megadott címet, vagy térj
          vissza a főoldalra.
        </p>
      </div>

      <Link
        href="/"
        className="px-6 py-3 text-sm font-semibold text-center text-black rounded-md shadow-sm bg-emerald"
        aria-label="Vissza a főoldalra"
      >
        <span className="relative z-10">Vissza a főoldalra</span>
        <div className="absolute inset-0 transition-transform duration-300 ease-in-out -translate-x-full group-hover:translate-x-0" />
      </Link>
    </div>
  )
}
