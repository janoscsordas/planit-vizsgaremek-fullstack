import { verifyEmail } from "@/actions/user.action";
import { notFound, redirect } from "next/navigation";

export default async function VerifyEmailPage({
  params,
}: {
  params: { token: string };
}) {

    if (!params.token) {
        return notFound()
    }

    const result = await verifyEmail(params.token);
    
    if (result.success) {
        redirect('/login?verified=true');
    } else {
        redirect('/login?verified=false');
    }
}