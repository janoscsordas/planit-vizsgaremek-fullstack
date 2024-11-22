"use client"

import React from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

    const validatePasswords = () => {
        if (!formData.password || !formData.confirmPassword) {
            throw new Error('Minden adatmezőt ki kell tölteni!');
        }

        if (formData.password !== formData.confirmPassword) {
            throw new Error('Nem egyeznek a megadott jelszavak!');
        }

        // Add password strength validation here if needed
        if (formData.password.length < 8) {
            throw new Error('A jelszónak legalább 8 karakter hosszúnak kell lennie!');
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
            setStatus({ loading: true, error: '' });

            // Validate inputs
            validatePasswords();

            const response = await fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Hiba a jelszó átállítása közben!');
            }

            const data = await response.json();

            toast({
                title: 'Sikeres jelszóváltoztatás',
                description: data.message || 'A jelszavad sikeresen megváltozott.',
                className: 'bg-emerald text-primary border-emerald-hover',
            });

            resetForm();
        } catch (error) {
            setStatus({
                loading: false,
                error: error instanceof Error ? error.message : 'Váratlan hiba történt',
            });
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