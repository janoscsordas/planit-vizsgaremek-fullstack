export type UserData = {
    id: string
    email: string
    emailVerified: Date | null
    image: string | null
    name: string
    password: string | null
    tier: "free" | "paid"
    birthDate: Date | null
    createdAt: Date
    nameChangedAt: Date | null
    imageChangedAt: Date | null
}