import { NextResponse } from "next/server"
import { UsersTable } from "@/database/schema/user"
import { db } from "@/database/"
import { auth } from "@/auth"
import { eq } from "drizzle-orm"
import { differenceInDays } from "date-fns"

export async function POST(request: Request) {
  const session = await auth()

  if (!session || !session.user) {
    return NextResponse.json({ error: "Nincs bejelentkezve!" }, { status: 401 })
  }

  const [imageChangedAt] = await db
    .select()
    .from(UsersTable)
    .where(eq(UsersTable.id, session.user.id))
    .limit(1)

  if (
    imageChangedAt.imageChangedAt &&
    differenceInDays(new Date(), imageChangedAt.imageChangedAt) < 90
  ) {
    return NextResponse.json({
      error: `Legközelebb csak ${90 - differenceInDays(new Date(), imageChangedAt.imageChangedAt)} nap múlva módosíthatod a profilképet!`,
    })
  }

  const { fileUrl, uploadedBy } = await request.json()

  if (!fileUrl || !uploadedBy) {
    return NextResponse.json(
      { error: "Hiba történt a profilkép változtatása közben!" },
      { status: 400 }
    )
  }

  const [updateProfilePicture] = await db
    .update(UsersTable)
    .set({ image: fileUrl, imageChangedAt: new Date() })
    .where(eq(UsersTable.id, session.user.id))
    .returning({
      id: UsersTable.id,
      image: UsersTable.image,
    })

  if (!updateProfilePicture) {
    return NextResponse.json(
      { error: "Hiba történt a profilkép változtatása közben!" },
      { status: 400 }
    )
  }

  return NextResponse.json({ message: "Sikeres profilkép változtatás!" })
}
