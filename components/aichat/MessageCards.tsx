import ReactMarkdown from 'react-markdown'

export default function MessageCards({ 
    message 
}: { 
    message: { 
        id: string, 
        userInput: string, 
        botResponse: string, 
        createdAt: Date | null 
    } 
}) {
    return (
        <div key={message.id} className="flex flex-col gap-2 mb-1">
            <div className="ml-auto bg-muted p-1 px-2 rounded-md w-max">
                <ReactMarkdown className="prose dark:invert-prose text-gray-950 dark:text-gray-50">
                    {message.userInput}
                </ReactMarkdown>
            </div>
            <div className="flex flex-col items-start gap-1">
                <span className="text-xs text-muted-foreground">Planie</span>
                <div className="mr-auto bg-emerald p-1 px-2 rounded-md w-[85%]">
                    <ReactMarkdown className="prose dark:invert-prose text-gray-950 dark:text-gray-50">
                        {message.botResponse}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    )
}