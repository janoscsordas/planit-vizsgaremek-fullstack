"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { EnrichedTask } from "@/lib/definitions/tasks"
import { Suspense, useMemo } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

export default function TaskList({ 
    enrichedTasks, 
    projectId 
}: { 
    enrichedTasks: EnrichedTask[], 
    projectId: string 
}) {
    const STATUS_ORDER = ['pending', 'in progress', 'finished'];

    const groupTasks = useMemo(() => {
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

        return Array.from(groupedTasks.values())
            .sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status));
    }, [enrichedTasks]);

    const getGroupKey = (group: { status: string; count: number }) => `${group.status}-${group.count}`
  
    return (
        <ScrollArea className="h-[calc(100vh-9.5rem)] w-full">
            <div className="w-full space-y-4">
                <Suspense fallback={<div>Loading...</div>}>
                    {groupTasks.map((group) => (
                        <TaskGroup
                            key={getGroupKey(group)}
                            title={group.title}
                            count={group.count}
                            tasks={group.tasks}
                            projectId={projectId}
                        />
                    ))}
                </Suspense>
            </div>
        </ScrollArea>
    )
}  

// Lazy-loaded TaskGroup with a custom loading component
const TaskGroup = dynamic(() => import('./task-group'), {
    loading: () => (
        <Skeleton className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
                <div className="h-6 w-6 bg-muted-foreground rounded-full"></div>
                <div className="h-4 w-24 bg-muted-foreground rounded"></div>
            </div>
            <div className="h-4 w-12 bg-muted-foreground rounded"></div>
        </Skeleton>
    ),
    ssr: false
});