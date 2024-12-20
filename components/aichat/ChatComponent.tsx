"use client";

import { User } from "next-auth";
import TextArea from "./Textarea";
import { SendIcon } from "lucide-react";
import { Button } from "../ui/button";

export default function ChatComponent({ 
    user, 
}: { 
    user: User, 
}) {
    {/* AI name: Planie */}

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
                <form className="pb-2 flex items-center gap-2">
                    <TextArea 
                        name="message"
                        id="message"
                        placeholder="Írj egy üzenetet..."
                        className="min-h-[none] resize-none focus-visible:ring-0 no-scrollbar max-h-[10rem] py-2"
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
