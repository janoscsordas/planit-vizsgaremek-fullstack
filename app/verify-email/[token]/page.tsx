import { verifyEmail } from "@/actions/user.action";
import { notFound, redirect } from "next/navigation";

interface Props {
  params: {
    token: string;
  };
}

export default async function VerifyEmailPage({ params }: Props) {
  const { token } = await params;

  if (!token) {
    return notFound()
  }

  const result = await verifyEmail(token);
  
  if (result.success) {
    redirect('/login?verified=true');
  } else {
    redirect('/login?verified=false');
  }
}