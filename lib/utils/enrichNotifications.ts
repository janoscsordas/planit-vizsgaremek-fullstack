import { Notification } from "@/lib/definitions/notifications"

export const enrichNotifications = async (rawNotifications: Notification[]) => {
    if (rawNotifications.length === 0) {
      return []
    }

    // Extract unique sender and project IDs
    const uniqueSenderIds = [
      ...new Set(rawNotifications.map((notification) => notification.senderId)),
    ]
    const uniqueProjectIds = [
      ...new Set(
        rawNotifications.map((notification) => notification.senderProjectId)
      ),
    ]

    try {
      // Fetch sender and project details
      const [senderResponse, projectResponse] = await Promise.all([
        fetch("/api/user/details", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userIds: uniqueSenderIds }),
        }),
        fetch("/api/projects/details", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ projectIds: uniqueProjectIds }),
        }),
      ])

      const senderDetails = await senderResponse.json()
      const projectDetails = await projectResponse.json()

      // Merge sender and project details with notifications
      const enrichedNotifications = rawNotifications.map((notification) => {
        return {
          ...notification,
          senderName: senderDetails[notification.senderId]?.name,
          senderImage: senderDetails[notification.senderId]?.image,
          projectName: projectDetails[notification.senderProjectId]?.name,
        }
      })

      return enrichedNotifications as Notification[]
    } catch (error) {
      console.error("Error enriching notifications:", error)
      return rawNotifications
    }
}