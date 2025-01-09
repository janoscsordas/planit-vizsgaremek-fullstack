"use client"

import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex items-center justify-center flex-col min-h-screen">
            <h1 className="text-4xl font-bold">404</h1>
            <p>A keresett link nem található.</p>
            <Button className="bg-emerald hover:bg-emerald-hover" onClick={() => window.history.back()}>
                Vissza az előző oldalra
            </Button>
        </div>
    )
}