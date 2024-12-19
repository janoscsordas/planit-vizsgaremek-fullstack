import { DrizzleAdapter } from "@auth/drizzle-adapter"
import NextAuth, { NextAuthConfig, User } from "next-auth"
import { encode as defaultEncode } from "next-auth/jwt"
import { db } from "./database/index"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { v4 as uuid } from "uuid"
import { getUserFromDb } from "./actions/user.action"
import { eq } from "drizzle-orm"
import {AccountsTable, UsersTable} from "@/database/schema/user"

const adapter = DrizzleAdapter(db)

export const authConfig = {
    adapter,
    providers: [
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID!,
            clientSecret: process.env.AUTH_GITHUB_SECRET!,
            async profile(profile) {
                // Check if the avatar URL starts with "private-avatars"
                if (profile.avatar_url.startsWith('https://private-avatars')) {
                  // Replace with the public URL
                  profile.avatar_url = profile.avatar_url.replace('private-', '');
                }
                return {
                    id: profile.id.toString(),
                    name: profile.name,
                    email: profile.email,
                    image: profile.avatar_url
                } as User;
            },
        }),
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!
        }),
        Credentials({
            async authorize(credentials) {
                const { email, password } = credentials

                if (!email || !password) {
                    throw new Error("Email vagy jelszó nem található")
                }

                const response = await getUserFromDb(email as string, password as string)
                if (response.success) {
                    return response.data as User
                }

                return null
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            if (account?.provider === "credentials") {
                token.credentials = true
            }

            return token
        },
        async signIn({ user, account }) {
            try {
                if (user.email) {
                    const existingUser = await db
                        .select()
                        .from(UsersTable)
                        .where(eq(UsersTable.email, user.email))
                        .limit(1)
                        .then(rows => rows[0]);

                    if (existingUser) {
                        const existingAccount = await db
                            .select()
                            .from(AccountsTable)
                            .where(eq(AccountsTable.userId, existingUser.id))
                            .limit(1)
                            .then(rows => rows[0]);

                        if (existingAccount && existingAccount.provider !== account?.provider) {
                            return `/login?errorMessage=${encodeURIComponent(
                                `Már van felhasználói fiókod a következővel: "${existingAccount.provider.toUpperCase()}". Jelentkezz be azzal a folytatáshoz.`
                            )}`
                        }
                    }
                }
                return true;
            } catch (error) {
                return `/login?errorMessage=${encodeURIComponent(
                    "Hiba történt az autentikáció során."
                )}`
            }
        },
    },
    jwt: {
        encode: async function(params) {
            if (params.token?.credentials) {
                const sessionToken = uuid()

                if (!params.token.sub) {
                    throw new Error("Nem található a felhasználó azonosítója")
                }

                const createdSession = await adapter?.createSession?.({
                    sessionToken,
                    userId: params.token.sub,
                    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days token expiration
                })

                if (!createdSession) {
                    throw new Error("Nem sikerült létrehozni a sessiont")
                }

                return sessionToken
            }

            return defaultEncode(params)
        }
    },
    secret: process.env.AUTH_SECRET as string,
    pages: {
        signIn: "/login"
    },
    trustHost: true,
} satisfies NextAuthConfig

export const { auth, signIn, signOut, handlers } = NextAuth(authConfig)