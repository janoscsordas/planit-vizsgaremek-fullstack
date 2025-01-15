"use client"

import { useNotifications } from "@/hooks/useNotifications"
import { IconButton } from "@radix-ui/themes"
import { Bell } from "lucide-react"
import Link from "next/link"

export default function NotificationBell() {
  const { notifications } = useNotifications()

  return (
    <Link
      href="/notifications"
      className="flex items-center justify-center"
      aria-label="Értesítések"
    >
      <IconButton
        variant="ghost"
        color="gray"
        className="relative cursor-pointer group hover:bg-emerald/15"
        aria-label="Értesítések"
      >
        <Bell width="18" height="18" className="text-muted-foreground" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 text-xs text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {notifications.length > 9 ? "9+" : notifications.length}
          </span>
        )}
      </IconButton>
    </Link>
  )
}
