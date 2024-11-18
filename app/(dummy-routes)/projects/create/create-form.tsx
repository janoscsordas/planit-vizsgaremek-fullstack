"use client"

import { createProject, State } from "@/actions/projects.action"
import { useActionState } from "react"

export default function CreateForm() {
    const initialState: State = { message: null, errors: {} }
    const [state, formAction] = useActionState(createProject, initialState)

    return (
        <form action={formAction}>
            <input 
                type="text" 
                name="name" 
                placeholder="Projekt neve" 
                aria-describedby="name-errors"
            />
            <div id="name-errors" aria-live="polite" aria-atomic="true">
                {state.errors?.name && state.errors.name.map((error: string) => (
                    <p className="text-red-500 my-2 text-sm" key={error}>{error}</p>
                ))}
            </div>
            <button 
                type="submit"
                aria-describedby="submit-message"
            >
                Létrehozás
            </button>
        </form>
    )
}
