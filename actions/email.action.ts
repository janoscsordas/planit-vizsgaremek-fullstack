"use server"

import { Resend } from "resend"
import VerificationEmail from '@/emails/email-succesful';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, name: string, verificationLink: string) {
    await resend.emails.send({
        from: "no-reply@planitapp.hu",
        to: email,
        subject: "Planitapp - Sikeres regisztráció",
        react: VerificationEmail({
            name: name,
            verificationLink: verificationLink,
        }),
    })
}
