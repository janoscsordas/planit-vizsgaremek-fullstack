import { auth } from "@/auth"
import { db } from "@/database"
import { UsersTable } from "@/database/schema/user"
import { differenceInDays } from "date-fns"
import { eq } from "drizzle-orm"
import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"

const f = createUploadthing()

export const ourFileRouter = {
    imageUploader: f({
        image: {
            maxFileSize: "2MB",
            maxFileCount: 1,
        }
    })
    .middleware(async () => {
        // get user session
        const session = await auth()

        // checking if the user is logged in
        if (!session || !session.user) {
            throw new UploadThingError({
                code: "FORBIDDEN",
                message: "Nem vagy bejelentkezve",
            })
        }

        const [imageChangedAt] = await db
            .select()
            .from(UsersTable)
            .where(eq(UsersTable.id, session.user.id))
            .limit(1)

        if (imageChangedAt.imageChangedAt && differenceInDays(new Date(), imageChangedAt.imageChangedAt) < 90) {
            throw new UploadThingError({
                code: "FORBIDDEN",
                message: `Legközelebb csak ${90 - differenceInDays(new Date(), imageChangedAt.imageChangedAt)} nap múlva módosíthatod a profilképet!`,
            })
        }

        // returning userId for metadata in the onUploadComplete
        return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
        // Whatever is returned here gets sent to the client side 'onClientUploadComplete' callback
        return { fileUrl: file.url, uploadedBy: metadata.userId }
    })
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter