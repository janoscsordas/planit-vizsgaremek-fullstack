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

    return (
        <section className="flex flex-col justify-between h-screen mx-auto w-[95%] sm:w-[85%] md:w-[70%] lg:w-[65%] xl:w-[60%] 2xl:w-[55%]">
            <div className="w-full h-[90%] rounded-md overflow-y-scroll flex flex-col gap-2 mt-2">
                {messages.map((message) => {
                    return (
                        <div key={message.id} className="flex flex-col gap-2">
                            <div>
                                <div className="flex flex-col gap-2 justify-center items-center h-full font-bold">
                                    <h2 className="text-center text-3xl">
                                        {message.userInput}
                                    </h2>
                                </div>
                            </div>
                            <div>
                                <div className="flex flex-col gap-2 justify-center items-center h-full font-bold">
                                    <h2 className="text-center text-3xl">
                                        {message.botResponse}
                                    </h2>
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