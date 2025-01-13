import { auth } from "@/auth";
import { db } from "@/database";
import { UsersTable } from "@/database/schema/user";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function PUT(request: Request) {
    const session = await auth()

    if (!session || !session.user) {
        return NextResponse.json({ error: "Nincs bejelentkezve" }, { status: 401 })
    }

    const { birthDate } = await request.json()

    if (!birthDate) {
        return NextResponse.json({ error: "Hibás vagy hiányzó adatok" }, { status: 400 })
    }

    const birthDateObject = new Date(birthDate)

    const validatedBirthDate = z.date().safeParse(birthDateObject)

    if (!validatedBirthDate.success) {
        return NextResponse.json({ error: validatedBirthDate.error.message }, { status: 400 })
    }

    try {
        await db
            .update(UsersTable)
            .set({ birthDate: validatedBirthDate.data })
            .where(eq(UsersTable.id, session.user.id))
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ error: "Hiba történt a születési dátum megadása közben!" }, { status: 500 })
    }

    return NextResponse.json({ message: 'Születési dátum sikeresen megadva!' }, { status: 200 })
}