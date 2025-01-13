import { ProjectsTable } from "@/database/schema/projects";
import ProjectHeader from "../../header";
import { eq } from "drizzle-orm";
import { db } from "@/database";
import { notFound, redirect } from "next/navigation";
import IssueCreationForm from "@/components/projects/project/issues/create/issue-creation-form";
import { auth } from "@/auth";

export default async function Page({
    params,
}: {
    params: Promise<{ projectId: string }>
}) {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        return redirect("/login");
    }

    const { projectId } = await params

    const projectData = await db.query.ProjectsTable.findFirst({
        columns: {
            id: true,
            userId: true,
            name: true,
        },
        where: eq(ProjectsTable.id, projectId),
        with: {
            tasks: {
                columns: {
                    id: true,
                    taskName: true,
                }
            }
        }
    });
    
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
                        label: "Issues",
                        href: `/projects/${projectData.id}/issues`,
                    },
                    {
                        label: "Új probléma",
                        href: `/projects/${projectData.id}/issues/create`,
                        active: true,
                    }
                ]}
            />
            <main className="px-6 py-2">
                <div>
                    <IssueCreationForm 
                        userId={session.user.id} 
                        userName={session.user.name!} 
                        userImage={session.user.image || ""} 
                        tasks={projectData.tasks} 
                        projectId={projectData.id}
                    />
                </div>
            </main>
        </>
    )
}