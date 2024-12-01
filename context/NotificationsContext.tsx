"use client";

import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/utils/supabase';

interface Notification {
    id: string;
    senderId: string;
    senderProjectId: string;
    receiverId: string;
    createdAt: Date;
    senderName?: string;
    senderImage?: string;
    projectName?: string; 
}

interface NotificationContextType {
    notifications: Notification[];
}

// Context for notification data
export const NotificationsContext = createContext<NotificationContextType | undefined>(undefined);

// Notifications Context Provider
export const NotificationsProvider = ({ children, userId }: { children: React.ReactNode, userId: string }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Fetch additional details for notifications
    const enrichNotifications = async (rawNotifications: Notification[]) => {
        if (rawNotifications.length === 0) {
            return []
        }

        // Extract unique sender and project IDs
        const uniqueSenderIds = [...new Set(rawNotifications.map((notification) => notification.senderId))];
        const uniqueProjectIds = [...new Set(rawNotifications.map((notification) => notification.senderProjectId))];

        try {
            // Fetch sender and project details
            const [senderResponse, projectResponse] = await Promise.all([
                fetch('/api/user/details', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ userIds: uniqueSenderIds })
                }),
                fetch('/api/projects/details', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ projectIds: uniqueProjectIds })
                })
            ])

            const senderDetails = await senderResponse.json();
            const projectDetails = await projectResponse.json();

            // Merge sender and project details with notifications
            const enrichedNotifications = rawNotifications.map((notification) => {
                return {
                    ...notification,
                    senderName: senderDetails[notification.senderId]?.name,
                    senderImage: senderDetails[notification.senderId]?.image,
                    projectName: projectDetails[notification.senderProjectId]?.name,
                };
            });

            return enrichedNotifications as Notification[];
        } catch (error) {
            console.error("Error enriching notifications:", error);
            return rawNotifications;
        }
    }

    // setup realtime subscription
    useEffect(() => {
        // get the initial data
        fetchNotifications();

        // Setup realtime subscription for new notifications
        const channel = supabase
            .channel('notifications')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'notifications', filter: `receiverId=eq.${userId}` },
                async (payload) => {
                    const newNotification = payload.new as Notification;
                    setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchNotifications = async () => {
        const { data: rawNotifications, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('receiverId', userId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error(error);
        }

        if (rawNotifications) {
            const enrichedNotifications = await enrichNotifications(rawNotifications);
            setNotifications(enrichedNotifications);
        }
    };

    return (
        <NotificationsContext.Provider value={{ notifications }}>
            {children}
        </NotificationsContext.Provider>
    )
}