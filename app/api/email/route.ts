import { NextResponse } from "next/server"
import { Resend } from "resend"
import VerificationEmail from "@/emails/email-succesful"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { email, name, verificationLink } = await req.json()

  await resend.emails.send({
    from: "no-reply@planitapp.hu",
    to: email,
    subject: "Planitapp - Sikeres regisztráció",
    react: VerificationEmail({
      name: name,
      verificationLink: verificationLink,
    }),
  })

  return NextResponse.json({ message: "Email sent successfully" })
}
