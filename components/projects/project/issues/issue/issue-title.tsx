import { Button } from "@/components/ui/button"
import { formatDistance } from "date-fns"
import { hu } from "date-fns/locale/hu"
import { Check, CircleDot, PlusIcon } from "lucide-react"
import Link from "next/link"

export default function IssueTitle({
  id,
  issueName,
  userName,
  isOpen,
  openedAt,
  numberOfReplies,
  projectId,
}: {
  id: number
  issueName: string
  userName: string
  isOpen: boolean
  openedAt: Date
  numberOfReplies: number
  projectId: string
}) {
  return (
    <div className="pb-6 border-b border-b-muted">
      <div className="flex items-end justify-between gap-4 mb-4">
        <div className="flex items-end gap-2">
          <h1 className="text-2xl md:text-3xl lg:text-4xl">{issueName}</h1>
          <span className="ml-2 text-xl font-light md:text-2xl text-muted-foreground">
            #{id}
          </span>
        </div>
        <div>
          <Link href={`/projects/${projectId}/issues/create`}>
            <Button
              variant={"outline"}
              className="border-emerald text-emerald"
              size={"sm"}
            >
              <PlusIcon className="block w-4 h-4 sm:hidden" />
              <span className="hidden sm:block">Új Probléma</span>
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isOpen ? (
          <span className="flex items-center gap-2 px-2 py-1 text-sm rounded-full text-primary bg-emerald-hover">
            <CircleDot className="w-4 h-4" /> Nyitva
          </span>
        ) : (
          <span className="flex items-center gap-2 px-2 py-1 text-sm rounded-full text-primary bg-violet-700">
            <Check className="w-4 h-4" /> Lezárt
          </span>
        )}
        <p className="text-sm text-muted-foreground">
          <span className="font-bold">{userName} </span>
          <span>nyitotta meg </span>
          {openedAt &&
            `${formatDistance(openedAt, new Date(), {
              addSuffix: true,
              locale: hu,
            })}`}
          <span className="hidden sm:inline">
            {" "}
            - {numberOfReplies} hozzászólás
          </span>
        </p>
      </div>
    </div>
  )
}
