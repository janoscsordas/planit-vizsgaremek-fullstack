export interface Notification {
    id: number;
    senderId: string;
    senderProjectId: string;
    receiverId: string;
    created_at: Date;
    senderName?: string;
    senderImage?: string;
    projectName?: string;
}