import { ProjectIssuesTable, ProjectsTable } from "@/database/schema/projects";
import { and, eq, like, sql } from "drizzle-orm";
import ProjectHeader from "../header";
import { db } from "@/database";
import { notFound, redirect } from "next/navigation";
import IssuesTable from "@/components/projects/project/issues/issues-table";
import { auth } from "@/auth";
import PaginationControls from "@/components/projects/project/issues/pagination-controls";
import IssuesPagination from "@/components/projects/project/issues/issues-pagination";

type PaginationParams = {
  page?: number;
  limit?: number;
};

async function getPaginatedIssues(
  issueConditions: any[], 
  { page = 1, limit = 10 }: PaginationParams = {}
) {
  // Calculating offset
  const offset = (page - 1) * limit;

  // Get the total count for pagination
  const totalCountResult = await db.select({
    count: sql<number>`count(*)`.mapWith(Number),
  })
  .from(ProjectIssuesTable)
  .where(and(...issueConditions));

  const totalCount = totalCountResult[0].count;
  const totalPages = Math.ceil(totalCount / limit);

  // Get paginated issues
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
    orderBy: (ProjectIssuesTable, { desc }) => desc(ProjectIssuesTable.openedAt),
    limit: limit,
    offset: offset,
  });

  return {
    issues,
    pagination: {
      total: totalCount,
      totalPages,
      currentPage: page,
      limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    }
  };
}


export default async function Page({
    params,
    searchParams
}: {
    params: Promise<{ projectId: string }>
    searchParams: Promise<{ q?: string; status?: string, page?: string }>
}) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return redirect("/login");
  }

  const { projectId } = await params;
  const { q, status, page } = await searchParams;

  const parsedPage = parseInt(page || "1");

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

  const { issues, pagination } = await getPaginatedIssues(issueConditions, {
    page: parsedPage,
    limit: 10,
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
            <IssuesTable issues={issues} projectId={projectDataWithCounts.id} countOfIssues={totalCountOfIssues} pagination={pagination} />
          </div>
        </main>
      </>
  )
}