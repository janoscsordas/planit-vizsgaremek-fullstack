"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { useActionState, useEffect, useState } from "react"
import { changeProjectStatus, StatusState } from "@/actions/projects.action"

interface FormState {
  disabled: boolean
}

export default function ChangeStatus({
  projectId,
  projectStatus,
}: {
  projectId: string
  projectStatus: string
}) {
  const initialState: StatusState = { message: null, errors: {} }
  const [state, formAction] = useActionState(changeProjectStatus, initialState)

  const [formState, setFormState] = useState<FormState>({
    disabled: true,
  })

  const [radioValue, setRadioValue] = useState(projectStatus)

  const handleRadioChange = (value: string) => {
    setRadioValue(value)
    setFormState({
      disabled: value === projectStatus,
    })
  }

  useEffect(() => {
    setFormState({
      disabled: radioValue === projectStatus,
    })
  }, [radioValue, projectStatus])

  return (
    <div className="p-6 mt-6 space-y-4 border rounded-md">
      <div className="space-y-2">
        <h1 className="text-sm font-medium">Státusz megváltoztatása</h1>
        <p className="my-1 mb-4 text-xs text-muted-foreground">
          Itt megváltoztathatod a projekt státuszát.
        </p>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <RadioGroup
              name="status"
              defaultValue={projectStatus}
              onValueChange={handleRadioChange}
              aria-label="Projekt státusz"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="active" id="r1" aria-label="Aktív" />
                <Label htmlFor="r1">Aktív</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="completed" id="r2" aria-label="Elvégzett" />
                <Label htmlFor="r2">Elvégzett</Label>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <RadioGroupItem value="archived" id="r3" disabled aria-label="Archivált" />
                <Label htmlFor="r3">Archivált</Label>
              </div>
            </RadioGroup>
            {state?.errors?.status &&
              state?.errors.status.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
          <Input type="hidden" name="projectId" value={projectId} />
          {state?.message && (
            <p
              className={`mt-2 text-sm ${
                state?.message.startsWith("Hiba")
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {state?.message}
            </p>
          )}
          <Button
            type="submit"
            className="w-max bg-emerald hover:bg-emerald-hover"
            disabled={formState.disabled}
          >
            Mentés
          </Button>
        </form>
      </div>
    </div>
  )
}
