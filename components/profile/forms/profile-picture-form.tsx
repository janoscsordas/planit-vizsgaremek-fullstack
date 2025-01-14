"use client"

import { useToast } from "@/hooks/use-toast"
import { UploadDropzone } from "@/lib/utils/uploadthing"
import { differenceInDays } from "date-fns"
import { Loader2Icon } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProfilePictureForm({
  imageChangedAt,
  userId,
}: {
  imageChangedAt: Date | null
  userId: string
}) {
  const { toast } = useToast()
  const router = useRouter()

  return (
    <section className="p-4 mt-6 border rounded-md border-muted">
      <h4 className="text-sm font-medium">Profilkép</h4>
      <p className="mt-1 mb-3 text-[.8rem] text-muted-foreground">
        Itt tudsz újat beállítani:
      </p>
      <UploadDropzone
        disabled={
          imageChangedAt
            ? differenceInDays(new Date(), imageChangedAt) < 90
            : false
        }
        content={{
          button({ ready, isUploading }) {
            if (ready) return <div>Kép feltöltése</div>
            if (isUploading)
              return (
                <div className="flex items-center gap-2">
                  <Loader2Icon className="animate-spin" /> Feltöltés...
                </div>
              )

            return "Betöltés..."
          },
          allowedContent({ ready, fileTypes, isUploading, files }) {
            if (!ready) return "Engedélyezett fájltípusok keresése"
            if (isUploading) return "Úgy tűnik valamit éppen feltöltesz"
            return `Fájl, amit feltölthetsz: ${fileTypes.join(", ")}. Max 2MB`
          },
          label({ ready, isDragActive }) {
            if (
              imageChangedAt &&
              differenceInDays(new Date(), imageChangedAt) < 90
            )
              return `Legközelebb csak ${(90 - differenceInDays(new Date(), imageChangedAt)).toString()} nap múlva módosíthatod a profilképedet!`
            if (!ready) return "Adatok és egyebek betöltése"
            if (isDragActive) return "Igen, ide húzd a képet!"
            return "Kattints ide, vagy húzd ide a feltölteni kívánt képet"
          },
        }}
        className={`ut-button:bg-emerald ut-button:text-primary-foreground ut-button:font-sans ${imageChangedAt && differenceInDays(new Date(), imageChangedAt) < 90 ? "ut-button:cursor-not-allowed ut-button:bg-emerald-hover ut-label:cursor-not-allowed pointer-events-none" : ""}`}
        endpoint="imageUploader"
        onClientUploadComplete={async (res) => {
          // Calling the API Route
          const response = await fetch("/api/user/profile-picture", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fileUrl: res[0].url,
              uploadedBy: userId,
            }),
          })

          // Checking if the response is not OK
          if (!response.ok) {
            const error = await response.json()
            throw new Error(
              error.message || "Hiba történt a profilképék módosítása közben!"
            )
          }

          const data = await response.json()

          // Displaying the success message
          toast({
            title: "Sikeres profilkép módosítás!",
            description: data.message,
            duration: 3000,
            className:
              "bg-emerald-hover border-emerald text-primary-foreground font-sans",
          })

          setTimeout(() => {
            router.refresh()
          }, 3000)
        }}
        onUploadError={(error: Error) => {
          // Displaying the error with a toast message
          toast({
            title: "Hiba történt!",
            description: error.message,
            variant: "destructive",
            duration: 3000,
          })
        }}
      />
    </section>
  )
}
