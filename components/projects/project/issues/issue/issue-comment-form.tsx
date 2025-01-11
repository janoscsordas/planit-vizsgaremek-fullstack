"use client"

import { createIssueComment } from "@/actions/issues.action"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { issueCommentFormSchema } from "@/lib/schemas/issues"
import { Avatar } from "@radix-ui/themes"
import { Loader2Icon } from "lucide-react"
import { User } from "next-auth"
import dynamic from "next/dynamic"
import { useState } from "react"
import { toast } from "sonner"

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor"),
    { ssr: false, loading: () => <Skeleton className="w-full h-[200px]" /> },
)

export default function IssueCommentForm({
    issueId,
    user,
    projectId,
    isIssueOpen
}: {
    issueId: number,
    user: User
    projectId: string
    isIssueOpen: boolean
}) {
    const [comment, setComment] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleCommentChange = (value?: string) => {
        setComment(value ?? '')
    }

    const handleCommentCreation = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        if (!isIssueOpen) {
            setIsLoading(false)
            return;
        }

        const validatedFields = issueCommentFormSchema.safeParse({
            comment: comment
        })

        try {
            if (!validatedFields.success) {
                throw new Error(validatedFields.error.errors[0]?.message)
            }
    
            if (!user.id || !issueId) {
                throw new Error("Hibás adatokat adott meg!")
            }

            const response = await createIssueComment(validatedFields.data.comment, issueId, user.id, projectId)

            if (!response.success) {
                throw new Error(response.message)
            }

            if (response.success) {
                setComment("")
                toast.success(response.message, { duration: 5000, position: "top-center" })
            }
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Hiba történt!", 
                { position: "top-center", duration: 8000 }
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className="flex gap-3 mt-6">
            <div>
                <Avatar radius="full" src={user.image || ""} alt={user.name || "felhasználó"} fallback={user.name?.charAt(0) || "F"} />
            </div>
            <div className="w-full">
                <h3 className="font-bold mb-2">Hozzászólás írása</h3>
                <form className="w-full pb-6" onSubmit={handleCommentCreation}>
                    <MDEditor 
                        value={comment} 
                        onChange={handleCommentChange} 
                        className="w-full max-w-none"
                        textareaProps={{
                            placeholder: !isIssueOpen ? "Issue lezárva! Nem lehet hozzászólni!" : "Ide írhatod a hozzászólásodat",
                            disabled: !isIssueOpen
                        }}
                    />
                    <Button 
                        className="bg-emerald hover:bg-emerald-hover ml-auto block mt-4"
                        type="submit"
                        disabled={isLoading || !isIssueOpen || !comment}
                    >
                        {isLoading ? <Loader2Icon className="animate-spin" /> : "Hozzászólás"}
                    </Button>
                </form>
            </div>
        </section>
    )
}