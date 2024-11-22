"use client"

import { Button } from "@/components/ui/button"
import { Spinner } from "@radix-ui/themes"
import { signOut } from "next-auth/react"
import { useState } from "react"

export default function DeleteAccountButton({ disabled }: { disabled: boolean }) {
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
                setError("Fiók törlése sikertelen")
                return
            }

            // Sign out the user after successful deletion
            await signOut({
                redirect: true,
                redirectTo: `/login?message=${encodeURIComponent("Fiók sikeresen törölve")}`,
            })
        } catch (error) {
            setError("Fiók törlése sikertelen")
        } finally {
            disabled = false
            setIsLoading(false)
        }
    }

    return (
        <div>
            <Button
                onClick={handleAccountDeletion}
                disabled={disabled || isLoading}
                className="bg-red-500 hover:bg-red-600 text-white"
            >
                {isLoading ? <Spinner /> : "Fiók törlése"}
            </Button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    )
}
