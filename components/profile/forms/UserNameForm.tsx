"use client"

import React from 'react';
import { useEffect, useState } from 'react';
import { differenceInDays } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { userChangeFormSchema } from '@/lib/schemas/userSchema';

interface UserData {
    name: string;
    nameChangedAt: Date | null;
}

interface FormState {
    name: string;
    isLoading: boolean;
    error: string | null;
    disabled: boolean;
}

const COOLDOWN_DAYS = 90;

const UserForm = ({ userData }: { userData: UserData }) => {
    const { toast } = useToast();

    const [formState, setFormState] = useState<FormState>({
        name: userData.name,
        isLoading: false,
        error: null,
        disabled: false,
    });

    // Calculate remaining days for username change
    const getRemainingDays = (): number | null => {
        if (!userData.nameChangedAt) return null;
        return COOLDOWN_DAYS - differenceInDays(new Date(), new Date(userData.nameChangedAt));
    };

    // Check if username change is allowed
    useEffect(() => {
        const remainingDays = getRemainingDays();
        if (remainingDays && remainingDays > 0) {
            setFormState(prev => ({ ...prev, disabled: true }));
        }
    }, [userData.nameChangedAt]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormState(prev => ({
            ...prev,
            name: value,
            error: null,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formState.disabled || formState.isLoading) {
            return;
        }

        try {
            setFormState(prev => ({ ...prev, isLoading: true, error: null }));

            const validatedData = userChangeFormSchema.safeParse({
                name: formState.name.trim()
            });

            if (!validatedData.success) {
                throw new Error(validatedData.error.errors[0]?.message || 'Érvénytelen felhasználónév');
            }

            const response = await fetch('/api/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: validatedData.data.name }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Hiba történt a módosítás során');
            }

            const data = await response.json();

            toast({
                title: 'Sikeres módosítás',
                description: data.message || 'A felhasználónév sikeresen módosítva.',
                className: 'border-emerald-hover bg-emerald text-primary',
            });

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Váratlan hiba történt';

            setFormState(prev => ({ ...prev, error: errorMessage }));

            toast({
                title: 'Hiba történt',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setFormState(prev => ({ ...prev, isLoading: false }));
        }
    };

    const remainingDays = getRemainingDays();

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 border border-muted rounded-md p-6"
        >
            <div className="space-y-2">
                <h4 className="font-medium text-sm">Felhasználónév módosítása</h4>

                <Input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Felhasználónév"
                    value={formState.name}
                    onChange={handleChange}
                    disabled={formState.disabled || formState.isLoading}
                    className="text-sm"
                    aria-label="Felhasználónév"
                />

                {formState.disabled && remainingDays ? (
                    <p className="text-red-500 text-xs">
                        {remainingDays} nap múlva módosíthatod újra a felhasználóneved.
                    </p>
                ) : (
                    <p className="text-muted-foreground text-xs">
                        Módosíthatod a felhasználóneved. A következő módosításra {COOLDOWN_DAYS} napot kell várni.
                    </p>
                )}
            </div>

            {formState.error && (
                <Alert variant="destructive">
                    <AlertDescription>{formState.error}</AlertDescription>
                </Alert>
            )}

            <Button
                type="submit"
                className="w-max bg-emerald hover:bg-emerald-hover"
                disabled={formState.disabled || formState.isLoading}
            >
                {formState.isLoading ? (
                    <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Feldolgozás...
          </span>
                ) : (
                    'Mentés'
                )}
            </Button>
        </form>
    );
};

export default UserForm;