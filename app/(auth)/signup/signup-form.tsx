"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signup } from "@/actions/user.action"
import { signupSchema } from "@/schemas/userSchema"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"


export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const { toast } = useToast()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)

    const data = Object.fromEntries(formData.entries()) as z.infer<typeof signupSchema>

    const result = signupSchema.safeParse(data)

    if (!result.success) {
      toast({
        title: "Sikertelen regisztráció",
        description: result.error.message,
        duration: 5000,
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    const res = await signup(data)

    if (!res.success) {
      toast({
        title: "Sikertelen regisztráció",
        description: res.message,
        duration: 5000,
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    setIsLoading(false)
    toast({
      title: "Sikeres regisztráció",
      description: "5 másodpercen belül átirányítunk a bejelentkezési oldalra. Kérjük, ellenőrizze email címét.",
      duration: 5000,
      className: "bg-emerald text-white dark:text-black border-emerald-hover",
    })

    setTimeout(() => {
      router.push("/login")
    }, 5000)
  }

  return (
    <form action={async (formData: FormData) => await handleSubmit(formData)}>
        <div>
        <Label htmlFor="name">Felhasználónév</Label>
        <Input
          className="mb-2"
          type="text"
          name="name"
          id="name"
          placeholder="Felhasználónév"
          required
          disabled={isLoading}
        />
      </div>
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
        {isLoading ? "Regisztráció folyamatban..." : "Regisztráció"}
      </Button>
    </form>
  );
}