"use client"

import React from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { userPasswordChangeSchema } from '@/lib/schemas/userSchema';

const PasswordChangeForm = () => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });

    const [status, setStatus] = useState({
        loading: false,
        error: '',
    });

    const { toast } = useToast();

    const resetForm = () => {
        setFormData({
            password: '',
            confirmPassword: '',
        });
        setStatus({
            loading: false,
            error: '',
        });
    };

    const validatePasswords = async () => {
        if (formData.password !== formData.confirmPassword) {
            throw new Error("A jelszavak nem egyeznek!")
        }

        const validatePasswords = await userPasswordChangeSchema.safeParseAsync(formData)

        if (!validatePasswords.success) {
            throw new Error(validatePasswords.error.errors[0].message)
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (status.error) {
            setStatus(prev => ({ ...prev, error: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            // Set the status to loading
            setStatus({ loading: true, error: '' });

            // Validate inputs
            await validatePasswords();

            // Send POST request to the api endpoint
            const response = await fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            // Check if the response sent back is not OK
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Hiba a jelszó átállítása közben!');
            }

            // Get the data from the response
            const data = await response.json();
                
            // Show success message to the user
            toast({
                title: 'Sikeres jelszóváltoztatás',
                description: data.message || 'A jelszavad sikeresen megváltozott.',
                className: 'bg-emerald text-primary border-emerald-hover',
            });

            // Reset the form
            resetForm();
        } catch (error) {
            // Set status to error with specific or hard coded message
            setStatus({
                loading: false,
                error: error instanceof Error ? error.message : 'Váratlan hiba történt',
            });
            // Reset the password fields
            setFormData(prev => ({
                ...prev,
                password: '',
                confirmPassword: '',
            }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 border border-muted rounded-md p-6">
            <div className="space-y-2">
                <h4 className="font-medium text-sm">Jelszó módosítása</h4>

                <Input
                    type="password"
                    name="password"
                    placeholder="Új jelszó"
                    value={formData.password}
                    onChange={handleChange}
                    className="text-sm"
                    disabled={status.loading}
                    aria-label="Új jelszó"
                />

                <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="Új jelszó megerősítése"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="text-sm"
                    disabled={status.loading}
                    aria-label="Új jelszó megerősítése"
                />
            </div>

            {status.error && (
                <Alert variant="destructive">
                    <AlertDescription>{status.error}</AlertDescription>
                </Alert>
            )}

            <Button
                type="submit"
                className="w-max bg-emerald hover:bg-emerald-hover"
                disabled={status.loading}
            >
                {status.loading ? (
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

export default PasswordChangeForm;