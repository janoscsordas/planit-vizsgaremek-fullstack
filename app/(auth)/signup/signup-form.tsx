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
import { useFormStatus } from 'react-dom'

type FieldErrors = {
  [key: string]: string;
}

// Create a submit button component to handle loading state
function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <Button 
      className="w-full bg-emerald hover:bg-emerald-hover" 
      disabled={pending}
    >
      {pending ? "Regisztráció folyamatban..." : "Regisztráció"}
    </Button>
  )
}

export default function SignUpForm() {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors | string>({})
  const router = useRouter()
  const { toast } = useToast()

  async function handleSubmit(formData: FormData) {
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
      return
    }

    const res = await signup(data)

    if (!res.success) {
      if (res.message) {
        // Handle field-specific errors from the server
        setFieldErrors(res.message)
        
        // Handle general error
        toast({
          title: "Sikertelen regisztráció",
          description: res.message as string,
          duration: 5000,
          variant: "destructive",
        })
      }
      return
    }

    toast({
      title: "Sikeres regisztráció",
      description: "3 másodpercen belül átirányítunk a bejelentkezési oldalra. Kérjük, ellenőrizze email címét.",
      duration: 3000,
      className: "bg-emerald text-white dark:text-black border-emerald-hover",
    })

    setTimeout(() => {
      router.push("/login")
    }, 3000)
  }

  return (
    <form action={handleSubmit}>
      <div>
        <Label htmlFor="name">Felhasználónév</Label>
        <Input
          className={`mb-2 ${typeof fieldErrors === 'object' && fieldErrors.name ? 'border-red-500' : ''}`}
          type="text"
          name="name"
          id="name"
          placeholder="Felhasználónév"
          required
        />
        {typeof fieldErrors === 'object' && fieldErrors.name && (
          <p className="text-sm text-red-500 mt-1">{fieldErrors.name}</p>
        )}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          className={`mb-2 ${typeof fieldErrors === 'object' && fieldErrors.email ? 'border-red-500' : ''}`}
          type="email"
          name="email"
          id="email"
          placeholder="Email cím"
          required
        />
        {typeof fieldErrors === 'object' && fieldErrors.email && (
          <p className="text-sm text-red-500 mt-1">{fieldErrors.email}</p>
        )}
      </div>
      <div>
        <Label htmlFor="password">Jelszó</Label>
        <Input
          className={`mb-2 ${typeof fieldErrors === 'object' && fieldErrors.password ? 'border-red-500' : ''}`}
          type="password"
          name="password"
          id="password"
          placeholder="Jelszó"
          required
        />
        {typeof fieldErrors === 'object' && fieldErrors.password && (
          <p className="text-sm text-red-500 mt-1">{fieldErrors.password}</p>
        )}
      </div>
      <SubmitButton />
    </form>
  )
}