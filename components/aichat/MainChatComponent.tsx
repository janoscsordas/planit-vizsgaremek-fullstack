"use client";

import { SendIcon } from "lucide-react";
import { Button } from "../ui/button";
import { User } from "next-auth";
import { Suspense, useEffect, useRef, useState } from "react";
import Loading from "./Loading";
import MessageCards from "./MessageCards";
import { Spinner } from "@radix-ui/themes";
import { sendNewMessage } from "@/actions/aichat.action";
import { z } from "zod";
import { toast } from "sonner";
import AGTextarea from "./auto-growing-textarea";
import { Skeleton } from "../ui/skeleton";
import ReactMarkdown from "react-markdown";

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
    const [loadingStateMessage, setLoadingStateMessage] = useState("");
    const [data, setData] = useState(messages);
    const [message, setMessage] = useState("");
    const messageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messageRef.current) {
            messageRef.current.scrollIntoView();
        }
    }, [data, loadingStateMessage]);

    const submitMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            setLoadingStateMessage("Üzeneted feldolgozom...")
            
            const validatedMessage = z.string().max(1536).nonempty().safeParse(message);

            if (!validatedMessage.success) {
                throw new Error("Hibás adatokat adott meg!");
            }
            
            // Sending everything we need to the backend
            const response = await sendNewMessage(data[data.length - 1].conversationId, user.id!, message);

            if (!response.success) {
                throw new Error(response.message);
            }

            setLoadingStateMessage("Válaszom érkezik...")

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
                {
                    isLoading && (
                        <div className="flex flex-col gap-2 mb-1">
                            <div className="ml-auto bg-muted p-1 px-2 rounded-md w-full sm:w-max antialiased">
                                <ReactMarkdown className="prose dark:invert-prose text-gray-950 dark:text-gray-50 antialiased">
                                    {message}
                                </ReactMarkdown>
                            </div>
                            <div className="flex flex-col items-start gap-1">
                                <span className="text-xs text-muted-foreground">Planie</span>
                                <Skeleton className="mr-auto bg-emerald opacity-60 p-1 px-2 rounded-md w-full sm:w-[85%] antialiased">
                                    {loadingStateMessage}
                                </Skeleton>
                            </div>
                        </div>
                    )
                }
                {/* This is the div that will be scrolled into view */}
                <div ref={messageRef} className=""></div>
            </div>
            <div>
                <form className="pb-2 flex items-center gap-2" onSubmit={submitMessage}>
                    <AGTextarea 
                        isLoading={isLoading}
                        message={message}
                        setMessage={setMessage}
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