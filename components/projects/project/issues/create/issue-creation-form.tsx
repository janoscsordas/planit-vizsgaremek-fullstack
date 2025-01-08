"use client";

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar } from "@radix-ui/themes"
import { useState } from "react";
import MDEditor from '@uiw/react-md-editor';
import TaskCombobox from "./task-combobox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function IssueCreationForm({
    userId,
    userName,
    userImage,
    projectId,
    tasks,
}: {
    userId: string
    userName: string
    userImage: string
    projectId: string
    tasks: {
        id: string
        taskName: string
    }[]
}) {
    const [selectedTaskId, setSelectedTaskId] = useState("");
    const [titleState, setTitleState] = useState("");
    const [descriptionState, setDescriptionState] = useState("");
    
    const handleDescriptionChange = (value?: string) => {
        setDescriptionState(value ?? '');
    };

    return (
        <section className="flex items-start gap-6 lg:w-[90%] mx-auto">
            <div className="hidden sm:block">
                <Avatar radius="full" src={userImage} alt={userName} fallback={userName.charAt(0)} />
            </div>
            <form className="w-full">
                <div className="space-y-4">
                    <Label htmlFor="title" className="text-[1rem] font-bold">Issue címe</Label>
                    <Input 
                        className="mt-2 w-full" 
                        type="text" 
                        placeholder="Issue címe"
                        name="title"
                        id="title"
                        value={titleState}
                        onChange={(e) => setTitleState(e.target.value)}
                    />
                    <div className="space-y-4">
                        <Label className="text-[1rem] font-bold">Issue leírása</Label>
                        <MDEditor
                            value={descriptionState}
                            onChange={handleDescriptionChange}
                            textareaProps={{
                                placeholder: 'Issue leírása ide',
                            }}
                        />
                    </div>
                    <div className="space-y-4">
                        <Label className="text-[1rem] font-bold">Feladat</Label><br />
                        <span className="text-xs text-muted-foreground">Egy feladattal kapcsolatban lenne kérdésed? Jelöld ki a feladatot!</span>
                        <div className="flex items-center gap-2">
                            <TaskCombobox 
                                tasks={tasks} 
                                selectedTaskId={selectedTaskId} 
                                setSelectedTaskId={setSelectedTaskId} 
                            />
                            {selectedTaskId && 
                                <Button 
                                    type="button"
                                    variant="outline"
                                    className="text-red-500" 
                                    onClick={() => setSelectedTaskId("")}
                                >
                                    <Trash2 className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:block">Választás törlése</span>
                                </Button>
                            }
                        </div>
                    </div>
                    <div>
                        <Label className="text-[1rem] font-bold">Címke hozzáadása</Label>

                    </div>
                </div>
            </form>
        </section>
    )
}