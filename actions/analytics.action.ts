"use server"

import { db } from "@/database"
import {
  ProjectMembersTable,
  ProjectTasksTable,
} from "@/database/schema/projects"
import { UsersTable } from "@/database/schema/user"
import { and, count, desc, eq, inArray } from "drizzle-orm"
import { RecentActivity } from "@/lib/definitions/analytics"

// The number of recent activities to fetch
const NUMBER_OF_RECENT_ACTIVITIES = 5

export async function fetchAnalyticsForProject(projectId: string) {
  try {
    const [
      [numberOfMembers],
      [numberOfPendingTasks],
      [numberOfInProgressTasks],
      [numberOfFinishedTasks],
    ] = await Promise.all([
      db
        .select({ value: count(ProjectMembersTable.id) })
        .from(ProjectMembersTable)
        .where(eq(ProjectMembersTable.projectId, projectId)),
      db
        .select({ value: count(ProjectTasksTable.id) })
        .from(ProjectTasksTable)
        .where(
          and(
            eq(ProjectTasksTable.projectId, projectId),
            eq(ProjectTasksTable.status, "pending")
          )
        ),
      db
        .select({ value: count(ProjectTasksTable.id) })
        .from(ProjectTasksTable)
        .where(
          and(
            eq(ProjectTasksTable.projectId, projectId),
            eq(ProjectTasksTable.status, "in progress")
          )
        ),
      db
        .select({ value: count(ProjectTasksTable.id) })
        .from(ProjectTasksTable)
        .where(
          and(
            eq(ProjectTasksTable.projectId, projectId),
            eq(ProjectTasksTable.status, "finished")
          )
        ),
    ])

    // +1 for the project owner in the number of members
    return [
      numberOfMembers.value + 1,
      numberOfPendingTasks.value,
      numberOfInProgressTasks.value,
      numberOfFinishedTasks.value,
    ]

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return [0, 0, 0, 0]
  }
}

export async function fetchRecentActivity(projectId: string) {
  try {
    const recentActivity = await db
      .select()
      .from(ProjectTasksTable)
      .where(eq(ProjectTasksTable.projectId, projectId))
      .orderBy(desc(ProjectTasksTable.createdAt))
      .limit(NUMBER_OF_RECENT_ACTIVITIES)

    // Get the IDs of the users who created the recent activities
    const userIds = recentActivity.map((activity) => activity.createdBy)

    // Get the names of the users
    const userDetails = await db
      .select({ name: UsersTable.name, id: UsersTable.id })
      .from(UsersTable)
      .where(inArray(UsersTable.id, userIds))

    // Add the specific user details to the recent activities
    const recentActivityWithUser = recentActivity.map((activity) => {
      const user = userDetails.find((user) => user.id === activity.createdBy)
      return { ...activity, user }
    })

    return recentActivityWithUser as RecentActivity[]
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return []
  }
}
