"use server"

import { Resend } from "resend"
import VerificationEmail from "@/lib/emails/email-succesful"

export async function sendVerificationEmail(
  email: string,
  name: string,
  verificationLink: string
) {
  // Initialize Resend client
  const resend = new Resend(process.env.RESEND_API_KEY)

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
