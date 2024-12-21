"use client";

import { User } from "next-auth";
import TextArea from "./Textarea";
import { SendIcon } from "lucide-react";
import { Button } from "../ui/button";
import { z } from "zod";
import { toast } from "sonner";
import { initiateConversation } from "@/actions/aichat.action";
import { useRouter } from "next/navigation";

export default function ChatComponent({ 
    user, 
}: { 
    user: User, 
}) {
    const router = useRouter();
    {/* AI name: Planie */}

    /* This function will initiate a new conversation with the AI.
    * Then if everything is successful, it will initiate a new conversation in the db,
    * and redirect the user to /chat/:chatId/page.
    */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const message = e.currentTarget.message.value;

        const validatedMessage = z.string().nonempty().safeParse(message);

        if (!validatedMessage.success) {
            toast.error("Az üzenet nem lehet üres!", { position: "top-center" });
            return;
        }

        // Sending everything we need to the backend
        // In this case, we are sending the user's message to the AI and the user's id to initiate a new conversation
        const response = await initiateConversation({ message, userId: user.id! });

        if (!response.success) {
            toast.error(response.message, { position: "top-center" });
            return;
        }
        
        router.push(`/chat/${response.conversationId}`);
    }

    return (
        <section className="flex flex-col justify-between h-screen mx-auto w-[95%] sm:w-[85%] md:w-[70%] lg:w-[65%] xl:w-[60%] 2xl:w-[55%]">
            <div className="w-full h-[90%] rounded-md overflow-y-scroll flex flex-col gap-2 mt-2">
                <div className="flex flex-col gap-2 justify-center items-center h-full font-bold selection:bg-emerald">
                    <h2 className="text-center text-3xl">
                        Üdv <strong className="text-emerald selection:bg-transparent">{user.name}</strong>! <br /> Miben segíthetek ma?
                    </h2>
                    <small className="text-muted-foreground text-xs">Küldj üzenetet a kezdéshez!</small>
                </div>
            </div>
            <div>
                <form className="pb-2 flex items-center gap-2" onSubmit={handleSubmit}>
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
