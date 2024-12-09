"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { login } from "@/actions/user.action"
import { loginSchema } from "@/lib/schemas/userSchema"
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

export default function LoginForm({ errorMessage, message }: { errorMessage: string | undefined, message: string | undefined }) {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors | string>({})
  const router = useRouter()
  const [showMessage, setShowMessage] = useState(!!errorMessage)

  const { toast } = useToast()

  useEffect(() => {
    if (errorMessage || message) {
      setShowMessage(true)
      const timer = setTimeout(() => {
        setShowMessage(false)
      }, 5000) // 5 seconds

      return () => clearTimeout(timer)
    }
  }, [errorMessage, message])

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

    if (!res.success && res.message) {
      if (typeof res.message === 'object') {
        setFieldErrors(res.message)
        
        // Show the first error message in the toast
        const firstError = Object.values(res.message)[0]
        toast({
          title: "Sikertelen bejelentkezés",
          description: firstError,
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
      {showMessage && errorMessage && (
        <div className="fixed bottom-4 right-4 p-4 max-w-[350px] bg-red-800 text-red-50 rounded-lg shadow-md animate-in fade-in slide-in-from-top-4">
          {decodeURIComponent(errorMessage)}
        </div>
      )}
      {showMessage && message && (
        <div className="fixed bottom-4 right-4 p-4 max-w-[350px] bg-emerald-800 text-emerald-50 rounded-lg shadow-md animate-in fade-in slide-in-from-top-4">
          {decodeURIComponent(message)}
        </div>
      )}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          className={`mb-2 ${typeof fieldErrors === 'object' && fieldErrors.email ? 'border-red-500' : ''}`}
          type="email"
          name="email"
          id="email"
          placeholder="Email cím"
          required
          maxLength={40}
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