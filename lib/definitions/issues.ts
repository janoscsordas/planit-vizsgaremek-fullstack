export interface Issue {
    id: number;
    projectId: string;
    issueName: string;
    issueDescription: string;
    taskIssueId: string | null;
    isOpen: boolean;
    replies: number;
    labels: string[] | null;
    openedAt: Date;
    openedByUser: {
        id: string;
        name: string | null;
        email: string | null;
        image: string | null;
    };
}

export type IssueCreationData = {
    issueName: string;
    issueDescription: string;
    taskIssueId?: string | undefined;
    labels: string[] | null;
}

export type IssueWithItsSpecificData = {
    id: number;
    projectId: string;
    issueName: string;
    issueDescription: string;
    taskIssueId: string | null;
    isOpen: boolean;
    replies: number;
    labels: string[] | null;
    openedAt: Date;
    openedBy: string;
    project: {
        id: string;
        name: string;
    };
    openedByUser: {
        id: string;
        name: string | null;
        image: string | null;
    };
    taskIssue: {
        createdAt: Date;
        status: "pending" | "in progress" | "finished";
        taskName: string;
        taskDescription: string;
        priority: "low" | "medium" | "high";
    } | null;
    allReplies: {
        id: string;
        issueId: number;
        reply: string;
        repliedAt: Date;
        repliedBy: string;
        repliedByUser: {
            name: string | null;
            image: string | null;
        };
    }[];
}

export type IssueDescriptionTypeForComponent = {
    issueDescription: string
    userId: string
    userName: string
    userImage: string
    projectId: string
    taskIssue: {
        createdAt: Date;
        status: "pending" | "in progress" | "finished";
        taskName: string;
        taskDescription: string;
        priority: "low" | "medium" | "high";
    } | null
    openedAt: Date
}