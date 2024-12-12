export type TaskStatus = {
    status: "pending" | "in progress" | "finished"
}

export type Task = {
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
            image: string | null;
        };
    }[];
    projectOwner: {
        id: string;
        name: string | null;
        email: string | null;
        image: string | null;
    };
    projectId: string;
    id: string;
    createdAt: Date;
    status: "pending" | "in progress" | "finished";
    taskName: string;
    taskDescription: string;
    priority: "low" | "medium" | "high";
    assigns: {
        id: string;
        userId: string;
        taskId: string;
        assignedAt: Date;
        user: {
            id: string;
            name: string | null;
            email: string | null;
            image: string | null;
        };
    }[];
    createdByUser: {
        id: string;
        name: string | null;
        email: string | null;
        image: string | null;
    };
}