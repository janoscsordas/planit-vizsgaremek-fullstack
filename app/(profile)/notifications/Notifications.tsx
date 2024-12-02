"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistance } from "date-fns";
import { hu } from "date-fns/locale/hu";

export default function Notifications() {
    const { notifications } = useNotifications()

    return (
        <>
            {notifications.map((notification) => (
                <NotificationCard 
                    key={notification.id}
                    senderName={notification.senderName} 
                    senderImage={notification.senderImage}
                    projectName={notification.projectName}
                    createdAt={notification.createdAt} 
                />
            ))}
            {notifications.length === 0 && (
                <Card className="p-4 hover:border-emerald-hover transition-all ease-in border-2 w-full">
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-sm font-medium">
                            Jelenleg egy meghívód sincs.
                        </p>
                    </div>
                </Card>
            )}
        </>
    )
} 

function NotificationCard({ 
	senderName, 
	senderImage,
	projectName,
	createdAt,
}: {
	senderName?: string,
	senderImage?: string,
	projectName?: string,
	createdAt: Date
}) {
    if (!senderName || !senderImage || !projectName) {
        return null
    }

	return (
		<Card className="p-4 hover:border-emerald-hover transition-all ease-in border-2 w-full">
			<div className="flex flex-col lg:flex-row items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					<Avatar>
						<AvatarImage src={senderImage} />
						<AvatarFallback>{senderName.charAt(0)}</AvatarFallback>
					</Avatar>
					<div className="flex flex-col gap-2 md:mt-0">
						<p className="text-sm font-medium">
							{senderName}
						</p>
						<p className="text-xs text-muted-foreground">
							{formatDistance(createdAt, new Date(), { locale: hu, addSuffix: true })}
						</p>
					</div>
					<p>
						<span className="text-xs text-muted-foreground">
							Meghívott téged a {projectName} nevű projektbe.
						</span>
					</p>
				</div>
				<div className="flex items-center gap-2 mt-4 md:mt-0">
					<Button className="w-full md:w-auto bg-emerald hover:bg-emerald-hover">
						Elfogadás
					</Button>
					<Button className="w-full md:w-auto bg-red-400 hover:bg-red-800">
						Elutasítás
					</Button>
				</div>
			</div>
		</Card>
	)
}