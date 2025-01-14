"use client"

import { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { z } from 'zod'
import { useRouter } from 'next/navigation'

export default function BirthDateForm({ 
    birthDate 
}: {
    birthDate: Date | null
}) {
    const router = useRouter()
    const [birthDateState, setBirthDateState] = useState<Date | null>(null)

    useEffect(() => {
        if (birthDate) {
            setBirthDateState(birthDate)
        }
    }, [birthDate])

    const handleDateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const birthDate = formData.get('birthDate') as string

        if (Number(birthDate.split('-')[0]) > new Date().getFullYear()) {
            toast.error('A megadott születési dátum nem megengedett!', { duration: 3000 })
            return
        }

        const birthDateObject = new Date(birthDate)

        const validatedBirthDate = z.date().safeParse(birthDateObject)

        if (!validatedBirthDate.success) {
            toast.error('Hibás formátumú születési dátumot adtál meg!', { duration: 3000 })
            return
        }

        const response = await fetch('/api/user/birth-date', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ birthDate: validatedBirthDate.data })
        })

        if (!response.ok) {
            const error = await response.json()
            toast.error(error.error, { duration: 3000 })
            return
        }

        const data = await response.json()

        toast.success(data.message, { duration: 3000 })
        setBirthDateState(validatedBirthDate.data)

        setTimeout(() => {
            router.refresh()
        }, 3000)
    }

    return (
        <section className='border border-muted rounded-md p-6 mt-6'>
            <Label htmlFor="birthDate">Születési dátum</Label>
            {
                birthDateState ? (
                    <>
                        <Input
                            type="date"
                            placeholder="Születési dátum"
                            name="birthDate"
                            id="birthDate"
                            value={birthDateState.toISOString().split('T')[0]}
                            disabled
                            readOnly
                            className='cursor-not-allowed selection:bg-emerald'
                        />
                        <p className='text-muted-foreground text-xs mt-1'>Ez a beállított születési dátumod!</p>
                    </>
                ) : (
                    <form onSubmit={handleDateSubmit}>
                        <Input 
                            type="date" 
                            placeholder="Születési dátum" 
                            name="birthDate"
                            id="birthDate" 
                            disabled={birthDateState ? true : false}
                        />
                        <p className='text-muted-foreground text-xs mt-1'>A születési dátumod csak egyszer tudod megadni!</p>
                        <Button type='submit' className='mt-4 bg-emerald hover:bg-emerald-hover'>Mentés</Button>
                    </form>
                )
            }
        </section>
    )
}