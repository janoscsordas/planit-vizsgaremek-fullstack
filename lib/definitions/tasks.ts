export type TaskStatus = {
    status: "pending" | "in progress" | "finished"
}

export type TaskTable = {
    id: string;
    taskName: string;
    taskDescription: string;
    status: 'pending' | 'in progress' | 'finished';
    createdAt: Date;
    priority: 'low' | 'medium' | 'high';
    projectId: string;
    createdBy: string;
    createdByUser: {
        id: string;
        createdAt: Date;
        name: string;
        email: string;
        image: string | null;
    };
    assigns: {
        id: string;
        userId: string;
        taskId: string;
        assignedAt: Date;
        user: {
            id: string;
            createdAt: Date;
            name: string;
            email: string;
            image: string | null;
        };
    }[];
};