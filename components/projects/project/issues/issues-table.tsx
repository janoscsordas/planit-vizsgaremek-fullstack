import { Button } from "@/components/ui/button"
import { CircleDot, MessagesSquare, PlusIcon } from "lucide-react"
import Link from "next/link"
import IssuesFilter from "./issues-filter"
import { Issue } from "@/lib/definitions/issues"
import { formatDate, formatDistance } from "date-fns"
import IssuesSearch from "./issues-search"
import { hu } from "date-fns/locale/hu"

export default function IssuesTable({
    projectId,
    countOfIssues,
    issues,
}: {
    projectId: string,
    countOfIssues: {
        open: number
        closed: number
    },
    issues: Issue[]
}) {

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4 border-b border-muted-foreground pb-4">
                <div className="flex items-center justify-between gap-2 w-full">
                    <IssuesFilter numberOfClosedIssues={countOfIssues.closed} numberOfOpenIssues={countOfIssues.open} />
                    <Link href={`/projects/${projectId}/issues/create`}>
                        <Button variant={"outline"} className="border-emerald text-emerald">
                            <PlusIcon /> Új issue
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="space-y-[1px]">
                <IssuesSearch />
                {issues && issues.length > 0 ? issues.map((issue) => (
                    <div
                        key={issue.id}
                        className="flex items-start justify-between p-4 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 border-b border-b-muted"
                    >
                        <div className="flex items-start gap-2">
                            <CircleDot className="w-4 h-4 mt-1 stroke-emerald" />
                            <div>
                                <Link href={`/projects/${projectId}/issues/${issue.id}`} className="font-medium text-primary hover:text-emerald-hover">{issue.issueName}</Link>
                                <div className="text-sm text-muted-foreground">
                                    #{issue.id} megnyitva {formatDistance(new Date(issue.openedAt), new Date(), { addSuffix: true, locale: hu })} - {issue.openedByUser.name}
                                </div>
                            </div>
                        </div>
                        {issue.replies && (
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                                {issue.replies} <MessagesSquare className="w-3 h-3" /> 
                            </div>
                        )}
                    </div>
                )) : (
                    <div className="text-center text-muted-foreground text-md">
                        Még nincs megnyitott issue, vagy a szűrés nem adott vissza eredményt.
                    </div>
                )}
            </div>
        </div>
    )
}