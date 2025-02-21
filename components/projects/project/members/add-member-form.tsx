"use client"

import React, { useState, KeyboardEvent } from "react"
import { Send, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { sendProjectInvites } from "@/actions/notifications.action"
import { validEmailSchema } from "@/lib/schemas/notificationSchema"
import { useRouter } from "next/navigation"

export default function MultiEmailInput({ projectId }: { projectId: string }) {
  const router = useRouter()
  const [emails, setEmails] = useState<string[]>([])
  const [inputValue, setInputValue] = useState("")

  const addEmail = async (email: string) => {
    const trimmedEmail = email.trim()
    if (
      validEmailSchema.safeParse({ email: trimmedEmail }).success &&
      !emails.includes(trimmedEmail)
    ) {
      setEmails([...emails, trimmedEmail])
      setInputValue("")
    }
  }

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter((email) => email !== emailToRemove))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addEmail(inputValue)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await addEmail(inputValue)

    console.log(emails)

    if (!emails.length) {
      toast.error("Nem adtál meg email címet!", {
        duration: 3000,
        position: "top-center",
      })
      setEmails([])
      return
    }

    const response = await sendProjectInvites(projectId, emails)

    if (!response.success) {
      toast.error("Hiba történt!", {
        description: response.message,
        duration: 3000,
        position: "top-center",
      })
      setEmails([])
      return
    }

    setEmails([])
    toast.success("Meghívók elküldve!", {
      duration: 3000,
      position: "top-center",
    })

    setTimeout(() => {
      router.refresh()
    }, 3000)
  }

  return (
    <form className="w-full" onSubmit={handleFormSubmit}>
      <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-background">
        {emails.map((email, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {email}
            <button
              onClick={() => removeEmail(email)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={`Remove ${email}`}
            >
              <X size={14} />
            </button>
          </Badge>
        ))}
        <div className="relative w-full">
          <Input
            id="email-input"
            type="email"
            placeholder="Írj be egy emailt, majd üss Entert..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className="flex-grow min-w-[200px] border-none focus:ring-0 focus:ring-offset-0 md:placeholder:text-base placeholder:text-xs"
          />
          <Button
            variant={"ghost"}
            className="absolute top-1/2 right-[1px] -translate-y-1/2"
            aria-label="Meghívó elküldése"
          >
            <Send size={16} className="text-muted-foreground" />
          </Button>
        </div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {emails.length} email cím megadva!
      </p>
    </form>
  )
}
