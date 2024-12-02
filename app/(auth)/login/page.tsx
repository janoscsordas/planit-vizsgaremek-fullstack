import LoginForm from "./login-form";
import Image from "next/image";
import Link from "next/link";
import AuthButtons from "@/components/auth/AuthButtons";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Login({ 
  searchParams 
}: { 
  searchParams: Promise<{ errorMessage?: string, message?: string }>
}) {
  const session = await auth();
  const { errorMessage, message } = await searchParams

  if (session?.user) {
    return redirect("/projects");
  }

  return (
    <div className="py-12 min-h-screen w-full flex flex-col gap-8 items-center justify-center">
      <Link href={"/"}>
        <Image src="/icon.png" alt="Icon" width={68} height={68} />
      </Link>
      <div className="border border-border p-8 w-[85%] sm:w-[350px] rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-1">Üdv újra itt!</h1>
        <p className="text-sm text-muted-foreground text-center mb-3">
          Jelentkezz be a fiókodba
        </p>

        <LoginForm errorMessage={errorMessage} message={message} />

        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase my-4">
            <span className="bg-background px-2 text-muted-foreground">
              Vagy
            </span>
          </div>
        </div>

        <AuthButtons />

        <p className="flex gap-1 justify-center items-center text-sm text-center mt-4 text-muted-foreground">
          Nincs még fiókod?
          <Link href="/signup" className="text-emerald underline">
            Regisztrálj!
          </Link>
        </p>
      </div>
    </div>
  );
}
