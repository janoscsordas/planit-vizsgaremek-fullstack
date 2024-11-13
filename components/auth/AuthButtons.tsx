"use client"

import { signIn } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function AuthButtons() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleOAuthSignIn = async (provider: string) => {
    try {
      setIsLoading(true)
      const result = await signIn(provider, {
        redirect: false,
        callbackUrl: '/dashboard' // or wherever you want to redirect after success
      })

      if (result?.error) {
        // Handle the error from auth.ts
        if (result.error.includes('Please sign in with')) {
            toast({
                title: 'Error',
                description: result.error,
                variant: 'destructive',
            })
            return
        } else {
          toast({
            title: 'Error',
            description: 'Hiba történt a bejelentkezés során. Kérjük próbálja újra.',
            variant: 'destructive',
          })
          return
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hiba történt a bejelentkezés során. Kérjük próbálja újra.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        className="w-full"
        type="submit"
        variant="outline"
        onClick={() => handleOAuthSignIn("google")}
        disabled={isLoading}
      >
        <Image src="/google.svg" alt="Google" width={16} height={16} />
        Google
      </Button>

      <Button
        className="w-full"
        type="submit"
        variant="outline"
        onClick={() => handleOAuthSignIn("github")}
        disabled={isLoading}
      >
        <Image src="/github.svg" alt="Github" width={16} height={16} />
        Github
      </Button>
    </div>
  );
} 