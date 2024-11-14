import { z } from "zod"

export const loginSchema = z.object({
    email: z.string()
        .email()
        .min(1, { message: "Email cím megadása kötelező" })
        .max(64, { message: "Email cím maximum 64 karakter lehet" }),
    password: z.string()
        .min(1, { message: "Jelszó megadása kötelező" })
        .max(32, { message: "Jelszó maximum 32 karakter lehet" })
})

export const signupSchema = z.object({
    name: z.string()
        .min(3, { message: "A név minimum 3 karakter lehet" })
        .max(48, { message: "A név maximum 48 karakter lehet" }),
    email: z.string()
        .email()
        .min(1, { message: "Email cím megadása kötelező" })
        .max(64, { message: "Email cím maximum 64 karakter lehet" }),
    password: z.string()
        .min(1, { message: "Jelszó megadása kötelező" })
        .max(32, { message: "Jelszó maximum 32 karakter lehet" })
        .regex(/[!@#$%^&*(),.?":{}|<>-]/, { message: "A jelszónak tartalmaznia kell legalább egy speciális karaktert" }),
})
