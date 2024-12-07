export type Project = {
    id: string;
    userId: string;
    name: string;
    tier: 'free' | 'paid';
    createdAt: Date;
    status: 'active' | 'completed' | 'archived';
    nameChanged: Date | null;
}

export type ProjectData = {
    id: string;
    name: string;
    tier: 'free' | 'paid';
    createdAt: Date;
    userId: string;
    status: 'active' | 'completed' | 'archived';
    members: Member[];
    tasks: Task[];
    projectOwner?: User;
};
  
export type Member = {
    projectId: string;
    id: string;
    userId: string;
    role: 'member' | 'admin' | 'creator';
    addedAt: Date;
    user: User;
};
  
export type Task = {
    projectId: string;
    id: string;
    createdAt: Date;
    status: 'pending' | 'in progress' | 'finished';
    taskName: string;
    taskDescription: string;
    priority: 'low' | 'medium' | 'high';
    createdBy: string;
    assigns: Assign[];
};
  
export type Assign = {
    id: string;
    userId: string;
    taskId: string;
    assignedAt: Date;
    user: User;
};
  
export type User = {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    password: string | null;
    birthDate: Date | null;
    tier: 'free' | 'paid';
    image: string | null;
    nameChangedAt: Date | null;
    imageChangedAt: Date | null;
    createdAt: Date;
};