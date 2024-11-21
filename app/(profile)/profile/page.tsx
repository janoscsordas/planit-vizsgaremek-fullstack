import ProfileNavbar from "@/components/profile/ProfileNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/profile/DatePicker";

export default function ProfilePage() {

    return (
        <div className="w-[90%] mx-auto pt-8 md:pt-16">
            <h2 className="text-2xl font-bold">
                Fiókbeállítások
            </h2>
            <p className="text-muted-foreground pt-2">
                Fiókbeállítások kezelése és testreszabása.
            </p>
            <hr className="my-6" />
            <div className="flex flex-col md:flex-row">
                <ProfileNavbar />
                <div className="ml-0 md:ml-12 mt-2 w-full md:w-[50%]">
                    <h3 className="text-xl font-medium">Profilom</h3>
                    <p className="text-muted-foreground text-sm pt-2">Ahogyan mások látnak téged az oldalon.</p>
                    <hr className="my-6" />
                    <form action="" className="border border-muted rounded-md p-4">
                        <h4 className="font-medium text-sm">Felhasználónév</h4>
                        <Input className="mt-2 text-sm" type="text" placeholder="Felhasználónév" />
                        <p className="text-muted-foreground text-xs pt-2">Ez a nyílvános felhasználóneved. Csak 30 naponta módosítható.</p>
                        <h4 className="font-medium text-sm mt-10">Születési dátum</h4>
                        <DatePicker />
                        <p className="text-muted-foreground text-xs pt-2">Válaszd ki a születési dátumod.</p>
                        <Button className="mb-10 md:mb-0 mt-10 bg-emerald hover:bg-emerald-hover" type="submit">Mentés</Button>
                    </form>
                    <form action="" className="border border-muted rounded-md p-4 mt-6">
                        <h4 className="font-medium text-sm">Profilkép</h4>
                        <Input id="file" type="file" className="mt-2" />
                        <Button className="mb-10 md:mb-0 mt-10 bg-emerald hover:bg-emerald-hover" type="submit">Mentés</Button>
                    </form>
                    <form action="" className="border border-muted rounded-md p-4 mt-6">
                        <h4 className="font-medium text-sm">Jelszó</h4>
                        <Input className="mt-2 text-sm" type="password" placeholder="Új jelszó" />
                        <Input className="mt-2 text-sm" type="password" placeholder="Új jelszó megerősítése" />
                        <Button className="mb-10 md:mb-0 mt-10 bg-emerald hover:bg-emerald-hover" type="submit">Mentés</Button>
                    </form>
                </div>
            </div>
        </div>
    )
}