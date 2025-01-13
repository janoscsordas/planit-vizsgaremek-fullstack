import { auth } from "@/auth";
import { db } from "@/database";
import { ProjectIssuesTable, ProjectsTable } from "@/database/schema/projects";
import { and, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import ProjectHeader from "../../header";
import IssueWrapper from "@/components/projects/project/issues/issue/issue-wrapper";


export default async function Page({
    params,
}: {
    params: Promise<{ projectId: string, issueId: string }>
}) {
    const session = await auth();

    if (!session || !session.user) {
        return redirect("/login");
    }

    const { issueId, projectId } = await params;
    const issueIdAsNumber = Number(issueId);

    if (isNaN(issueIdAsNumber) || !projectId) {
        return notFound()
    }

    const project = await db.query.ProjectsTable.findFirst({
        where: eq(ProjectsTable.id, projectId),
        columns: {
            id: true
        }
    });
    
    if (!project) {
        return notFound();
    }

    const issueData = await db.query.ProjectIssuesTable.findFirst({
        where: and(
            eq(ProjectIssuesTable.id, issueIdAsNumber),
            eq(ProjectIssuesTable.projectId, projectId)
        ),
        with: {
            openedByUser: {
                columns: {
                    id: true,
                    name: true,
                    image: true
                }
            },
            taskIssue: {
                columns: {
                    taskName: true,
                    taskDescription: true,
                    status: true,
                    priority: true,
                    createdAt: true
                }
            },
            allReplies: {
                columns: {
                    id: true,
                    issueId: true,
                    reply: true,
                    repliedBy: true,
                    repliedAt: true,
                },
                with: {
                    repliedByUser: {
                        columns: {
                            name: true,
                            image: true
                        }
                    }
                }
            },
            project: {
                columns: {
                    id: true,
                    name: true
                }
            }
        }
    });
    
    if (!issueData) {
        return notFound();
    }

    return (
        <>
            <ProjectHeader
                breadCrumb={[
                    {
                        label: issueData.project.name,
                        href: `/projects/${issueData.project.id}`,
                    },
                    {
                        label: "Problémák",
                        href: `/projects/${issueData.project.id}/issues`,
                    },
                    {
                        label: issueData.issueName.slice(0, 20) + (issueData.issueName.length > 20 ? "..." : ""),
                        href: `/projects/${issueData.project.id}/issues/${issueData.id}`,
                        active: true
                    },
                ]}
            />
            <main className="px-6 py-2">
                <IssueWrapper issueData={issueData} user={session.user} />
            </main>
        </>
    )
}