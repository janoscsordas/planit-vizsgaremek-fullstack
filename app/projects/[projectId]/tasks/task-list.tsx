import { ScrollArea } from "@/components/ui/scroll-area"
import TaskGroup from "./task-group"
import { EnrichedTask } from "@/lib/definitions/tasks"

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
