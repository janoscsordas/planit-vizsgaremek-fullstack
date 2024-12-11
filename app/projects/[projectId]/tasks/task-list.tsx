"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import TaskGroup from "./task-group"

export type EnrichedTask = {
    members: {
        projectId: string;
        id: string;
        userId: string;
        role: "member" | "admin" | "creator";
        addedAt: Date;
        user: {
            id: string;
            name: string | null;
            email: string | null;
            emailVerified: Date | null;
            password: string | null;
            birthDate: Date | null;
            tier: "free" | "paid";
            image: string | null;
            nameChangedAt: Date | null;
            imageChangedAt: Date | null;
            createdAt: Date;
        };
    }[];
    projectOwner: {
        id: string;
        name: string | null;
        email: string | null;
        emailVerified: Date | null;
        password: string | null;
        birthDate: Date | null;
        tier: "free" | "paid";
        image: string | null;
        nameChangedAt: Date | null;
        imageChangedAt: Date | null;
        createdAt: Date;
    };
    projectId: string;
    id: string;
    createdAt: Date;
    status: "pending" | "in progress" | "finished";
    taskName: string;
    taskDescription: string;
    priority: "low" | "medium" | "high";
    createdBy: string;
    assigns: {
        id: string;
        userId: string;
        taskId: string;
        assignedAt: Date;
        user: {
            id: string;
            name: string | null;
            email: string | null;
            emailVerified: Date | null;
            password: string | null;
            birthDate: Date | null;
            tier: "free" | "paid";
            image: string | null;
            nameChangedAt: Date | null;
            imageChangedAt: Date | null;
            createdAt: Date;
        };
    }[];
    createdByUser: {
        id: string;
        name: string | null;
        email: string | null;
        emailVerified: Date | null;
        birthDate: Date | null;
        tier: "free" | "paid";
        image: string | null;
        nameChangedAt: Date | null;
        imageChangedAt: Date | null;
        createdAt: Date;
    };
}

export default function TaskList({ enrichedTasks, projectId }: { enrichedTasks: EnrichedTask[], projectId: string }) {
    const STATUS_ORDER = ['pending', 'in progress', 'finished'];

    const groupedTasks = new Map<string, { 
        status: string; 
        title: string; 
        count: number; 
        tasks: EnrichedTask[] 
    }>();

    // First, initialize the Map with all statuses
    STATUS_ORDER.forEach(status => {
        groupedTasks.set(status, {
            status: status,
            title: status
                .split(" ")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
            count: 0,
            tasks: []
        });
    });

    // Then add tasks to their respective groups
    enrichedTasks.forEach(task => {
        const group = groupedTasks.get(task.status)!;
        group.tasks.push(task);
        group.count += 1;
    });

    const groupTasks = Array.from(groupedTasks.values())
        .sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status));
  
    return (
        <ScrollArea className="h-[calc(100vh-9.5rem)] w-full">
            <div className="w-full space-y-4">
                {groupTasks.map((group) => (
                    <TaskGroup
                        key={group.status}
                        title={group.title}
                        count={group.count}
                        tasks={group.tasks}
                        projectId={projectId}
                    />
                ))}
            </div>
        </ScrollArea>
    )
}  
