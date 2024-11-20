'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ErrorPage() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')
    const message = searchParams.get('message')

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="rounded-lg bg-accent p-8 shadow-lg">
                <h1 className="mb-4 text-xl font-bold text-red-500">
                    Autentikációs Hiba
                </h1>
                <p className="text-gray-300">
                    {message || error || "Hiba történt az Autentikáció közben!"}
                </p>
                <Link
                    href="/login"
                    className="mt-4 inline-block rounded bg-emerald px-4 py-2 text-primary hover:bg-emerald-hover"
                >
                    Vissza az autentikációs oldalra
                </Link>
            </div>
        </div>
    )
}