"use client"

import React from "react"
import { useEffect, useState } from "react"
import { differenceInDays } from "date-fns"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { userChangeFormSchema } from "@/lib/schemas/userSchema"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface UserData {
  name: string
  nameChangedAt: Date | null
}

interface FormState {
  name: string
  isLoading: boolean
  error: string | null
  disabled: boolean
  submitDisabled: boolean
}

const COOLDOWN_DAYS = 90

const UserForm = ({ userData }: { userData: UserData }) => {
  const router = useRouter()
  const [formState, setFormState] = useState<FormState>({
    name: userData.name,
    isLoading: false,
    error: null,
    disabled: false,
    submitDisabled: false,
  })

  // Calculate remaining days for username change
  const getRemainingDays = (): number | null => {
    if (!userData.nameChangedAt) return null
    return (
      COOLDOWN_DAYS -
      differenceInDays(new Date(), new Date(userData.nameChangedAt))
    )
  }

  // Check if username change is allowed
  useEffect(() => {
    const remainingDays = getRemainingDays()
    if (userData.name === formState.name) {
      setFormState((prev) => ({ ...prev, submitDisabled: true }))
    } else {
      setFormState((prev) => ({ ...prev, submitDisabled: false }))
    }
    if (remainingDays && remainingDays > 0) {
      setFormState((prev) => ({ ...prev, disabled: true }))
    }
  }, [userData.nameChangedAt, formState.name])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setFormState((prev) => ({
      ...prev,
      name: value,
      error: null,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (formState.disabled || formState.isLoading) {
      return
    }

    try {
      setFormState((prev) => ({ ...prev, isLoading: true, error: null }))

      const validatedData = userChangeFormSchema.safeParse({
        name: formState.name.trim(),
      })

      if (!validatedData.success) {
        throw new Error(
          validatedData.error.errors[0]?.message ||
            "Érvénytelen felhasználónév!"
        )
      }

      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: validatedData.data.name }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Hiba történt a módosítás során!")
      }

      const data = await response.json()

      toast("Sikeres módosítás", {
        position: "top-center",
        duration: 3000,
        description: data.message || "A felhasználónév sikeresen módosítva!",
      })

      setTimeout(() => {
        router.refresh()
      }, 3000)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Váratlan hiba történt!"

      setFormState((prev) => ({ ...prev }))

      toast("Hiba történt!", {
        position: "top-center",
        duration: 3000,
        description: errorMessage,
      })
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  const remainingDays = getRemainingDays()

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 space-y-4 border rounded-md border-muted"
    >
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Felhasználónév módosítása</h4>

        <Input
          type="text"
          name="name"
          id="name"
          placeholder="Felhasználónév"
          value={formState.name}
          onChange={handleChange}
          disabled={formState.disabled || formState.isLoading}
          className="text-sm"
          aria-label="Felhasználónév"
        />

        {formState.disabled && remainingDays ? (
          <p className="text-xs text-red-500">
            {remainingDays} nap múlva módosíthatod újra a felhasználóneved!
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Módosíthatod a felhasználóneved. A következő módosításra{" "}
            {COOLDOWN_DAYS} nap múlva kerülhet sor!
          </p>
        )}
      </div>

      {formState.error && (
        <Alert variant="destructive">
          <AlertDescription>{formState.error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        className="w-max bg-emerald hover:bg-emerald-hover"
        disabled={
          formState.disabled || formState.isLoading || formState.submitDisabled
        }
      >
        {formState.isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Feldolgozás...
          </span>
        ) : (
          "Mentés"
        )}
      </Button>
    </form>
  )
}

export default UserForm
