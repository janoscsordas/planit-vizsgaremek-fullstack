import Link from "next/link"
import { XCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col gap-8 justify-center items-center">
      <div className="relative flex flex-col items-center">
        <XCircle className="w-24 h-24 text-emerald-500 animate-pulse mb-6" />

        <h1 className="text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-emerald to-emerald animate-fade-in">
          404
        </h1>

        <h2 className="text-2xl font-semibold mt-2 text-gray-900 dark:text-gray-100">
          Nincs találat
        </h2>

        <p className="text-base text-gray-600 dark:text-gray-300 mt-4 max-w-md text-center">
          A keresett oldal nem található. Ellenőrízd a megadott címet, vagy térj
          vissza a főoldalra.
        </p>
      </div>

      <Link
        href="/"
        className="rounded-md bg-emerald px-6 py-3 text-center text-sm font-semibold text-black shadow-sm"
      >
        <span className="relative z-10">Vissza a főoldalra</span>
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
      </Link>
    </div>
  )
}
