import { Assign, Member, User } from "./projects";

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