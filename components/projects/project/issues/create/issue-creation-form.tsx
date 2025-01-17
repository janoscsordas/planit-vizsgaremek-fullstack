"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar } from "@radix-ui/themes"
import { useState } from "react"
import TaskCombobox from "./task-combobox"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import IssueLabels from "./issue-labels"
import { issueCreationFormSchema } from "@/lib/schemas/issues"
import { toast } from "sonner"
import { createNewIssue } from "@/actions/issues.action"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false })

export default function IssueCreationForm({
  userId,
  userName,
  userImage,
  projectId,
  tasks,
}: {
  userId: string
  userName: string
  userImage: string
  projectId: string
  tasks: {
    id: string
    taskName: string
  }[]
}) {
  const router = useRouter()

  const [selectedTaskId, setSelectedTaskId] = useState("")
  const [titleState, setTitleState] = useState("")
  const [descriptionState, setDescriptionState] = useState("")
  const [selectedLabels, setSelectedLabels] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState({
    issueName: "",
    issueDescription: "",
    taskIssueId: "",
    labels: "",
  })

  const handleDescriptionChange = (value?: string) => {
    setDescriptionState(value ?? "")
  }

  // Sending issue to backend
  const handleIssueCreation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      setIsLoading(true)

      const validatedFields = issueCreationFormSchema.safeParse({
        issueName: titleState,
        issueDescription: descriptionState,
        taskIssueId: selectedTaskId,
        labels: selectedLabels,
      })

      if (!validatedFields.success) {
        setError({
          issueName: validatedFields.error.errors[0]?.message,
          issueDescription: validatedFields.error.errors[1]?.message,
          taskIssueId: validatedFields.error.errors[2]?.message,
          labels: validatedFields.error.errors[3]?.message,
        })
        return
      }

      const response = await createNewIssue(
        validatedFields.data,
        userId,
        projectId
      )

      if (!response.success) {
        throw new Error(response.message)
      }

      if (response.success) {
        router.push(`/projects/${projectId}/issues`)
        toast.success(response.message, {
          duration: 5000,
          position: "top-center",
        })
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Hiba történt a Probléma elkészítése közben!",
        { position: "top-center" }
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="flex items-start gap-6 lg:w-[90%] mx-auto">
      <div className="hidden sm:block">
        <Avatar
          radius="full"
          src={userImage}
          alt={userName}
          fallback={userName.charAt(0)}
        />
      </div>
      <form className="w-full mb-5" onSubmit={handleIssueCreation}>
        <div className="space-y-4">
          <Label htmlFor="title" className="text-[1rem] font-bold">
            Probléma címe
          </Label>
          <Input
            className="w-full mt-2"
            type="text"
            placeholder="Probléma címe"
            name="title"
            id="title"
            value={titleState}
            onChange={(e) => setTitleState(e.target.value)}
            disabled={isLoading}
            required
          />
          {error.issueName && (
            <span className="my-1 text-xs text-red-500">{error.issueName}</span>
          )}
          <div>
            <Label className="text-[1rem] font-bold mb-4">
              Probléma leírása
            </Label>
            <MDEditor
              value={descriptionState}
              onChange={handleDescriptionChange}
              textareaProps={{
                placeholder: "Probléma leírása ide",
              }}
            />
          </div>
          {error.issueDescription && (
            <span className="my-1 text-xs text-red-500">
              {error.issueDescription}
            </span>
          )}
          <div className="space-y-4">
            <Label className="text-[1rem] font-bold">Feladat</Label>
            <br />
            <span className="text-xs text-muted-foreground">
              Egy feladattal kapcsolatban lenne kérdésed? Jelöld ki a feladatot!
            </span>
            <div className="flex items-center gap-2">
              <TaskCombobox
                tasks={tasks}
                selectedTaskId={selectedTaskId}
                setSelectedTaskId={setSelectedTaskId}
                disabled={isLoading}
              />
              {selectedTaskId && (
                <Button
                  type="button"
                  variant="outline"
                  className="text-red-500"
                  onClick={() => setSelectedTaskId("")}
                >
                  <Trash2 className="w-4 h-4 sm:mr-2" />{" "}
                  <span className="hidden sm:block">Választás törlése</span>
                </Button>
              )}
            </div>
          </div>
          {error.taskIssueId && (
            <span className="my-1 text-xs text-red-500">
              {error.taskIssueId}
            </span>
          )}
          <div>
            <Label className="text-[1rem] font-bold">Címke hozzáadása</Label>
            <IssueLabels
              selectedLabels={selectedLabels}
              setSelectedLabels={setSelectedLabels}
              disabled={isLoading}
            />
          </div>
          {error.labels && (
            <span className="my-1 text-xs text-red-500">{error.labels}</span>
          )}
          <div>
            <Button className="bg-emerald hover:bg-emerald-hover" type="submit" aria-label="Probléma leírása">
              Probléma létrehozása
            </Button>
          </div>
        </div>
      </form>
    </section>
  )
}
