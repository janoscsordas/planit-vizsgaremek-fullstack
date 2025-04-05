"use client"

import React, { createContext, useState, useEffect } from "react"
import { supabase } from "@/lib/utils/supabase"
import { Notification } from "@/lib/definitions/notifications"
import { enrichNotifications } from "@/lib/utils/enrichNotifications"

interface NotificationContextType {
  notifications: Notification[]
}

// Context for notification data
export const NotificationsContext = createContext<
  NotificationContextType | undefined
>(undefined)

// Notifications Context Provider
export const NotificationsProvider = ({
  children,
  userId,
}: {
  children: React.ReactNode
  userId: string
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Setup realtime subscription
  useEffect(() => {
    // Get the initial data
    fetchNotifications()

    // Setup realtime subscription for new notifications
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `receiverId=eq.${userId}`,
        },
        async (payload) => {
          const newNotification = payload.new as Notification
          const enrichedNotification = await enrichNotifications([
           newNotification, 
          ])
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            enrichedNotification[0],
          ])
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "notifications" },
        async (payload) => {
          const deletedNotification = payload.old as Notification
          setNotifications((prevNotifications) =>
            prevNotifications.filter(
              (notification) => notification.id !== deletedNotification.id
            )
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchNotifications = async () => {
    const { data: rawNotifications, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("receiverId", userId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error(error)
    }

    if (rawNotifications) {
      const enrichedNotifications = await enrichNotifications(rawNotifications)
      setNotifications(enrichedNotifications)
    }
  }

  return (
    <NotificationsContext.Provider value={{ notifications }}>
      {children}
    </NotificationsContext.Provider>
  )
}
