import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function GithubLoginButton() {
    return (
        <form action={
            async () => {
                "use server"
                await signIn("github", {
                    redirect: true,
                    redirectTo: "/dashboard",
                })
            }
        } className="mt-2">
            <Button className="w-full" type="submit" variant="outline">
              <Image src="/github.svg" alt="Github" width={16} height={16} />
              Github
            </Button>
        </form>
    )
}