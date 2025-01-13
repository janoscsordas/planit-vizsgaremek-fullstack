import { ProjectIssuesTable, ProjectsTable } from "@/database/schema/projects";
import { and, eq, like } from "drizzle-orm";
import ProjectHeader from "../header";
import { db } from "@/database";
import { notFound, redirect } from "next/navigation";
import IssuesTable from "@/components/projects/project/issues/issues-table";
import { auth } from "@/auth";


export default async function Page({
    params,
    searchParams
}: {
    params: Promise<{ projectId: string }>
    searchParams: Promise<{ q?: string; status?: string }>
}) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return redirect("/login");
  }

  const { projectId } = await params;
  const { q, status } = await searchParams;

  const searchQuery = q || "";
  const statusFilter = status === null ? null : status === "open" ? true : status === "closed" ? false : null;

  // Fetch project details + total counts for open and closed issues
  const projectDataWithCounts = await db.query.ProjectsTable.findFirst({
    columns: {
      id: true,
      userId: true,
      name: true,
    },
    where: eq(ProjectsTable.id, projectId),
    with: {
      issues: {
        columns: {
          isOpen: true,
        },
      },
    },
  });

  if (!projectDataWithCounts) {
    return notFound();
  }

  const totalCountOfIssues = {
    open: projectDataWithCounts.issues.filter((issue) => issue.isOpen).length,
    closed: projectDataWithCounts.issues.filter((issue) => !issue.isOpen).length,
  };

  // Build dynamic where condition for issues
  const issueConditions = [
    eq(ProjectIssuesTable.projectId, projectId), // Ensure issues belong to the project
    ...(status !== null && statusFilter !== null ? [eq(ProjectIssuesTable.isOpen, statusFilter)] : []), // Filter by status
    ...(searchQuery
      ? [
          like(ProjectIssuesTable.issueName, `%${searchQuery}%`),
        ]
      : []),
  ];

  // Fetch issues for the project
  const issues = await db.query.ProjectIssuesTable.findMany({
    columns: {
      id: true,
      projectId: true,
      issueName: true,
      issueDescription: true,
      taskIssueId: true,
      isOpen: true,
      replies: true,
      labels: true,
      openedAt: true,
    },
    where: and(...issueConditions),
    with: {
      openedByUser: {
        columns: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: (ProjectIssuesTable, { desc }) => desc(ProjectIssuesTable.openedAt)
  });

  return (
      <>
        <ProjectHeader
          breadCrumb={[
            {
              label: projectDataWithCounts.name,
              href: `/projects/${projectDataWithCounts.id}`,
            },
            {
              label: "Problémák",
              href: `/projects/${projectDataWithCounts.id}/issues`,
              active: true,
            },
          ]}
        />
        <main className="px-6 py-2">
          <div>
            <IssuesTable issues={issues} projectId={projectDataWithCounts.id} countOfIssues={totalCountOfIssues} />
          </div>
        </main>
      </>
  )
}