import { auth } from "@/auth"
import { TextField } from "@radix-ui/themes"
import { Search } from "lucide-react"
import { redirect } from "next/navigation"

export default async function Page() {
    const session = await auth()

    if (!session || !session.user) {
        return redirect('/login')
    }

    return (
        <>
            <header>
                <div className="border-b border-muted">
                    <h1 className="text-lg font-semibold py-3 pl-2">Könyvtár</h1>
                </div>
                <div className="border-b border-muted">
                    <TextField.Root placeholder="Korábbi chat keresés..." className="my-3 mx-2" color="green">
                        <TextField.Slot>
                            <Search className="w-4 h-4" />
                        </TextField.Slot>
                    </TextField.Root>
                </div>
            </header>
            <section className="pl-2 py-3 min-h-[calc(100dvh-110px)] max-h-[calc(100dvh-110px)] overflow-y-auto">
                <p className="text-muted-foreground text-sm">Még nincs chat előzményed.</p>
            </section>
        </>
    )
}