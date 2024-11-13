import LoginForm from "./login-form";
import Image from "next/image";
import Link from "next/link";
import AuthButtons from "@/components/auth/AuthButtons";

export default async function Login({ params }: { params?: { verified: boolean } }) {
    return (
      <div className="min-h-screen w-full flex flex-col gap-8 justify-center items-center">
        <Link href={"/"}>
          <Image src="/icon.png" alt="Icon" width={68} height={68} />
        </Link>
        <div className="border border-border p-8 w-[350px] rounded-lg">
          <h1 className="text-2xl font-bold text-center mb-1">Üdv újra itt!</h1>
          <p className="text-sm text-muted-foreground text-center mb-3">
            Jelentkezz be a fiókodba
          </p>
          
          <LoginForm verified={params?.verified || false} />

          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase my-4">
              <span className="bg-card px-2 text-muted-foreground">
                Vagy
              </span>
            </div>
          </div>

          <AuthButtons />

          <p className="flex gap-1 justify-center items-center text-sm text-center mt-4 text-muted-foreground">
            Nincs még fiókod? 
            <Link href="/signup" className="text-emerald underline">Regisztrálj!</Link>
          </p>
        </div>
      </div>
    );
}