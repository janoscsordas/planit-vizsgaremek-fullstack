"use client"

import { modifyIssue, removeIssue } from "@/actions/issues.action"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CircleCheck, CircleDot, Loader2, Trash2Icon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export default function IssueModify({
    issueId,
    projectId,
    issueState
}: {
    issueId: number
    projectId: string
    issueState: boolean
}) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleIssueModify = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        try {
            setIsLoading(true)
            const response = await modifyIssue(issueId, projectId, !issueState)

            if (!response.success) {
                throw new Error(response.message)
            }

            toast.success(response.message, { duration: 5000, position: "top-center" })
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message, { duration: 5000, position: "top-center" })
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleIssueRemoval = async () => {
        setIsLoading(true)

        try {
            const response = await removeIssue(issueId, projectId)

            if (!response.success) {
                throw new Error(response.message)
            }

            if (response.success) {
                router.push(`/projects/${projectId}/issues`)
                toast.success(response.message, { duration: 5000, position: "top-center" })
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message, { duration: 5000, position: "top-center" })
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className="flex flex-col items-center justify-center w-full px-auto gap-2">
            <div className="border p-4 rounded-lg">
                <h3 className="text-xl font-semibold pb-6 text-center">Probléma Beállítások</h3>
                <div className="flex items-center justify-center gap-8">
                    <form
                        onSubmit={handleIssueModify}
                    >
                        <Button type="submit" disabled={isLoading} variant="outline">
                            {issueState ? (
                                <div className="flex items-center gap-2">
                                    <CircleCheck className="w-4 h-4 stroke-violet-700" />
                                    Lezárás
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <CircleDot className="w-4 h-4 stroke-emerald" />
                                    Újranyitás
                                </div>
                            )}
                        </Button>
                    </form>
                    <Separator orientation="vertical" />
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="w-fit px-4" variant="destructive" size={"icon"}>
                                <Trash2Icon className="h-4" /> Törlés
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Figyelem!</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Biztosan törölni szeretnéd az Problémát?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Mégse</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-red-500 hover:bg-red-600 text-white"
                                    onClick={handleIssueRemoval}
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "Törlés"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
            </div>
            </div>
        </section>
    )
}