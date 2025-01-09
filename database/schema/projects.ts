import { boolean, integer, pgEnum, pgTable, serial, text, timestamp, unique } from "drizzle-orm/pg-core";
import { UsersTable } from "@/database/schema/user";
import { relations, sql } from "drizzle-orm";

export const projectTierEnum = pgEnum('project_tier', ['free', 'paid'])
export const projectStatusEnum = pgEnum('project_status', ['active', 'completed', 'archived'])
export const projectMemberEnum = pgEnum('project_member', ['member', 'admin', 'creator'])
export const projectTaskEnum = pgEnum('project_task', ['pending', 'in progress', 'finished'])
export const projectTaskPriorityEnum = pgEnum('project_task_priority', ['low', 'medium', 'high'])

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
        .default("active"),
    nameChanged: timestamp("nameChanged", { mode: "date", withTimezone: true })
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
        .references(() => ProjectsTable.id, { onDelete: "cascade" })
        .notNull(),
    taskName: 
        text("task_name")
        .notNull(),
    taskDescription: 
        text("task_description")
        .notNull(),
    status: projectTaskEnum("status")
        .default("pending")
        .notNull(),
    priority: projectTaskPriorityEnum("priority")
        .default("low")
        .notNull(),
    createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
        .notNull()
        .defaultNow(),
    createdBy: text("created_by")
        .notNull()
        .references(() => UsersTable.id, { onDelete: "cascade" }),
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
        .notNull()
        .defaultNow(),
})

export const ProjectIssuesTable = pgTable("project_issues", {
    id: serial("id")
        .primaryKey(),
    projectId: text("project_id")
        .notNull()
        .references(() => ProjectsTable.id, { onDelete: "cascade" }),
    issueName: text("issue_name")
        .notNull(),
    issueDescription: text("issue_description")
        .notNull(),
    taskIssueId: text("task_issue_id")
        .references(() => ProjectTasksTable.id, { onDelete: "cascade" }),
    isOpen: boolean("is_open")
        .notNull()
        .default(true),
    replies: integer("replies")
        .notNull()
        .default(0),
    labels: text("labels")
        .array(),
    openedAt: timestamp("opened_at", { mode: "date", withTimezone: true })
        .notNull()
        .defaultNow(),
    openedBy: text("opened_by")
        .notNull()
        .references(() => UsersTable.id, { onDelete: "cascade" }),
})

export const ProjectIssueRepliesTable = pgTable("project_issue_replies", {
    id: text("id")
        .notNull()
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    issueId: integer("issue_id")
        .notNull()
        .references(() => ProjectIssuesTable.id, { onDelete: "cascade" }),
    reply: text("reply")
        .notNull(),
    repliedAt: timestamp("replied_at", { mode: "date", withTimezone: true })
        .notNull()
        .defaultNow(),
    repliedBy: text("replied_by")
        .notNull()
        .references(() => UsersTable.id, { onDelete: "cascade" }),
})

// Relations between tables

export const ProjectRelations = relations(ProjectsTable, ({ one, many }) => ({
    owner: one(UsersTable, {
      fields: [ProjectsTable.userId],
      references: [UsersTable.id]
    }),
    members: many(ProjectMembersTable),
    tasks: many(ProjectTasksTable),
    issues: many(ProjectIssuesTable)
}));
  
export const ProjectMemberRelations = relations(ProjectMembersTable, ({ one }) => ({
    project: one(ProjectsTable, {
      fields: [ProjectMembersTable.projectId],
      references: [ProjectsTable.id]
    }),
    user: one(UsersTable, {
      fields: [ProjectMembersTable.userId],
      references: [UsersTable.id]
    })
  }));
  
export const ProjectTaskRelations = relations(ProjectTasksTable, ({ one, many }) => ({
    project: one(ProjectsTable, {
      fields: [ProjectTasksTable.projectId],
      references: [ProjectsTable.id]
    }),
    assigns: many(ProjectTaskAssignsTable),
    createdByUser: one(UsersTable, {
        fields: [ProjectTasksTable.createdBy],
        references: [UsersTable.id]
    })
}));
  
export const ProjectTaskAssignRelations = relations(ProjectTaskAssignsTable, ({ one }) => ({
    task: one(ProjectTasksTable, {
      fields: [ProjectTaskAssignsTable.taskId],
      references: [ProjectTasksTable.id]
    }),
    user: one(UsersTable, {
      fields: [ProjectTaskAssignsTable.userId],
      references: [UsersTable.id]
    })
}));

export const ProjectIssueRelations = relations(ProjectIssuesTable, ({ one, many }) => ({
    project: one(ProjectsTable, {
      fields: [ProjectIssuesTable.projectId],
      references: [ProjectsTable.id]
    }),
    openedByUser: one(UsersTable, {
        fields: [ProjectIssuesTable.openedBy],
        references: [UsersTable.id]
    }),
    taskIssue: one(ProjectTasksTable, {
        fields: [ProjectIssuesTable.taskIssueId],
        references: [ProjectTasksTable.id]
    }),
    allReplies: many(ProjectIssueRepliesTable)
}));

export const ProjectIssueRepliesRelations = relations(ProjectIssueRepliesTable, ({ one }) => ({
    issue: one(ProjectIssuesTable, {
      fields: [ProjectIssueRepliesTable.issueId],
      references: [ProjectIssuesTable.id]
    }),
    repliedByUser: one(UsersTable, {
        fields: [ProjectIssueRepliesTable.repliedBy],
        references: [UsersTable.id]
    })
}))