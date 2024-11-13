import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen w-full flex flex-col gap-8 justify-center items-center">
            <h1 className="text-4xl font-bold text-center">404 - Nincs találat</h1>
            <p className="text-sm text-muted-foreground text-center">A keresett oldal nem található.</p>
            <Link href="/" className="bg-emerald text-white dark:text-black border-emerald-hover px-4 py-2 rounded-none text-center">Vissza a főoldalra</Link>
        </div>
    )
}