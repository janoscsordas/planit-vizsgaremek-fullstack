import { useEffect } from "react"
import { toast } from "sonner"
import { supabase } from "@/lib/utils/supabase"
import { EnrichedMessage, fetchMessageWithUserDetails, Message } from "@/actions/message.action"
import { Avatar } from "@radix-ui/themes"

export const useGlobalMessagesListener = (currentProjectId: string) => {
    useEffect(() => {
        // Subscribe to message inserts
        const channel = supabase
            .channel('messages')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `project_id=eq.${currentProjectId}` },
                async (payload) => {
                    const newMessage = (await fetchMessageWithUserDetails([payload.new as Message]))[0] as EnrichedMessage
                    
                    toast(`Új üzenet érkezett tőle: ${newMessage.user?.name}`, { duration: 5000, position: 'top-center', icon: <Avatar src={newMessage.user?.image} fallback={newMessage.user?.name.charAt(0)} className="w-4 h-4" radius="full" /> });
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [currentProjectId])
}