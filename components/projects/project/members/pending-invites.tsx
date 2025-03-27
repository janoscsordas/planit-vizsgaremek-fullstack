"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/utils/supabase";
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";

export default function PendingInvites({ projectId }: { projectId: string }) {
  const { data: pendingNotifications, error, isLoading } = useQuery({
    queryKey: ["pending-invites"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("senderProjectId", projectId)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      const response = await fetch("/api/get-receiver-user-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userIds: data.map((notification) => notification.receiverId),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch data"); 
      }

      const userData = await response.json();

      return userData as {
        id: string;
        name: string;
        email: string;
        image: string;
      }[]
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
        {isLoading ? (
          <Skeleton className="w-[30%] h-[24] flex justify-center items-center py-2 my-4">
            <Loader2Icon className="animate-spin w-4 h-4" />
          </Skeleton>
        ) : pendingNotifications && pendingNotifications.length > 0 ? (
          pendingNotifications.map((notification) => (
            <div className="w-full my-4" key={notification.id}>
                <div className="">
                    <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                            <AvatarImage
                            src={notification.image}
                            alt={notification.name}
                            className="rounded-full"
                            />
                            <AvatarFallback>{notification.name ? notification.name.charAt(0).toUpperCase() : "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-2 md:mt-0">
                            <p className="text-xs font-medium">{notification.name}</p>
                        </div>
                    </div>
                </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground mt-2">Nincsenek függőben lévő meghívók</p>
        )}
    </>
  );
}
