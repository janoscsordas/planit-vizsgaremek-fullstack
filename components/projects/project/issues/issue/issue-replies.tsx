import { db } from "@/database"
import { ProjectIssueRepliesTable } from "@/database/schema/projects"
import { Avatar } from "@radix-ui/themes"
import { formatDistance } from "date-fns"
import { hu } from "date-fns/locale/hu"
import { eq } from "drizzle-orm"
import MarkdownDescription from "./markdown-description"
import IssueButtons from "./issue-buttons"
import { auth } from "@/auth"

export default async function IssueReplies({
  projectId,
  issueId,
}: {
  projectId: string
  issueId: number
}) {
  const session = await auth()

  if (!session || !session.user) {
    return null
  }

  const issueReplies = await db.query.ProjectIssueRepliesTable.findMany({
    where: eq(ProjectIssueRepliesTable.issueId, issueId),
    columns: {
      id: true,
      reply: true,
      repliedAt: true,
    },
    with: {
      repliedByUser: {
        columns: {
          name: true,
          image: true,
          id: true,
          email: true,
        },
      },
    },
  })

  if (!issueReplies) {
    return null
  }

  return (
    <section className="w-full mt-3">
      {issueReplies.map((issueReply) => (
        <div key={issueReply.id} className="flex w-full gap-3 mt-9">
          <div className="w-max">
            <Avatar
              radius="full"
              src={issueReply.repliedByUser.image || ""}
              alt={issueReply.repliedByUser.name || "felhasználó"}
              fallback={issueReply.repliedByUser.name?.charAt(0) || "F"}
            />
          </div>
          <div className="w-full">
            <div className="flex items-center justify-between gap-2 px-6 py-2 border bg-muted rounded-tl-md rounded-tr-md border-foreground/30">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-primary">
                  {issueReply.repliedByUser.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  <span>kommentelte </span>
                  {formatDistance(new Date(issueReply.repliedAt), new Date(), {
                    addSuffix: true,
                    locale: hu,
                  })}
                </p>
              </div>
              <div>
                {/* Only the creator of the reply will be able to edit it */}
                {session.user.id === issueReply.repliedByUser.id && (
                  <IssueButtons
                    user={session.user}
                    issueReplyId={issueReply.id}
                    issueId={issueId}
                    projectId={projectId}
                    issueReply={issueReply.reply}
                  />
                )}
              </div>
            </div>
            <div className="w-full px-6 py-6 border border-t-0 border-foreground/30 rounded-bl-md rounded-br-md">
              <MarkdownDescription description={issueReply.reply} />
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}
