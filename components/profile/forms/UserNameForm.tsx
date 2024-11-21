"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { DateTimePicker } from "../DatePicker";
import { useEffect, useState } from "react";
import { differenceInDays } from "date-fns";
import { userChangeFormSchema } from "@/lib/schemas/userSchema";
import { useToast } from "@/hooks/use-toast";
import { UserData } from "@/lib/definitions/user-types";

export default function UserForm({ userData }: { userData: UserData }) {
    const { toast } = useToast();

    const [formState, setFormState] = useState({
        name: userData.name,
        isLoading: false,
        error: null as string | null,
        nameChangedAt: userData.nameChangedAt,
        disabled: false,
    });

    useEffect(() => {
        if (formState.nameChangedAt && differenceInDays(formState.nameChangedAt, new Date()) < 90) {
            setFormState(prev => ({ ...prev, disabled: true }));
        }
    }, [formState.nameChangedAt]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormState(prev => ({ ...prev, isLoading: true }));

        try {
            const validatedData = userChangeFormSchema.safeParse({ name: formState.name });

            if (!validatedData.success) {
                throw new Error("Invalid data");
            }

            const response = await fetch("/api/user", {
                method: "PUT",
                body: JSON.stringify({ name: validatedData.data.name }),
            });

            if (!response.ok) {
                throw new Error("Failed to update user");
            }

            const data = await response.json();

            toast({
                title: "Sikeres módosítás",
                description: data.message,
                className: "border-emerald-hover bg-emerald text-primary",
            });
        } catch (error) {
            toast({
                title: "Hiba történt",
                description: "A felhasználónév módosítása sikertelen.",
                variant: "destructive",
            });
        } finally {
            setFormState(prev => ({ ...prev, isLoading: false }));
        }
    }

    return (
        <form  
            className="border border-muted rounded-md p-4"
            onSubmit={handleSubmit}
        >
            <h4 className="font-medium text-sm">Felhasználónév</h4>
            <Input 
                className="mt-2 text-sm" 
                type="text" 
                name="name" 
                id="name" 
                placeholder="Felhasználónév"
                value={formState.name}
                onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                disabled={formState.disabled}
            />
            <p className="text-muted-foreground text-xs pt-2">
                {formState.disabled ? `${formState.nameChangedAt && (90 - differenceInDays(formState.nameChangedAt, new Date()))} nap múlva lehet módosítani a felhasználónevet.` : "A felhasználónevet 90 naponta egyszer lehet módosítani."}
            </p>
            <Button 
                className="mb-10 md:mb-0 mt-10 bg-emerald hover:bg-emerald-hover" 
                type="submit"
                disabled={formState.disabled}
            >
                Mentés
            </Button>
        </form>
    )
}
