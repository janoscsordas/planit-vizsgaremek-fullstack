"use client"

import { EnrichedMessage, fetchMessageWithUserDetails, Message } from "@/actions/message.action";
import { supabase } from "@/lib/utils/supabase";
import { useEffect, useState } from "react";
import { z } from "zod";

const sendorUpdateMessageSchema = z.object({
    content: z.string().min(1, { message: "Az üzenet nem lehet üres!" }).max(256, { message: "Az üzenet maximum 256 karakter hosszú lehet!" }),
})

export const useMessages = (projectId: string, userId: string) => {
    const [messages, setMessages] = useState<EnrichedMessage[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch messages for the project
        const fetchMessages = async () => {
            const { data: messages, error } = await supabase
                .from('messages')
                .select('*')
                .eq('project_id', projectId)
                .order('created_at', { ascending: true });

            if (error) {
                setError(error.message);
                return;
            }

            const enrichedMessages = await fetchMessageWithUserDetails(messages)

            setMessages(enrichedMessages || []);
        }

        // Realtime subscription for messages table to listen for INSERT, UPDATE and DELETE events
        const channel = supabase
            .channel('messages')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `project_id=eq.${projectId}` },
                async (payload) => {
                    const newMessage = (await fetchMessageWithUserDetails([payload.new as Message]))[0] as EnrichedMessage

                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                },
            )
            // .on(
            //     'postgres_changes',
            //     { event: 'UPDATE', schema: 'public', table: 'messages', filter: `project_id=eq.${projectId}` },
            //     async (payload) => {
            //         const updatedMessage = (await fetchMessageWithUserDetails([payload.new as Message]))[0] as EnrichedMessage

            //         setMessages((prevMessages) => prevMessages.map((message) => message.id === updatedMessage.id ? updatedMessage : message));
            //     },      
            // )
            .on(
                'postgres_changes',
                { event: 'DELETE', schema: 'public', table: 'messages' },
                async (payload) => {
                    setMessages((prevMessages) => prevMessages.filter((message) => message.id !== (payload.old as Message).id));
                }
            )
            .subscribe();

        // fetching all messages
        fetchMessages();

        // Cleanup the subscription
        return () => {
            supabase.removeChannel(channel);
        };
    }, [projectId]);

    // Send messages function
    const sendMessage = async (content: string) => {
        const validatedField = sendorUpdateMessageSchema.safeParse({ content });

        if (!validatedField.success) {
            setError(validatedField.error.message);
            return;
        }

        const { error } = await supabase.from('messages').insert({
            project_id: projectId,
            user_id: userId,
            content: validatedField.data.content,
        })

        if (error) {
            setError(error.message);
            return;
        }
    }

    const deleteMessage = async (id: string) => {
        const { error } = await supabase.from('messages').delete().eq('id', id)
        if (error) {
            setError(error.message);
            return;
        }
    }

    // const updateMessage = async (id: string, content: string) => {
    //     const validatedFields = sendorUpdateMessageSchema.safeParse({ content });

    //     if (!validatedFields.success) {
    //         setError(validatedFields.error.message);
    //         return;
    //     }

    //     const { error } = await supabase.from('messages').update({ content: validatedFields.data.content }).eq('id', id)
    //     if (error) {
    //         setError(error.message);
    //         return;
    //     }
    // }

    return { messages, error, sendMessage, deleteMessage }
}
