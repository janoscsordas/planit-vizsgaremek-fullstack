import LoginForm from "./login-form"
import Image from "next/image"
import Link from "next/link"
import AuthButtons from "@/components/auth/auth-buttons"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Planitapp - Bejelentkezés",
  description: "Planitapp - Bejelentkezés",
  publisher: "Planitapp",
  openGraph: {
    title: "Planitapp - Bejelentkezés",
    description: "Planitapp - Bejelentkezés",
    siteName: "Planitapp",
    locale: "hu-HU",
    type: "website",
  },
}

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ errorMessage?: string; message?: string }>
}) {
  const session = await auth()
  const { errorMessage, message } = await searchParams

  if (session?.user) {
    return redirect("/projects")
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen gap-8 py-12">
      <Link href={"/"} aria-label="Vissza a főoldalra">
        <Image src="/icon.png" alt="Icon" width={68} height={68} />
      </Link>
      <div className="border border-border p-8 w-[85%] sm:w-[350px] rounded-lg">
        <h1 className="mb-1 text-2xl font-bold text-center">Üdv újra itt!</h1>
        <p className="mb-3 text-sm text-center text-muted-foreground">
          Jelentkezz be a fiókodba
        </p>

        <LoginForm errorMessage={errorMessage} message={message} />

        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex justify-center my-4 text-xs uppercase">
            <span className="px-2 bg-background text-muted-foreground">
              Vagy
            </span>
          </div>
        </div>

        <AuthButtons />

        <p className="flex items-center justify-center gap-1 mt-4 text-sm text-center text-muted-foreground">
          Nincs még fiókod?
          <Link href="/signup" className="underline text-emerald" aria-label="Regisztrálj">
            Regisztrálj!
          </Link>
        </p>
      </div>
    </div>
  )
}
