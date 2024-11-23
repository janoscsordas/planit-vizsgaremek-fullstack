import ProfileNavbar from "@/components/profile/ProfileNavbar";
import DialogForAccountDeletion from "@/components/profile/DialogForAccountDeletion";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import UserForm from "@/components/profile/forms/UserNameForm";
import { db } from "@/database";
import { eq } from "drizzle-orm";
import { UsersTable } from "@/database/schema/user";
import { UserData } from "@/lib/definitions/user-types";
import UserPasswordForm from "@/components/profile/forms/UserPasswordForm";
import ProfilePictureForm from "@/components/profile/forms/ProfilePictureForm";
import ProfileHeader from "../ProfileHeader";


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
            <ProfileHeader />
            
            <div className="flex flex-col md:flex-row">
                <ProfileNavbar />
                <div className="ml-0 md:ml-12 mt-2 w-full md:w-[50%]">
                    <h3 className="text-xl font-medium">Profilom</h3>
                    <p className="text-muted-foreground text-sm pt-2">Ahogyan mások látnak téged az oldalon.</p>
                    <hr className="my-6" />
                    
                    {/* User Form where the user can change their name */}
                    <UserForm userData={userData} />
                    
                    {/* Form where the user can change their profile picture every 90 days */}
                    <ProfilePictureForm imageChangedAt={userData.imageChangedAt} />

                    {/* If user registered with credentials, their password can be changed */}
                    {userData.password ? <UserPasswordForm /> : null}

                    {/* Section for account deletion */}
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