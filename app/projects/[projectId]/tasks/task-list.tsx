"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { EnrichedTask } from "@/lib/definitions/tasks";
import { Suspense, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useDebounce } from "use-debounce";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import CreateTask from "@/components/projects/tasks/CreateTask";
import { PlusIcon } from "lucide-react";

export default function TaskList({
  enrichedTasks,
  projectId,
}: {
  enrichedTasks: EnrichedTask[];
  projectId: string;
}) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const STATUS_ORDER = ["pending", "in progress", "finished"];

  const groupTasks = useMemo(() => {
    const groupedTasks = new Map<
      string,
      {
        status: string;
        title: string;
        count: number;
        tasks: EnrichedTask[];
      }
    >();

    // First, initialize the Map with all statuses
    STATUS_ORDER.forEach((status) => {
      groupedTasks.set(status, {
        status: status,
        title: status
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        count: 0,
        tasks: [],
      });
    });

    // Then add tasks to their respective groups
    enrichedTasks.forEach((task) => {
      const group = groupedTasks.get(task.status)!;
      group.tasks.push(task);
      group.count += 1;
    });

    // Filter groups based on search term
    const filteredGroups: typeof groupedTasks = new Map();
    groupedTasks.forEach((group, key) => {
      const matchingTasks = group.tasks.filter(
        (task) =>
          task.taskName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) &&
          (priorityFilter === "all" || task.priority === priorityFilter)
      );

      if (matchingTasks.length > 0) {
        filteredGroups.set(key, {
          ...group,
          tasks: matchingTasks,
          count: matchingTasks.length,
        });
      }
    });

    return Array.from(filteredGroups.values()).sort(
      (a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status)
    );
  }, [enrichedTasks, debouncedSearchTerm, priorityFilter]);

  const getGroupKey = (group: { status: string; count: number }) =>
    `${group.status}-${group.count}`;

  return (
    <>
      <div className="mb-2 flex gap-4 sm:justify-start">
        <Input
          placeholder="Feladat Keresése..."
          aria-label="Feladat Keresése..."
          className="w-[90%] sm:w-[300px]"
          name="search"
          id="search"
          maxLength={128}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select name="priority" value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-max sm:w-[180px]">
            <SelectValue defaultValue="all" placeholder="Priorítás" />
          </SelectTrigger>
          <SelectContent id="priority">
            <SelectItem defaultChecked value="all">Összes</SelectItem>
            <SelectItem value="low">Alacsony</SelectItem>
            <SelectItem value="medium">Közepes</SelectItem>
            <SelectItem value="high">Magas</SelectItem>
          </SelectContent>
        </Select>
        <CreateTask>
          <Button variant={"outline"}>
            <PlusIcon className="h-4 w-4" />
          </Button>
        </CreateTask>
      </div>
      <ScrollArea className="h-[calc(100vh-11.5rem)] w-full">
        <div className="w-full space-y-4">
          <Suspense fallback={<div>Loading...</div>}>
            {groupTasks.length > 0 ? (
              groupTasks.map((group) => (
                <TaskGroup
                  key={getGroupKey(group)}
                  title={group.title}
                  count={group.count}
                  tasks={group.tasks}
                  projectId={projectId}
                />
              ))
            ) : (
              <div className="text-muted-foreground py-4">
                Nincs találat a szűrésre vagy még nem készítettél feladatot.
              </div>
            )}
          </Suspense>
        </div>
      </ScrollArea>
    </>
  );
}

// Lazy-loaded TaskGroup with a custom loading component
const TaskGroup = dynamic(() => import("./task-group"), {
  loading: () => (
    <Skeleton className="flex items-center justify-between p-4">
      <div className="flex items-center space-x-4">
        <div className="h-6 w-6 bg-muted-foreground rounded-full"></div>
        <div className="h-4 w-24 bg-muted-foreground rounded"></div>
      </div>
      <div className="h-4 w-12 bg-muted-foreground rounded"></div>
    </Skeleton>
  ),
  ssr: false,
});
