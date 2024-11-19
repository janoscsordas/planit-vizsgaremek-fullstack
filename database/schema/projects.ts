import { pgEnum, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
import { UsersTable } from "@/database/schema/user";

export const projectTierEnum = pgEnum('project_tier', ['free', 'paid'])
export const projectStatusEnum = pgEnum('project_status', ['active', 'completed', 'archived'])
export const projectMemberEnum = pgEnum('project_member', ['member', 'admin', 'creator'])
export const projectTaskEnum = pgEnum('project_task', ['pending', 'in progress', 'finished'])

export const ProjectsTable = pgTable("projects", {
    id: text("id")
        .primaryKey()
        .notNull()
        .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
        .notNull()
        .references(() => UsersTable.id, { onDelete: "cascade" }),
    name: text("name")
        .notNull(),
    createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
        .notNull()
        .defaultNow(),
    tier: projectTierEnum("tier")
        .notNull()
        .default("free"),
    status: projectStatusEnum("status")
        .notNull()
        .default("active")
})

export const ProjectMembersTable = pgTable("project_members", {
    id: text("id")
        .notNull()
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    projectId: text("project_id")
        .notNull()
        .references(() => ProjectsTable.id, { onDelete: "cascade" }),
    userId: text("user_id")
        .notNull()
        .references(() => UsersTable.id, { onDelete: "cascade" }),
    role: projectMemberEnum("role")
        .notNull()
        .default("member"),
    addedAt: timestamp("addedAt", { mode: "date", withTimezone: true })
        .notNull()
        .defaultNow(),
}, (table) => ({
    uniqueProjectMember: unique().on(table.projectId, table.userId)
}))

export const ProjectTasksTable = pgTable("project_tasks", {
    id: text("id")
        .notNull()
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    projectId: text("project_id")
        .references(() => ProjectsTable.id, { onDelete: "cascade" }),
    taskName: text("task_name"),
    taskDescription: text("task_description"),
    status: projectTaskEnum("status")
        .default("pending"),
    createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
        .defaultNow()
})

export const ProjectTaskAssignsTable = pgTable("project_task_assigns", {
    id: text("id")
        .notNull()
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    taskId: text("task_id")
        .notNull()
        .references(() => ProjectTasksTable.id, { onDelete: "cascade" }),
    userId: text("user_id")
        .notNull()
        .references(() => UsersTable.id, { onDelete: "cascade" }),
    assignedAt: timestamp("assignedAt", { mode: "date", withTimezone: true })
        .defaultNow()
})