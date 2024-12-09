import { db } from "@/database";
import { UsersTable } from "@/database/schema/user";
import { inArray } from "drizzle-orm";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const session = await auth()

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userIds } = await request.json()

    try {
        // Fetch user details for given user IDs
        const users = await db
            .select()
            .from(UsersTable)
            .where(inArray(UsersTable.id, userIds));

        // Convert to object for easy lookup
        const userDetails = users.reduce((acc: { [key: string]: any }, user) => {
            acc[user.id] = {
                name: user.name,
                image: user.image
            };
            return acc;
        }, {})

        return NextResponse.json(userDetails, { status: 200 })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch user details' }, { status: 500 })
    }
}