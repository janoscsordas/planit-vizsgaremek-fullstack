import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex items-center justify-center flex-col">
            <h1 className="text-4xl font-bold">404</h1>
            <p>A keresett link nem található.</p>
            <Link href="/projects">
                <Button className="bg-emerald hover:bg-emerald-hover">
                    Vissza az előző oldalra
                </Button>
            </Link>
        </div>
    )
}