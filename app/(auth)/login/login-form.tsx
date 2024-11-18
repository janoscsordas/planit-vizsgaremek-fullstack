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
import { useFormStatus } from "react-dom"
import { Spinner } from "@radix-ui/themes"


type FieldErrors = {
  [key: string]: string;
}

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <Button 
      className="w-full bg-emerald hover:bg-emerald-hover" 
      disabled={pending}
    >
      {pending ? <Spinner /> : "Bejelentkezés"}
    </Button>
  )
}

export default function LoginForm() {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors | string>({})
  const router = useRouter()

  const { toast } = useToast()

  async function handleSubmit(formData: FormData) {
    setFieldErrors({}) // Reset errors on new submission

    const data = Object.fromEntries(formData.entries()) as z.infer<typeof loginSchema>

    // Add client-side validation
    const result = loginSchema.safeParse(data)

    if (!result.success) {
      const zodErrors = result.error.errors.reduce((acc: FieldErrors, curr) => {
        const field = curr.path[0]?.toString() || 'general'
        acc[field] = curr.message
        return acc
      }, {})
      setFieldErrors(zodErrors)
      return
    }

    const res = await login(data)

    if (!res.success) {
      if (res.message) {
        // Handle field-specific errors from the server
        setFieldErrors(res.message)
        
        // Handle general error
        toast({
          title: "Sikertelen bejelentkezés",
          description: res.message as string,
          duration: 5000,
          variant: "destructive",
        })
      }
      return
    }
    
    router.push("/projects")
  }

  return (
    <form action={async (formData: FormData) => await handleSubmit(formData)}>
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
          minLength={8}
          maxLength={32}
          required
        />
        {typeof fieldErrors === 'object' && fieldErrors.password && (
          <p className="text-sm text-red-500 mt-1">{fieldErrors.password}</p>
        )}
      </div>
      <SubmitButton />
    </form>
  );
}