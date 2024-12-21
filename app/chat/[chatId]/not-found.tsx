import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {

    return (
        <div className="flex items-center justify-center w-full min-h-screen">
            <div>
                <h1 className="text-4xl font-bold text-center text-emerald">404</h1>
                <p className="text-center text-lg text-muted-foreground">Az keresett chat nem található. Eltévedtél?</p>
                <Link href="/chat" className="block w-max mx-auto">
                    <Button className="mt-4 bg-emerald hover:bg-emerald-hover">
                        Vissza a chathez
                    </Button>
                </Link>
            </div>
        </div>
    )
}