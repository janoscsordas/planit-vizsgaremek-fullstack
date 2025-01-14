"use client"

import { deleteIssueReply } from "@/actions/issues.action"
import { AlertDialogAction } from "@/components/ui/alert-dialog"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function IssueReplyDelete({
  issueId,
  issueReplyId,
  projectId,
}: {
  issueId: number
  issueReplyId: string
  projectId: string
}) {
  const [isLoading, setIsLoading] = useState(false)

  const handleIssueReplyRemoval = async () => {
    setIsLoading(true)

    try {
      const response = await deleteIssueReply(issueId, issueReplyId, projectId)

      if (!response.success) {
        throw new Error(response.message)
      }

      toast.success(response.message, {
        duration: 5000,
        position: "top-center",
      })
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
    <AlertDialogAction
      onClick={handleIssueReplyRemoval}
      className="text-white bg-red-500 hover:bg-red-600"
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Törlés"}
    </AlertDialogAction>
  )
}
