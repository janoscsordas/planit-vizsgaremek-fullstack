import { Button } from "@/components/ui/button"
import { CircleCheck, CircleDot, MessagesSquare, PlusIcon } from "lucide-react"
import Link from "next/link"
import IssuesFilter from "./issues-filter"
import { Issue } from "@/lib/definitions/issues"
import { formatDistance } from "date-fns"
import IssuesSearch from "./issues-search"
import { hu } from "date-fns/locale/hu"
import { ISSUE_LABELS } from "@/lib/utils/globalVariables"
import IssuesPagination from "./issues-pagination"
import { memo } from "react"

const IssueRow = memo(
  ({ issue, projectId }: { issue: Issue; projectId: string }) => {
    return (
      <div
        key={issue.id}
        className="flex items-start justify-between p-4 border-b hover:bg-gray-100/50 dark:hover:bg-gray-800/50 border-b-muted"
      >
        <div className="flex items-start gap-2">
          {issue.isOpen ? (
            <CircleDot className="w-4 h-4 mt-1 stroke-emerald" />
          ) : (
            <CircleCheck className="w-4 h-4 mt-1 stroke-violet-700" />
          )}
          <div>
            <div className="flex items-center gap-2">
              <Link
                href={`/projects/${projectId}/issues/${issue.id}`}
                className="font-medium text-primary hover:text-emerald-hover"
              >
                {issue.issueName}
              </Link>
              {issue.labels && issue.labels.length > 0 && (
                <div className="flex items-center gap-1">
                  {issue.labels.map((label, index) => (
                    <div
                      key={index}
                      className={`
                                            px-2 rounded-full
                                            font-medium text-xs
                                            transition-colors duration-200
                                            ${ISSUE_LABELS.find((l) => l.name === label)?.color}
                                            ${ISSUE_LABELS.find((l) => l.name === label)?.textColor}
                                        `}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              #{issue.id} megnyitva{" "}
              {formatDistance(new Date(issue.openedAt), new Date(), {
                addSuffix: true,
                locale: hu,
              })}{" "}
              - {issue.openedByUser.name}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {issue.replies}{" "}
          <MessagesSquare className="w-3 h-3 stroke-muted-foreground" />
        </div>
      </div>
    )
  }
)

const TableHeader = memo(
  ({
    projectId,
    numberOfClosedIssues,
    numberOfOpenIssues,
  }: {
    projectId: string
    numberOfClosedIssues: number
    numberOfOpenIssues: number
  }) => {
    return (
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-muted-foreground">
        <div className="flex items-center justify-between w-full gap-2">
          <IssuesFilter
            numberOfClosedIssues={numberOfClosedIssues}
            numberOfOpenIssues={numberOfOpenIssues}
          />
          <Link href={`/projects/${projectId}/issues/create`}>
            <Button variant={"outline"} className="border-emerald text-emerald">
              <PlusIcon /> <span className="hidden sm:block">Új Probléma</span>
            </Button>
          </Link>
        </div>
      </div>
    )
  }
)

const IssuesPaginationMemoized = memo(
  ({
    paginationData,
    projectId,
  }: {
    paginationData: any
    projectId: string
  }) => {
    return (
      <IssuesPagination paginationData={paginationData} projectId={projectId} />
    )
  }
)

const IssuesSearchMemoized = memo(() => {
  return <IssuesSearch />
})

export default memo(function IssuesTable({
  projectId,
  countOfIssues,
  issues,
  pagination,
}: {
  projectId: string
  countOfIssues: {
    open: number
    closed: number
  }
  issues: Issue[]
  pagination: any
}) {
  return (
    <div className="w-full">
      <TableHeader
        projectId={projectId}
        numberOfClosedIssues={countOfIssues.closed}
        numberOfOpenIssues={countOfIssues.open}
      />
      <div className="space-y-[1px]">
        <IssuesSearchMemoized />
        {issues && issues.length > 0 ? (
          issues.map((issue) => (
            <IssueRow key={issue.id} issue={issue} projectId={projectId} />
          ))
        ) : (
          <div className="text-center text-muted-foreground text-md">
            Még nincs megnyitott probléma, vagy a szűrés nem adott vissza
            eredményt!
          </div>
        )}
      </div>
      <IssuesPaginationMemoized
        paginationData={pagination}
        projectId={projectId}
      />
    </div>
  )
})
