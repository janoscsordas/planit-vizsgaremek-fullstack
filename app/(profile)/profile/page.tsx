import ProfileNavbar from "@/components/profile/ProfileNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";

export default function AppearancePage() {
    return (
        <div className="w-[90%] mx-auto pt-16">
            <h2 className="text-2xl font-bold">
                Fiókbeállítások
            </h2>
            <p className="text-muted-foreground pt-2">
                Fiókbeállítások kezelése és testreszabása.
            </p>
            <hr className="my-6" />
            <div className="flex">
                <ProfileNavbar />
                <div className="ml-12 mt-2 w-[50%]">
                    <h3 className="text-xl font-medium">Profilom</h3>
                    <p className="text-muted-foreground pt-2">Ahogyan mások látnak téged az oldalon.</p>
                    <hr className="my-6" />
                    <form action="">
                        <h4 className="font-medium">Felhasználónév</h4>
                        <Input type="text" placeholder="Felhasználónév" className="mt-2" />
                        <p className="text-muted-foreground pt-2">Ez a nyílvános felhasználóneved. Csak 30 naponta módosítható.</p>
                        <h4 className="font-medium mt-10">Születési dátum</h4>
                        <Calendar className="mt-2 border rounded-md p-2 w-fit" />
                        <p className="text-muted-foreground pt-2">Válaszd ki a születési dátumod.</p>
                    </form>
                    <form action="">
                        <h4 className="font-medium mt-10">Profilkép</h4>
                        <Input id="file" type="file" className="mt-2" />
                    </form>
                    <form action="">
                        
                    </form>
                </div>
            </div>
        </div>
    )
}