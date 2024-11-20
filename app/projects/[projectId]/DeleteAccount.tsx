"use client"

import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { useState } from "react"

export default function DeleteAccount() {
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleAccountDeletion = async () => {
        setError(null)

        if (!confirm("Biztosan törlöd a fiókod?")) {
            return
        }

        setIsDeleting(true)

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
            setIsDeleting(false)
        }
    }

    return (
        <div>
            <Button 
                onClick={handleAccountDeletion} 
                disabled={isDeleting}
                className="bg-red-500 hover:bg-red-600 text-white"
            >
                {isDeleting ? "Fiók törlése folyamatban..." : "Fiók törlése"}
            </Button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    )
}
