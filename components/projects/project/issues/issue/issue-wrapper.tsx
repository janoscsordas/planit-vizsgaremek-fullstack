import { IssueWithItsSpecificData } from "@/lib/definitions/issues"
import IssueTitle from "./issue-title"
import IssueDescription from "./issue-description"
import { User } from "next-auth"
import IssueCommentForm from "./issue-comment-form"
import IssueReplies from "./issue-replies"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@radix-ui/themes"


export default function IssueWrapper({
    issueData,
    user,
}: {
    issueData: IssueWithItsSpecificData
    user: User
}) {

    return (
        <section className="w-full">
            <IssueTitle
                id={issueData.id}
                issueName={issueData.issueName}
                userName={issueData.openedByUser.name!}
                isOpen={issueData.isOpen}
                openedAt={issueData.openedAt}
                numberOfReplies={issueData.replies}
                projectId={issueData.projectId}
            />
            <IssueDescription
                issueData={
                    {
                        issueDescription: issueData.issueDescription,
                        userName: issueData.openedByUser.name!,
                        userImage: issueData.openedByUser.image ?? "",
                        projectId: issueData.projectId,
                        taskIssue: issueData.taskIssue,
                        openedAt: issueData.openedAt,
                    }
                }
            />
            <Suspense fallback={
                <section className="flex gap-3 mt-4 z-20">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <Skeleton className="w-full h-[350px] flex items-center justify-center">
                        <Spinner size={"3"} />
                    </Skeleton>
                </section>
            }>
                <IssueReplies issueId={issueData.id} />
            </Suspense>
            <hr className="my-4 border-2 border-foreground/30" />
            <IssueCommentForm issueId={issueData.id} user={user} projectId={issueData.projectId} />
        </section>
    )
}