"use client";

import { User } from "next-auth";
import TextArea from "./Textarea";
import { SendIcon } from "lucide-react";

export default function ChatComponent({ user }: { user: User }) {
    {/* AI name: Planie */}

    return (
        <section className="flex flex-col h-screen mx-auto w-[95%] sm:w-[85%] md:w-[70%] lg:w-[65%] xl:w-[60%] 2xl:w-[55%]">
            <div className="w-full h-[90%] overflow-y-scroll flex flex-col gap-2">

            </div>
            <form className="pb-2">  
                <div className="flex items-center gap-2 bg-muted rounded-md p-1 border focus-within:border-muted-foreground max-h-[150px] overflow-y-auto">
                    <TextArea 
                        name="message"
                        id="message"
                        placeholder="Írj egy üzenetet..."
                        className="min-h-[none] resize-none focus-visible:ring-0 pr-10 no-scrollbar"
                    />
                </div>
            </form>
        </section>
    )
}
