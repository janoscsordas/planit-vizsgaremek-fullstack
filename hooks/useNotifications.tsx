import { NotificationsContext } from "@/context/NotificationsContext";
import { useContext } from "react";

export const useNotifications = () => {
    const context = useContext(NotificationsContext);
    if (context === undefined) {
        throw new Error("useNotifications must be used within a NotificationsProvider.");
    }
    return context;
}