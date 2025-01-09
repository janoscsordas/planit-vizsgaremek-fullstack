import { IssueWithItsSpecificData } from "@/lib/definitions/issues"
import IssueTitle from "./issue-title"
import IssueDescription from "./issue-description"


export default function IssueWrapper({
    issueData,
}: {
    issueData: IssueWithItsSpecificData
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
            <hr className="my-4 border-2 border-foreground/30" />
        </section>
    )
}