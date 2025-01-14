import { IssueDescriptionTypeForComponent } from "@/lib/definitions/issues"
import { Avatar, Badge } from "@radix-ui/themes"
import { formatDistance } from "date-fns"
import { hu } from "date-fns/locale/hu"
import MarkdownDescription from "./markdown-description"
import { Circle } from "lucide-react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { auth } from "@/auth"
import IssueCommentEditor from "./issue-comment-editor"

export default async function IssueDescription({
    issueData
}: {
    issueData: IssueDescriptionTypeForComponent
}) {
    const session = await auth()

    if (!session || !session.user) {
        return null
    }

    return (
        <section className="flex gap-3 w-full mt-9">
            <div className="w-max hidden sm:block">
                <Avatar radius="full" src={issueData.userImage || ""} alt={issueData.userName || ""} fallback={issueData.userName?.charAt(0) || ""} />
            </div>
            <div className="w-full">
                <div className="px-6 py-2 bg-muted rounded-tl-md rounded-tr-md border border-foreground/30 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <p className="text-primary text-xs font-bold">{issueData.userName}</p>
                        <p className="text-muted-foreground text-xs">
                            <span className="hidden sm:inline">kommentelte </span>
                            {formatDistance(
                                new Date(issueData.openedAt), 
                                new Date(), 
                                { addSuffix: true, locale: hu })}
                        </p>
                    </div>
                    <div>
                        {
                            session.user.id === issueData.userId && (
                                <IssueCommentEditor 
                                    issueId={issueData.id} 
                                    issueDescription={issueData.issueDescription} 
                                    projectId={issueData.projectId}
                                />
                            )
                        }
                    </div>
                </div>
                <div 
                    className="w-full px-6 py-6 border border-foreground/30 border-t-0 rounded-bl-md rounded-br-md"
                >
                    <MarkdownDescription description={issueData.issueDescription} />
                    <div>
                        {issueData.taskIssue && (
                            <div className="mt-4 border-t border-foreground/30 pt-4">
                                <p className="text-primary text-xs sm:text-[1rem] font-bold">Ezzel a feladattal kapcsolatban kérdezett:</p>
                                <div className="flex gap-2 items-center mt-2">
                                    <Circle className="stroke-emerald fill-emerald w-4 h-4" />
                                    <HoverCard>
                                        <HoverCardTrigger>
                                            <p className="text-muted-foreground text-[.6rem] sm:text-xs hover:underline">
                                                {issueData.taskIssue.taskName}
                                            </p>
                                        </HoverCardTrigger>
                                        <HoverCardContent>
                                            <div>
                                                <p className="text-muted-foreground text-sm">
                                                    <span className="text-primary font-bold">Feladat leírása: </span>
                                                        <br />
                                                    {issueData.taskIssue.taskDescription}
                                                </p>
                                                <Badge className="mt-4 mb-2" color={issueData.taskIssue.status === "pending" ? "amber" : issueData.taskIssue.status === "in progress" ? "violet" : "green"}>
                                                    {
                                                        issueData.taskIssue.status === "pending" ? 
                                                            "Elvégzendő" : 
                                                            issueData.taskIssue.status === "in progress" ? 
                                                            "Folyamatban" : 
                                                            "Befejezett"
                                                    }
                                                </Badge>
                                                <br />
                                                <Badge className="mb-2" color={issueData.taskIssue.priority === "high" ? "red" : issueData.taskIssue.priority === "medium" ? "yellow" : "green"}>
                                                    {issueData.taskIssue.priority === "high" ? 
                                                        "Magas" : issueData.taskIssue.priority === "medium" ? 
                                                        "Közepes" : "Alacsony"}
                                                </Badge>
                                                <p className="text-muted-foreground text-xs">
                                                    <span className="text-primary font-bold">Készült: </span>
                                                    {formatDistance(
                                                        new Date(issueData.taskIssue.createdAt), 
                                                        new Date(), 
                                                        { addSuffix: true, locale: hu })}
                                                </p>
                                            </div>
                                        </HoverCardContent>
                                    </HoverCard>
                                </div>
                                
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}