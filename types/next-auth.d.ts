import NextAuth, { type DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            emailVerified: Date | null
            role: string
            birthDate: Date | null
            createdAt: Date
        } & DefaultSession["user"]
    }
}