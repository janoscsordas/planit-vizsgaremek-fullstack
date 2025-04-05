import { db } from "@/database";
import { UsersTable } from "@/database/schema/user";
import { inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userIds }: { userIds: string[] } = await request.json();

  if (userIds.length === 0) {
    return NextResponse.json(
      []
    );
  }

  const uniqueUserIds = [...new Set(userIds)];

  const enrichedUsers = await db
    .select({
      id: UsersTable.id,
      name: UsersTable.name,
      email: UsersTable.email,
      image: UsersTable.image,
    })
    .from(UsersTable)
    .where(inArray(UsersTable.id, uniqueUserIds));

  return NextResponse.json(enrichedUsers, { status: 200 });
}
