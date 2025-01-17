import ProfileNavbar from "@/components/profile/profile-navbar"
import DialogForAccountDeletion from "@/components/profile/dialog-for-account-deletion"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import UserForm from "@/components/profile/forms/user-name-form"
import { db } from "@/database"
import { eq } from "drizzle-orm"
import { AccountsTable, UsersTable } from "@/database/schema/user"
import { UserData } from "@/lib/definitions/user-types"
import UserPasswordForm from "@/components/profile/forms/user-password-form"
import ProfilePictureForm from "@/components/profile/forms/profile-picture-form"
import ProfileHeader from "../profile-header"
import { Avatar, Badge } from "@radix-ui/themes"
import { formatDate } from "date-fns"
import Image from "next/image"
import BirthDateForm from "@/components/profile/forms/birth-date-form"
import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const session = await auth()
  const userName = session?.user?.name || "Profil"

  return {
    title: `Planitapp - ${userName}`,
    description: "Planitapp felhasználói profil kezelése",
    publisher: "Planitapp",
    openGraph: {
      title: `Planitapp - ${userName}`,
      description: "Planitapp felhasználói profil kezelése",
      siteName: "Planitapp",
      locale: "hu-HU",
      type: "website",
    },
  }
}

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
    name: getUserInformation.name ?? "",
    email: getUserInformation.email ?? "",
    emailVerified: getUserInformation.emailVerified ?? null,
    image: getUserInformation.image ?? null,
    password: getUserInformation.password ?? null,
    tier: getUserInformation.tier ?? "free",
    birthDate: getUserInformation.birthDate ?? null,
    createdAt: getUserInformation.createdAt ?? new Date(),
    nameChangedAt: getUserInformation.nameChangedAt ?? null,
    imageChangedAt: getUserInformation.imageChangedAt ?? null,
  }

  const [userAccount] = await db
    .select()
    .from(AccountsTable)
    .where(eq(AccountsTable.userId, session.user.id))
    .limit(1)

  return (
    <div className=" w-[90%] mx-auto pt-8 md:pt-16">
      <ProfileHeader birthDate={userData.birthDate} />

      <div className="flex flex-col md:flex-row">
        <ProfileNavbar />
        <div className="ml-0 md:ml-12 mt-2 w-full md:w-[65%]">
          <h3 className="text-xl font-medium">Profilom</h3>
          <p className="pt-2 text-sm text-muted-foreground">
            Ahogyan mások látnak téged az oldalon.
          </p>
          <hr className="my-6" />
          <div className="flex items-center gap-4 mb-4">
            <Avatar
              src={session.user.image ?? undefined}
              fallback={session.user.name?.charAt(0) || "?"}
              alt={session.user.name}
              size="5"
              radius="full"
            />
            <div>
              <h4 className="mt-2 font-medium text-md">{session.user.name}</h4>
              <p className="mb-1 text-sm text-muted-foreground">
                {session.user.email}
              </p>
              <Badge color={`${userData.tier === "free" ? "green" : "yellow"}`}>
                {userData.tier}
              </Badge>
            </div>
          </div>
          <hr className="my-6" />
          <div>
            <h4 className="mt-2 font-medium text-md">Regisztráció dátuma:</h4>
            <p className="mb-1 text-sm text-muted-foreground">
              {formatDate(userData.createdAt, "yyyy.MM.dd HH:mm")}
            </p>
          </div>
          <hr className="my-6" />
          {userAccount && (
            <>
              <div>
                <h4 className="mt-2 font-medium text-md">
                  Összekapcsolt fiók:
                </h4>
                {userAccount.provider && (
                  <div className="flex gap-2 mt-1 mb-1 text-sm text-muted-foreground">
                    <Image
                      src={`${userAccount.provider}.svg`}
                      alt={userAccount.provider}
                      width={16}
                      height={16}
                    />
                    {userData.name}
                  </div>
                )}
              </div>
              <hr className="my-6" />
            </>
          )}

          {/* User Form where the user can change their name */}
          <UserForm userData={userData} />

          {/* Form for adding a birth date to the user account */}
          <BirthDateForm birthDate={userData.birthDate} />

          {/* Form where the user can change their profile picture every 90 days */}
          <ProfilePictureForm
            imageChangedAt={userData.imageChangedAt}
            userId={session.user.id}
          />

          {/* If user registered with credentials, their password can be changed */}
          {userData.password ? <UserPasswordForm /> : null}

          {/* Section for account deletion */}
          <section className="p-4 mt-6 mb-10 border border-red-600 rounded-md">
            <h1 className="font-medium text-red-500 text-md">
              Veszélyes zóna!
            </h1>
            <p className="text-sm text-muted-foreground">
              A változtások nem visszavonhatóak!
            </p>
            <DialogForAccountDeletion userName={session.user.name} />
          </section>
        </div>
      </div>
    </div>
  )
}
