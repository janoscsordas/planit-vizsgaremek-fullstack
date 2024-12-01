"use client"

import { useNotifications } from "@/hooks/useNotifications";
import { IconButton } from "@radix-ui/themes";
import { Bell } from "lucide-react";
import Link from "next/link";

export default function NotificationBell() {
    const { notifications } = useNotifications();

    return (
        <IconButton
          variant="ghost"
          color="gray"
          className="cursor-pointer group hover:bg-emerald/15 relative"
        >
            {notifications.length > 0 && (
                <span 
                    className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full transform translate-x-1/2 -translate-y-1/2" 
                />
            )}
            <Link href="/notifications">
                <Bell width="18" height="18" className="text-muted-foreground" />
            </Link>
        </IconButton>
    )
}