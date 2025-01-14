"use client"

import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export default function DeleteAccountButton({
  disabled,
}: {
  disabled: boolean
}) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAccountDeletion = async () => {
    setIsLoading(true)
    setError(null)
    disabled = true

    try {
      const response = await fetch("/api/user", {
        method: "DELETE",
      })

      if (!response.ok) {
        setError("Fiók törlése sikertelen!")
        return
      }

      // Sign out the user after successful deletion
      await signOut({
        redirect: true,
        redirectTo: `/login?message=${encodeURIComponent(
          "Fiók sikeresen törölve!"
        )}`,
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("Fiók törlése sikertelen!")
    } finally {
      disabled = false
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="flex">
        {error && (
          <p className="absolute mt-2 text-center text-red-500 left-6">
            {error}
          </p>
        )}
        <div>
          <Button
            onClick={handleAccountDeletion}
            disabled={disabled || isLoading}
            className="text-white bg-red-500 hover:bg-red-600"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" />
                Fiók törlése folyamatban...
              </span>
            ) : (
              "Fiók törlése"
            )}
          </Button>
        </div>
      </div>
    </>
  )
}
