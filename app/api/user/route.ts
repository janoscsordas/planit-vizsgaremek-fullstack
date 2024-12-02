import { AccountsTable, UsersTable } from '@/database/schema/user'
import { auth } from '@/auth'
import { eq } from 'drizzle-orm'
import { db } from '@/database'
import { NextResponse } from 'next/server'
import { userChangeFormSchema } from '@/lib/schemas/userSchema'
import { differenceInDays } from 'date-fns'
import { hash } from 'bcryptjs'

// API Route for updating the user's password
export async function POST(request: Request) {
	try {
		const session = await auth()

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Nincs bejelentkezve!' })
		}

		const { password, confirmPassword } = await request.json()

		if (password !== confirmPassword) {
			return NextResponse.json({
				error: 'A megadott jelszavak nem egyeznek!',
			})
		}

		const hashedPassword = await hash(password, 10)

		if (!hashedPassword) {
			return NextResponse.json({
				error: 'Hiba a jelszóváltoztatásossal!',
			})
		}

		const updatePassword = await db
			.update(UsersTable)
			.set({ password: hashedPassword })
			.where(eq(UsersTable.id, session.user.id))

		if (!updatePassword) {
			return NextResponse.json({
				error: 'Hiba a jelszóváltoztatás közben!',
			})
		}

		return NextResponse.json({ message: 'Sikeres jelszóváltoztatás!' })
	} catch (error: any | unknown) {
		return NextResponse.json({ error: error.error })
	}
}

// PUT Route for updating the user's name
export async function PUT(request: Request) {
	try {
		const session = await auth()

		if (!session || !session.user) {
			return NextResponse.json(
				{ error: 'Nincs bejelentkezve' },
				{ status: 401 }
			)
		}

		const { name } = await request.json()
		const validatedData = userChangeFormSchema.safeParse({ name })

		if (!validatedData.success) {
			return NextResponse.json({ error: 'Hibás adatok' }, { status: 400 })
		}

		if (validatedData.data.name === session.user.name) {
			return NextResponse.json(
				{ error: 'Nem adhatod meg ugyanazt a nevet!' },
				{ status: 400 }
			)
		}

		const [fetchNameChangedAt] = await db
			.select()
			.from(UsersTable)
			.where(eq(UsersTable.id, session.user.id))
			.limit(1)

		if (
			fetchNameChangedAt.nameChangedAt &&
			differenceInDays(new Date(), fetchNameChangedAt.nameChangedAt) < 90
		) {
			return NextResponse.json(
				{
					error: `Legközelebb csak ${
						90 -
						differenceInDays(
							new Date(),
							fetchNameChangedAt.nameChangedAt
						)
					} nap múlva módosíthatod a neved!`,
				},
				{ status: 400 }
			)
		}

		await db
			.update(UsersTable)
			.set({ name: validatedData.data.name, nameChangedAt: new Date() })
			.where(eq(UsersTable.id, session.user.id))

		return NextResponse.json(
			{ message: 'Profil sikeresen szerkesztve!' },
			{ status: 200 }
		)
	} catch (error) {
		console.error('Profil szerkesztése sikertelen', error)
		return NextResponse.json(
			{ error: 'Profil szerkesztése sikertelen' },
			{ status: 500 }
		)
	}
}

// DELETE Route for deleting the user
export async function DELETE(request: Request) {
	try {
		const session = await auth()

		if (!session || !session.user) {
			return NextResponse.json(
				{ error: 'Nincs bejelentkezve' },
				{ status: 401 }
			)
		}

		const [account] = await db
			.select()
			.from(AccountsTable)
			.where(eq(AccountsTable.userId, session.user.id))
			.limit(1)

		// Checking if the account is connected to Google or GitHub
		// If it is, revoking the user's access
		if (account) {
			if (account?.provider === 'google') {
				// Revoke Google access
				await fetch(
					`https://oauth2.googleapis.com/revoke?token=${account.access_token}`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
						},
					}
				)
			} else if (account?.provider === 'github') {
				// Revoke GitHub access
				await fetch(
					`https://api.github.com/settings/connections/applications/${process.env.GITHUB_CLIENT_ID}`,
					{
						method: 'DELETE',
						headers: {
							Authorization: `Basic ${Buffer.from(
								process.env.GITHUB_CLIENT_ID +
									':' +
									process.env.GITHUB_CLIENT_SECRET
							).toString('base64')}`,
						},
						body: JSON.stringify({
							access_token: account.access_token,
						}),
					}
				)
			}

			// Deleting the account from the database
			await db
				.delete(AccountsTable)
				.where(eq(AccountsTable.userId, session.user.id))
		}

		// Deleting the user from the database
		// Only this one runs if the account was made with credentials provider
		await db.delete(UsersTable).where(eq(UsersTable.id, session.user.id))

		return NextResponse.json({ message: 'Fiók törölve' }, { status: 200 })
	} catch (error) {
		console.error('Fiók törlése sikertelen', error)
		return NextResponse.json(
			{ error: 'Fiók törlése sikertelen' },
			{ status: 500 }
		)
	}
}
