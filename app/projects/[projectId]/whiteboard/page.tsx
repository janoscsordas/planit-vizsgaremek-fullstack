import { ProjectsTable } from "@/database/schema/projects"
import ProjectHeader from "../header"
import { eq } from "drizzle-orm"
import { db } from "@/database"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/auth"
import WhiteBoardWrapper from "./white-board-wrapper"

export default async function WhiteboardPage({
    params,
}: {
    params: Promise<{ projectId: string }>
}) {
    const session = await auth()

    if (!session || !session.user) {
        return redirect("/login")
    }

    const { projectId } = await params

    const projectData = await db.query.ProjectsTable.findFirst({
        where: eq(ProjectsTable.id, projectId),
    })

    if (!projectData) {
        return notFound()
    }

    return (
        <>
            <ProjectHeader
                breadCrumb={[
                    {
                        label: projectData.name,
                        href: `/projects/${projectData.id}`,
                    },
                    {
                        label: "Whiteboard",
                        href: `/projects/${projectData.id}/whiteboard`,
                        active: true,
                    },
                ]}
            />
            <section className="px-6 py-2">
                <h1 className="text-2xl font-bold">Whiteboard</h1>
                <WhiteBoardWrapper userId={session.user.id} />
            </section>
        </>
    )
}