import { EnrichedTask } from "@/lib/definitions/tasks";
import React, { createContext, useState } from "react";

export interface TasksContextProps {
    tasks: EnrichedTask[];
    setTasks: React.Dispatch<React.SetStateAction<EnrichedTask[]>>;
}

export const TasksContext = createContext<TasksContextProps | undefined>(undefined)

interface TasksProviderProps {
    children: React.ReactNode;
}

export const TasksProvider = ({ children }: TasksProviderProps) => {
    const [tasks, setTasks] = useState<EnrichedTask[]>([])

    return (
        <TasksContext.Provider value={{ tasks, setTasks }}>
            {children}
        </TasksContext.Provider>
    )
}