import { db } from "@/database";
import { ProjectMembersTable, ProjectTasksTable } from "@/database/schema/projects";
import { UsersTable } from "@/database/schema/user";
import { and, count, desc, eq, inArray } from "drizzle-orm";

export async function fetchAnalyticsForProject(projectId: string) {
    try {
        const [[numberOfMembers], [numberOfPendingTasks], [numberOfInProgressTasks], [numberOfFinishedTasks]] = await Promise.all([
            db.select({value: count(ProjectMembersTable.id)}).from(ProjectMembersTable).where(eq(ProjectMembersTable.projectId, projectId)),
            db.select({value: count(ProjectTasksTable.id)}).from(ProjectTasksTable).where(and(eq(ProjectTasksTable.projectId, projectId), eq(ProjectTasksTable.status, 'pending'))),
            db.select({value: count(ProjectTasksTable.id)}).from(ProjectTasksTable).where(and(eq(ProjectTasksTable.projectId, projectId), eq(ProjectTasksTable.status, 'in progress'))),
            db.select({value: count(ProjectTasksTable.id)}).from(ProjectTasksTable).where(and(eq(ProjectTasksTable.projectId, projectId), eq(ProjectTasksTable.status, 'finished')))
        ])

        // + 1 for the project owner in the number of members
        const cardAnalytics = [numberOfMembers.value + 1, numberOfPendingTasks.value, numberOfInProgressTasks.value, numberOfFinishedTasks.value] 

        return cardAnalytics
    } catch (error) {
        console.log(error)
        return [0, 0, 0, 0]
    }
}

type RecentActivity = {
    id: string
    taskName: string
    createdAt: Date
    user: {
        name: string
    }
}

export async function fetchRecentActivity(projectId: string) {
    try {
        const recentActivity = await db
            .select()
            .from(ProjectTasksTable)
            .where(eq(ProjectTasksTable.projectId, projectId))
            .orderBy(desc(ProjectTasksTable.createdAt))
            .limit(5)

        const userIds = recentActivity.map((activity) => activity.createdBy)

        const userDetail = await db
            .select({name: UsersTable.name, id: UsersTable.id})
            .from(UsersTable)
            .where(inArray(UsersTable.id, userIds))

        const recentActivityWithUser = recentActivity.map((activity) => {
            const user = userDetail.find((user) => user.id === activity.createdBy)
            return { ...activity, user }
        })

        return recentActivityWithUser as RecentActivity[]

    } catch (error) {
        console.log(error)
        return []       
    }
}
