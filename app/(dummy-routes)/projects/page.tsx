import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import Projects from "./Projects";

export default async function ProjectsPage() {
    const session = await auth()

    // checking if the user is logged in
    if (!session?.user) {
        redirect("/login")
    }
    
    return (
        <>
            <h1>{session.user.name} projektjei</h1>
            <Link href="/projects/create">Projekt létrehozása</Link>
            
            <Projects userSession={session.user} />
        </>
    )
}
