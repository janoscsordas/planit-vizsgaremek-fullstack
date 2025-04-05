"use client"

import {
  acceptInvitation,
  declineInvitation,
} from "@/actions/notifications.action"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { useNotifications } from "@/hooks/useNotifications"
import { formatDistance } from "date-fns"
import { hu } from "date-fns/locale/hu"
import { toast } from "sonner"

export default function Notifications() {
  const { notifications } = useNotifications()

  return (
    <>
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          receiverId={notification.receiverId}
          senderProjectId={notification.senderProjectId}
          notificationId={notification.id}
          senderName={notification.senderName}
          senderImage={notification.senderImage}
          projectName={notification.projectName}
          created_at={notification.created_at}
        />
      ))}
      {notifications.length === 0 && (
        <Card className="w-full p-4 transition-all ease-in border-2 hover:border-emerald-hover">
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-medium">Jelenleg egy meghívód sincs.</p>
          </div>
        </Card>
      )}
    </>
  )
}

function NotificationCard({
  notificationId,
  receiverId,
  senderProjectId,
  senderName,
  senderImage,
  projectName,
  created_at,
}: {
  notificationId: number
  receiverId: string
  senderProjectId: string
  senderName: string | undefined
  senderImage: string | undefined
  projectName: string | undefined
  created_at: Date
}) {
  return (
    <Card className="w-full p-4 transition-all ease-in border-2 hover:border-emerald-hover">
      <div className="flex flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={senderImage}
              alt={senderName}
              className="rounded-full"
            />
            <AvatarFallback>{senderName ? senderName.charAt(0).toUpperCase() : "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2 md:mt-0">
            <p className="text-sm font-medium">{senderName}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistance(created_at, new Date(), {
                locale: hu,
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Meghívott téged a(z) {projectName} nevű projektbe!
        </p>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <AcceptButton
            notificationId={notificationId}
            receiverId={receiverId}
            senderProjectId={senderProjectId}
          />
          <DeclineButton notificationId={notificationId} />
        </div>
      </div>
    </Card>
  )
}

function AcceptButton({
  notificationId,
  receiverId,
  senderProjectId,
}: {
  notificationId: number
  receiverId: string
  senderProjectId: string
}) {
  // Handling invitation accept
  const handleAccept = async () => {
    // Using acceptInvitation server action with the following parameters in order: notificationId, receiverId, senderProjectId
    const response = await acceptInvitation(
      notificationId,
      receiverId,
      senderProjectId
    )

    if (!response?.success) {
      toast.error("Hiba történt!", {
        description: response?.message,
        position: "top-center",
      })
      return
    }

    toast.success("Sikeres meghívó elfogadás!", {
      description: response?.message,
      position: "top-center",
    })
  }

  return (
    <Button
      className="w-full md:w-auto bg-emerald hover:bg-emerald-hover"
      onClick={handleAccept}
    >
      Elfogadás
    </Button>
  )
}

function DeclineButton({ notificationId }: { notificationId: number }) {
  // Handling invitation decline
  const handleDecline = async () => {
    const response = await declineInvitation(notificationId)

    if (!response?.success) {
      toast.error("Hiba történt!", {
        description: response?.message,
        position: "top-center",
      })
      return
    }

    toast.success("Sikeres elutasítás!", {
      description: response?.message,
      position: "top-center",
    })
  }

  return (
    <Button
      className="w-full bg-red-400 md:w-auto hover:bg-red-800"
      onClick={handleDecline}
    >
      Elutasítás
    </Button>
  )
}
