import ProfileNavbar from "@/components/profile/ProfileNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DialogForAccountDeletion from "@/components/profile/DialogForAccountDeletion";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import UserForm from "@/components/profile/forms/UserNameForm";
import { db } from "@/database";
import { eq } from "drizzle-orm";
import { UsersTable } from "@/database/schema/user";
import { UserData } from "@/lib/definitions/user-types";
import UserPasswordForm from "@/components/profile/forms/UserPasswordForm";
import ProfilePictureForm from "@/components/profile/forms/ProfilePictureForm";


export default async function ProfilePage() {
    const session = await auth()

    if (!session || !session.user || !session.user.name) {
        redirect("/login")
    }

    const [getUserInformation] = await db
        .select()
        .from(UsersTable)
        .where(eq(UsersTable.id, session.user.id))
        .limit(1)

    if (!getUserInformation) {
        redirect("/login")
    }

    const userData: UserData = {
        id: getUserInformation.id,
        name: getUserInformation.name ?? '',
        email: getUserInformation.email ?? '',
        emailVerified: getUserInformation.emailVerified ?? null,
        image: getUserInformation.image ?? null,
        password: getUserInformation.password ?? null,
        tier: getUserInformation.tier ?? 'free',
        birthDate: getUserInformation.birthDate ?? null,
        createdAt: getUserInformation.createdAt ?? new Date(),
        nameChangedAt: getUserInformation.nameChangedAt ?? null,
        imageChangedAt: getUserInformation.imageChangedAt ?? null,
    }
    
    return (
        <div className=" w-[90%] mx-auto pt-8 md:pt-16">
            <section className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
                <h2 className="text-2xl font-bold">
                    Fiókbeállítások
                </h2>
                <p className="text-muted-foreground pt-2">
                    Fiókbeállítások kezelése és testreszabása.
                </p>
            </div>
            <Link href="/projects">
                <Button variant="outline"><ChevronLeft /> Vissza a projektekhez</Button>
            </Link>
            </section>
            <hr className="my-6" />
            <div className="flex flex-col md:flex-row">
                <ProfileNavbar />
                <div className="ml-0 md:ml-12 mt-2 w-full md:w-[50%]">
                    <h3 className="text-xl font-medium">Profilom</h3>
                    <p className="text-muted-foreground text-sm pt-2">Ahogyan mások látnak téged az oldalon.</p>
                    <hr className="my-6" />
                    
                    {/* User Form where the user can change their name and birthday */}
                    <UserForm userData={userData} />
                    
                    <ProfilePictureForm />

                    {userData.password ? <UserPasswordForm /> : null}

                    <section className="mt-6 border border-red-600 rounded-md p-4 mb-10">
                        <h4 className="font-medium text-md text-red-500">Veszélyes zóna!</h4>
                        <p className="text-muted-foreground text-sm">Amit itt tehetsz abból nincs visszaút!</p>
                        <DialogForAccountDeletion userName={session.user.name} />
                    </section>
                </div>
            </div>
        </div>
    )
}