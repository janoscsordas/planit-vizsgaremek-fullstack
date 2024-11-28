export type Project = {
    id: string;
    userId: string;
    name: string;
    createdAt: Date;
    tier: "free" | "paid";
    status: "active" | "completed" | "archived";
}

export type ProjectMember = {
    id: string;
    projectId: string;
    userId: string;
    role: "member" | "admin" | "creator";
    addedAt: Date;
}