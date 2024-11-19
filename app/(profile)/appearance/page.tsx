import ProfileNavbar from "@/components/profile/ProfileNavbar";

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
                <div className="ml-12">
                    <h3 className="text-xl font-bold">Megjelenés</h3>
                </div>
            </div>
        </div>
    )
}