"use client"

import { createProject, State } from "@/actions/projects.action"
import { Input } from "@/components/ui/input"
import { Button } from "@radix-ui/themes"
import { useActionState } from "react"

export default function CreateForm() {
  const initialState: State = { message: null, errors: {} }
  const [state, formAction] = useActionState(createProject, initialState)

  return (
    <form action={formAction}>
      <div className="w-[90%] md:w-[80%] xl:w-2/5 mx-auto border-[1px] border-foreground/10 rounded-lg mt-8 dark:bg-foreground/10">
        <div className="border-b-[1px] border-foreground/10 pb-2 p-4">
          <h2 className="text-primary text-md font-bold pb-1">
            Projekt létrehozása
          </h2>
          <p className="text-muted-foreground text-sm">
            Projekt létrehozásához adj meg egy nevet és egy leírást.
          </p>
        </div>
        <div className="">
          <div className="flex items-center gap-2">
            <div className="flex flex-col w-full border-b-[1px] border-foreground/10 py-2">
              <div className="flex justify-between items-center gap-2">
                <p className="text-muted-foreground text-sm font-bold p-4">
                  Projekt neve
                </p>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Projekt neve"
                  aria-describedby="name-errors"
                  className="w-96 bg-muted-foreground/5 m-4 mt-0 mb-0"
                />
              </div>
              <div
                id="name-errors"
                aria-live="polite"
                aria-atomic="true"
                className="flex justify-end px-4 mb-2"
              >
                {state.errors?.name &&
                  state.errors.name.map((error: string) => (
                    <p className="text-red-500 my-2 text-sm" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
              <div id="messages" aria-live="polite" aria-atomic="true" className="flex justify-end px-4 mb-2">
                  {state.message && <p className="text-red-500 my-2 text-sm">{state.message}</p>}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center gap-2">
          <div className="flex justify-between items-center gap-2 w-full p-4">
            <p className="hidden sm:block text-muted-foreground text-sm">
              Később megváltoztathatod a projekt nevét
            </p>
            <Button
              type="submit"
              aria-describedby="submit-message"
              size="2"
              variant="outline"
              color="green"
              className="bg-[#00A36C] hover:bg-[#00A36C]/90 text-primary font-medium w-max cursor-pointer"
            >
              Létrehozás
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
