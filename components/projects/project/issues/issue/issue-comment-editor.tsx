"use client"

import { updateIssueDescription } from "@/actions/issues.action"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { issueCommentFormSchema } from "@/lib/schemas/issues"
import { Ellipsis, Loader2 } from "lucide-react"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false })

export default function IssueCommentEditor({
  issueId,
  issueDescription,
  projectId,
}: {
  issueId: number
  issueDescription: string
  projectId: string
}) {
  const [description, setDescription] = useState(issueDescription)
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  // Cleanup function to ensure proper scroll behavior
  useEffect(() => {
    if (!open) {
      // Small delay to ensure dialog transition is complete
      const timeout = setTimeout(() => {
        document.body.style.overflow = ""
        document.body.style.paddingRight = ""
      }, 100)

      return () => clearTimeout(timeout)
    }
  }, [open])

  const handleDescriptionChange = (value?: string) => {
    setDescription(value ?? "")
  }

  const handleIssueDescriptionChange = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    try {
      setIsLoading(true)

      const validatedFields = issueCommentFormSchema.safeParse({
        comment: description,
      })

      if (!validatedFields.success) {
        throw new Error(validatedFields.error.errors[0]?.message)
      }

      const response = await updateIssueDescription(
        issueId,
        validatedFields.data.comment,
        projectId
      )

      if (!response.success) {
        throw new Error(response.message)
      }

      toast.success(response.message, {
        duration: 5000,
        position: "top-center",
      })
      setOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Hiba történt!", {
        duration: 5000,
        position: "top-center",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) {
          // Reset scroll lock when dialog closes
          document.body.style.overflow = ""
          document.body.style.paddingRight = ""
        }
      }}
    >
      <DialogTrigger asChild>
        <button className="flex items-center justify-center">
          <Ellipsis className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] md:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Probléma leírás szerkesztése</DialogTitle>
          <DialogDescription>
            Itt tudod szerkeszteni a problémád kommentjét.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleIssueDescriptionChange}>
          <MDEditor
            value={description}
            onChange={handleDescriptionChange}
            textareaProps={{
              placeholder: "Probléma leírása...",
              disabled: isLoading,
            }}
          />
          <DialogFooter className="mt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-emerald hover:bg-emerald-hover"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Mentés"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
