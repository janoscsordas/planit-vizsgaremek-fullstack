import { createProject } from "@/actions/projects.action"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import CreateForm from "./create-form"

export default async function CreateProjectPage() {
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

    return (
        <div>
            <h1>Projekt létrehozása</h1>
            <CreateForm />
        </div>
    )
}
