import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function GoogleLoginButton() {
    return (
        <form action={
            async () => {
                "use server"
                await signIn("google", {
                    redirect: true,
                    redirectTo: "/dashboard",
                })
            }
        } className="mt-2">
            <Button className="w-full" type="submit" variant="outline">
              <Image src="/google.svg" alt="Google" width={16} height={16} />
              Google
            </Button>
        </form>
    )
}