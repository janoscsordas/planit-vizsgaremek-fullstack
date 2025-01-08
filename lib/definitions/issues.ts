export interface Issue {
    id: number;
    projectId: string;
    issueName: string;
    issueDescription: string;
    taskIssueId: string | null;
    isOpen: boolean;
    replies: number;
    labels: unknown;
    openedAt: Date;
    openedByUser: {
        id: string;
        name: string | null;
        email: string | null;
        image: string | null;
    };
}