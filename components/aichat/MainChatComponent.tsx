import { SendIcon } from "lucide-react";
import { Button } from "../ui/button";
import TextArea from "./Textarea";
import { User } from "next-auth";

export default function MainChatComponent({ 
    user,
    messages 
}: { 
    user: User,
    messages: { 
        id: string, 
        conversationId: string, 
        userInput: string, 
        botResponse: string,
        createdAt: Date | null
    }[] 
}) {
    const submitMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const message = e.currentTarget.message.value;

        
    }

    return (
        <section className="flex flex-col justify-between h-screen mx-auto w-[95%] sm:w-[85%] md:w-[70%] lg:w-[65%] xl:w-[60%] 2xl:w-[55%]">
            <div className="w-full h-[90%] rounded-md overflow-y-scroll flex flex-col gap-2 mt-2 p-4">
                {messages.map((message) => {
                    return (
                        <div key={message.id} className="flex flex-col gap-2">
                            <div className="ml-auto bg-muted p-1 px-2 rounded-md w-max">
                                {message.userInput}
                            </div>
                            <div className="flex flex-col items-start gap-1">
                                <span className="text-xs text-muted-foreground">Planie</span>
                                <div className="mr-auto bg-emerald p-1 px-2 rounded-md w-[85%]">
                                    {message.botResponse}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div>
                <form className="pb-2 flex items-center gap-2">
                    <TextArea 
                        name="message"
                        id="message"
                        placeholder="Írj egy üzenetet..."
                        className="min-h-[none] resize-none focus-visible:ring-0 no-scrollbar max-h-[10rem] py-2"
                        required
                    />
                    <Button variant={"outline"} type="submit">
                        <SendIcon className="w-6 h-6" />
                    </Button>
                </form>
                <small className="text-muted-foreground text-center block text-xs pb-2">Planie hibázhat. A fontos információkat mindig ellenőrizd le.</small>
            </div>
        </section>
    )
}