"use client";

import { SendIcon } from "lucide-react";
import { Button } from "../ui/button";
import { User } from "next-auth";
import { Suspense, useEffect, useRef, useState } from "react";
import Loading from "./Loading";
import MessageCards from "./MessageCards";
import { Spinner } from "@radix-ui/themes";
import { sendMessageToAI, sendNewMessage } from "@/actions/aichat.action";
import { z } from "zod";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";

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
        createdAt: Date
    }[] 
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(messages);
    const [message, setMessage] = useState("");
    const messageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messageRef.current) {
            messageRef.current.scrollIntoView();
        }
    }, [data]);

    const submitMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            const validatedMessage = z.string().nonempty().safeParse(message);

            if (!validatedMessage.success) {
                throw new Error("Hibás adatokat adott meg!");
            }

            // Sending everything we need to the backend
            const response = await sendNewMessage(data[data.length - 1].conversationId, user.id!, message);

            if (!response.success) {
                throw new Error(response.message);
            }

            if (response.data) {
                setData([...data, response.data]);
            }
        } catch (error: any) {
            toast.error(error.message, { position: "top-center" });
        } finally {
            setIsLoading(false);
            setMessage("");
        }
    }

    return (
        <section className="flex flex-col justify-between h-screen mx-auto w-[95%] sm:w-[85%] md:w-[70%] lg:w-[65%] xl:w-[60%] 2xl:w-[55%]">
            <div className="w-full h-[90%] rounded-md overflow-y-scroll flex flex-col gap-2 mt-2 p-4 relative">
                <Suspense fallback={<Loading />}>
                    {data && data.map((message) => (
                        <MessageCards key={message.id} message={message} />
                    ))}
                </Suspense>
                <div ref={messageRef} className=""></div>
            </div>
            <div>
                <form className="pb-2 flex items-center gap-2" onSubmit={submitMessage}>
                    <Textarea 
                        name="message"
                        id="message"
                        placeholder="Írj egy üzenetet..."
                        className="min-h-[none] resize-none focus-visible:ring-0 no-scrollbar max-h-[10rem] py-2"
                        required
                        disabled={isLoading}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={1}
                        autoFocus={true}
                    />
                    <Button variant={"outline"} type="submit" disabled={isLoading}>
                        {isLoading ? <Spinner /> : <SendIcon className="w-6 h-6" />}
                    </Button>
                </form>
                <small className="text-muted-foreground text-center block text-xs pb-2">Planie hibázhat. A fontos információkat mindig ellenőrizd le.</small>
            </div>
        </section>
    )
}