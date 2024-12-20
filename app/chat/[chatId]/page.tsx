
export default async function ChatPage({ params }: { params: Promise<{ chatId: string }> }) {
    const { chatId } = await params;
    
    return (
        <div>
            Chat page {chatId}
        </div>
    )
}