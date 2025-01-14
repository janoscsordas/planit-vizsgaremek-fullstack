"use server"

import { signIn } from "@/auth"
import { db } from "@/database"
import { UsersTable, VerificationTokensTable } from "@/database/schema/user"
import { loginSchema, signupSchema } from "@/lib/schemas/userSchema"
import { compare, hash } from "bcryptjs"
import { eq } from "drizzle-orm"
import { CredentialsSignin } from "next-auth"
import { nanoid } from "nanoid"
import { add } from "date-fns"
import { sendVerificationEmail } from "./email.action"
import { ZodError } from "zod"
import { UserData } from "@/lib/definitions/user-types"

// Get user from database by email
export async function getUserFromDb(
  email: string,
  password: string
): Promise<{
  success: boolean
  data?: UserData
  message?: string
}> {
  try {
    // Querying user from database by email
    const [userData] = await db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.email, email))
      .limit(1)

    // If user not found, throw an error
    if (!userData) {
      throw new Error("Nem található a felhasználó az adatbázisban!")
    }

    // If user has no password, throw an error
    if (!userData.password) {
      throw new Error("A regisztrált email OAuth providerrel lett létrehozva!")
    }

    // Compare password with given password
    const isPasswordValid = await compare(password, userData.password)

    // If password is not valid, throw an error
    if (!isPasswordValid) {
      throw new Error("Hibás email cím vagy jelszó!")
    }

    // Return user data
    return {
      success: true,
      data: userData as UserData,
    }
  } catch (error: any) {
    if (error instanceof CredentialsSignin) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            message: "Hibás email vagy jelszó!",
          }
        default:
          return {
            success: false,
            message: "Hiba történt!",
          }
      }
    }
    return {
      success: false,
      message: error.message,
    }
  }
}

// Login function
export async function login({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<{
  success: boolean
  data?: UserData
  message?: Record<string, string> | string
}> {
  try {
    // Validate login data
    await loginSchema.parseAsync({ email, password })

    // Check if user exists in database
    const userExists = await getUserFromDb(email, password)

    if (!userExists.success || !userExists.data) {
      return {
        success: false,
        message: { credentials: "Hibás email cím vagy jelszó!" },
      }
    }

    const userData: UserData = userExists.data

    if (userData.emailVerified === null) {
      return {
        success: false,
        message: { email: "Kérlek erősítsd meg a regisztrált email címed!" },
      }
    }

    // Sign in user
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })

    return {
      success: true,
      data: res,
    }
  } catch (error: any) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.reduce(
        (acc: Record<string, string>, curr) => {
          const field = curr.path[0]?.toString() || "credentials"
          acc[field] = curr.message
          return acc
        },
        {}
      )

      return {
        success: false,
        message: formattedErrors,
      }
    }

    return {
      success: false,
      message: { credentials: "Hiba történt a bejelentkezés során!" },
    }
  }
}

// Signup function
export async function signup({
  name,
  email,
  password,
}: {
  name: string
  email: string
  password: string
}): Promise<{
  success: boolean
  data?: unknown
  message?: Record<string, string> | string
}> {
  try {
    await signupSchema.parseAsync({ email, password, name })

    const [userExists] = await db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.email, email))
      .limit(1)

    // If user exists, throw an error
    if (userExists) {
      throw new Error("A felhasználó már létezik ezzel az email címmel!")
    }

    // Hashing password with bcryptjs
    const hashedPassword = await hash(password, 10)

    // Insert user to database
    const [user] = await db
      .insert(UsersTable)
      .values({
        name,
        email,
        password: hashedPassword,
      })
      .returning({
        id: UsersTable.id,
        name: UsersTable.name,
        email: UsersTable.email,
      })

    if (!user) {
      throw new Error("Hiba történt a felhasználó létrehozása során!")
    }

    const userEmail = user.email
    const userName = user.name

    if (!userEmail || !userName) {
      throw new Error("Hiba történt a felhasználó létrehozása során!")
    }

    // Create verification token
    const token = nanoid(32)
    await db.insert(VerificationTokensTable).values({
      identifier: userEmail, // Using email as identifier
      token,
      expires: add(new Date(), { hours: 24 }), // Token expires in 24 hours
    })

    // Send verification email
    await sendVerificationEmail(
      userEmail,
      userName,
      `${process.env.NEXT_PUBLIC_APP_URL}/verify-email/${token}`
    )

    return {
      success: true,
      data: user,
    }
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.reduce(
        (acc: Record<string, string>, curr) => {
          const field = curr.path[0]?.toString() || "general"
          acc[field] = curr.message
          return acc
        },
        {}
      )

      return {
        success: false,
        message: formattedErrors,
      }
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Hiba történt a regisztráció során!",
    }
  }
}

// Email verify function
export async function verifyEmail(token: string): Promise<{
  success: boolean
  message: string
}> {
  try {
    // Find the verification token
    const [verificationToken] = await db
      .select()
      .from(VerificationTokensTable)
      .where(eq(VerificationTokensTable.token, token))
      .limit(1)

    if (!verificationToken) {
      throw new Error("Nem található a token az adatbázisban!")
    }

    // Check if token is expired
    if (new Date() > verificationToken.expires) {
      await db
        .delete(VerificationTokensTable)
        .where(eq(VerificationTokensTable.token, token))

      throw new Error("A token lejárt!")
    }

    // Update user's email verification status
    await db
      .update(UsersTable)
      .set({
        emailVerified: new Date(),
      })
      .where(eq(UsersTable.email, verificationToken.identifier))

    // Delete the verification token
    await db
      .delete(VerificationTokensTable)
      .where(eq(VerificationTokensTable.token, token))

    return { success: true, message: "Email cím megerősítve!" }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    }
  }
}
