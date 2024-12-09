export type Message = {
    id: string;
    user_id: string;
    project_id: string;
    content: string;
    created_at: Date;
    is_edited: boolean;
}

export type EnrichedMessage = {
    id: string;
    user_id: string;
    project_id: string;
    content: string;
    created_at: Date;
    is_edited: boolean;
    user: {
        id: string;
        name: string;
        email: string;
        image: string | undefined;
    }
}