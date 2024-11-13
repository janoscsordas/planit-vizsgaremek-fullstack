"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { login } from "@/actions/user.action"
import { loginSchema } from "@/schemas/userSchema"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"


export default function LoginForm({ verified }: { verified: boolean }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const { toast } = useToast()
  
  if (verified) {
    toast({
      title: "Email cím megerősítve",
      description: "Sikeres email cím hitelesítés!",
      duration: 5000,
      className: "bg-emerald text-white dark:text-black border-emerald-hover",
    })
  }

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)

    const data = Object.fromEntries(formData.entries()) as z.infer<typeof loginSchema>

    // Add client-side validation
    const result = loginSchema.safeParse(data)

    if (!result.success) {
      toast({
        title: "Sikertelen bejelentkezés",
        description: result.error.message,
        duration: 5000,
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    const res = await login(data)

    if (!res.success) {
      toast({
        title: "Sikertelen bejelentkezés",
        description: res.message,
        duration: 5000,
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    setIsLoading(false)
    router.push("/dashboard")
  }

  return (
    <form action={async (formData: FormData) => await handleSubmit(formData)}>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          className="mb-2"
          type="email"
          name="email"
          id="email"
          placeholder="Email cím"
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <Label htmlFor="password">Jelszó</Label>
        <Input
          className="mb-2"
          type="password"
          name="password"
          id="password"
          placeholder="Jelszó"
          required
          disabled={isLoading}
        />
      </div>
      <Button className="w-full bg-emerald hover:bg-emerald-hover" disabled={isLoading}>
        {isLoading ? "Bejelentkezés folyamatban..." : "Bejelentkezés"}
      </Button>
    </form>
  );
}