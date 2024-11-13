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

type FieldErrors = {
  [key: string]: string;
}

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const router = useRouter()
  const { toast } = useToast()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setFieldErrors({}) // Reset errors on new submission

    const data = Object.fromEntries(formData.entries()) as z.infer<typeof signupSchema>

    const result = signupSchema.safeParse(data)

    if (!result.success) {
      const zodErrors = result.error.errors.reduce((acc: FieldErrors, curr) => {
        const field = curr.path[0]?.toString() || 'general'
        acc[field] = curr.message
        return acc
      }, {})
      setFieldErrors(zodErrors)
      setIsLoading(false)
      return
    }

    const res = await signup(data)

    if (!res.success) {
      if (res.message) {
        // Handle field-specific errors from the server
        setFieldErrors(res.message as FieldErrors)
        setIsLoading(false)
        return
      }
      // Handle general error
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
          className={`mb-2 ${fieldErrors.name ? 'border-red-500' : ''}`}
          type="text"
          name="name"
          id="name"
          placeholder="Felhasználónév"
          required
          disabled={isLoading}
        />
        {fieldErrors.name && (
          <p className="text-sm text-red-500 mt-1">{fieldErrors.name}</p>
        )}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          className={`mb-2 ${fieldErrors.email ? 'border-red-500' : ''}`}
          type="email"
          name="email"
          id="email"
          placeholder="Email cím"
          required
          disabled={isLoading}
        />
        {fieldErrors.email && (
          <p className="text-sm text-red-500 mt-1">{fieldErrors.email}</p>
        )}
      </div>
      <div>
        <Label htmlFor="password">Jelszó</Label>
        <Input
          className={`mb-2 ${fieldErrors.password ? 'border-red-500' : ''}`}
          type="password"
          name="password"
          id="password"
          placeholder="Jelszó"
          required
          disabled={isLoading}
        />
        {fieldErrors.password && (
          <p className="text-sm text-red-500 mt-1">{fieldErrors.password}</p>
        )}
      </div>
      <Button 
        className="w-full bg-emerald hover:bg-emerald-hover" 
        disabled={isLoading}
      >
        {isLoading ? "Regisztráció folyamatban..." : "Regisztráció"}
      </Button>
    </form>
  )
}