import { AccountsTable, UsersTable } from '@/database/schema/user';
import { auth } from "@/auth"
import { eq } from "drizzle-orm"
import { db } from "@/database"
import { NextResponse } from "next/server"

export async function DELETE(request: Request) {
    try {
        const session = await auth()

        if (!session || !session.user) {
            return NextResponse.json({ error: "Nincs bejelentkezve" }, { status: 401 })
        }
    
        const [account] = await db
            .select()
            .from(AccountsTable)
            .where(eq(AccountsTable.userId, session.user.id))
            .limit(1)
    
        // Checking if the account is connected to Google or GitHub
        // If it is, revoking the user's access
        if (account) {
            if (account?.provider === "google") {
                // Revoke Google access
                await fetch(`https://oauth2.googleapis.com/revoke?token=${account.access_token}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                })
            } else if (account?.provider === "github") {
                // Revoke GitHub access
                await fetch(`https://api.github.com/settings/connections/applications/${process.env.GITHUB_CLIENT_ID}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Basic ${Buffer.from(process.env.GITHUB_CLIENT_ID + ":" + process.env.GITHUB_CLIENT_SECRET).toString("base64")}`
                    },
                    body: JSON.stringify({
                        access_token: account.access_token
                    })
                })
            }

            // Deleting the account from the database
            await db.delete(AccountsTable).where(eq(AccountsTable.userId, session.user.id))
        }
    
        // Deleting the user from the database
        // Only this one runs if the account was made with credentials provider
        await db.delete(UsersTable).where(eq(UsersTable.id, session.user.id))
    
        return NextResponse.json({ message: "Fiók törölve" }, { status: 200 })
    } catch (error) {
        console.error("Fiók törlése sikertelen", error)
        return NextResponse.json({ error: "Fiók törlése sikertelen" }, { status: 500 })
    }
}