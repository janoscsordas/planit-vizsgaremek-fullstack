"use client"

import { Avatar } from "@radix-ui/themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMessages } from "@/hooks/useMessages";
import { Loader2, Smile } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatDistance } from "date-fns";
import { hu } from "date-fns/locale/hu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function MessageComponent({ projectId, userId }: { projectId: string, userId: string }) {
    const { messages, error, sendMessage, deleteMessage } = useMessages(projectId, userId);
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(false)

    // State for editing a message
    const [editingMessage, setEditingMessage] = useState<boolean>(false)
    const [editMessageContent, setEditMessageContent] = useState<string>("")
    
    // Create a ref for the messages container
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    // Scroll to bottom function
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    // Scroll to bottom whenever messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    // Send message function that calls the sendMessage function from the useMessages hook
    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (newMessage.trim()) {
            setLoading(true)
            await sendMessage(newMessage)
            setNewMessage('')
            setLoading(false)
        }
    }

    // Handle edit message function
    // This will be a TODO
    // const handleEditMessage = async (e: React.FormEvent<HTMLFormElement>, messageId: string, content: string) => {
    //     e.preventDefault()
    //     await updateMessage(messageId, content)
    //     setEditingMessage(false)
    // }

    // Handle emoji selection
    const handleEmojiSelect = (emoji: string) => {
        setNewMessage(newMessage + emoji)
    }

    return (
        <div className="flex-1 flex flex-col mt-2">
          <ScrollArea className="rounded-md flex-1 p-4 min-h-[calc(100dvh-200px)] max-h-[calc(100dvh-200px)] overflow-y-scroll">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex items-start ${
                  message.user_id === userId ? "justify-end" : "justify-start"
                }`}
              >
                {message.user_id !== userId && (
                  <Avatar
                      src={message.user.image}
                      fallback={message.user.name.charAt(0)}
                      radius="full"
                      className="mr-2"
                  />
                )}
                <div 
                    title={"Elküldve: " + formatDistance(new Date(message.created_at), new Date(), { locale: hu, addSuffix: true })} 
                    className={`flex flex-col ${message.user_id === userId ? "items-end" : "items-start"}`}>
                  <span className="text-sm text-gray-500 mb-1 mx-1">{message.user.name}</span>
                  <div
                    className={`p-2 rounded-lg ${
                      message.user_id === userId
                        ? "bg-emerald text-primary-foreground"
                        : "bg-gray-200 dark:bg-white text-primary dark:text-primary-foreground"
                    }`}
                  >
                    <>{message.content}</>
                  </div>
                </div>
                {message.user_id === userId && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild disabled={message.user_id !== userId}>
                            <Avatar
                                src={message.user.image}
                                fallback={message.user.name.charAt(0)}
                                radius="full"
                                className="ml-2"
                            />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Üzenet Menü</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                                setEditMessageContent(message.content);
                                setEditingMessage(true)
                            }}>
                                Szerkesztés
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteMessage(message.id)} className="text-red-500 focus:bg-red-800 focus:text-red-50">
                                Törlés
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} className="sr-only" />
          </ScrollArea>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleSendMessage} className="pt-4 px-4 pb-1 flex items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="mr-2" disabled={loading} >
                  <Smile className="h-4 w-4" />
                  <span className="sr-only">Emoji picker</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="grid grid-cols-8 gap-2">
                  {["😀", "😂", "😊", "😍", "🤔", "😎", "👍", "❤️"].map((emoji) => (
                    <button
                      key={emoji}
                      className="text-2xl"
                      onClick={() => handleEmojiSelect(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <Input
              type="text"
              name="message"
              id="message"
              placeholder="Írj egy üzenetet..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
              disabled={loading}
              maxLength={256}
              required={true}
            />
            <Button type="submit" className="ml-2" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Küldés"}
            </Button>
          </form>
          <p className="text-center text-[.75rem] text-muted-foreground">Küldj üzenetet. Ha szerkeszteni szeretnél egyet vagy törölni, kattints az üzenetnél a profilképedre.</p>
        </div>
    )
}