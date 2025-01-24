import { auth } from "@/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/database"
import { UsersTable } from "@/database/schema/user"
import { formatDate } from "date-fns"
import { hu } from "date-fns/locale"
import { eq } from "drizzle-orm"
import { ArrowLeft, Cake, Calendar, Mail } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import BackButton from "./back-button"


export default async function ProfilePage({
    params,
}: {
    params: any
}) {
    const session = await auth()

    if (!session || !session.user) {
        return redirect("/login")
    }

    const { userId } = params

    const user = await db.query.UsersTable.findFirst({
        where: eq(UsersTable.id, userId),
        columns: {
            id: true,
            name: true,
            image: true,
            birthDate: true,
            email: true,
            tier: true,
            createdAt: true
        }
    })

    if (!user) {
        return notFound()
    }

    const isUsersOwnPage = user.id === session.user.id

    return (
        <div className="container mx-auto py-8">
            <header className="mb-16 w-full">
                <BackButton />
            </header>
            <Card className="w-[90%] md:max-w-2xl mx-auto">
                <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="w-24 h-24">
                    <AvatarImage src={user.image || ""} alt={user?.name!} />
                    <AvatarFallback>
                    {user.name!
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <CardTitle className="text-2xl">{user.name}</CardTitle>
                    <p className="text-muted-foreground">@{user.name}</p>
                </div>
                {isUsersOwnPage && (
                    <Link href={`/profile`}>
                        <Button>Profil Szerkesztése</Button>
                    </Link>
                )}
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col items-start gap-2 sm:gap-0 sm:flex-row sm:items-center sm:space-x-4 text-sm text-muted-foreground">
                        {user.birthDate && (
                            <span className="flex items-center">
                                <Cake className="mr-1 h-4 w-4" />
                                {formatDate(user.birthDate, "yyyy-MM-dd", { locale: hu })}
                            </span>
                        )}
                        <span className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4" />
                            Csatlakozott {formatDate(user.createdAt, "MMMM yyyy", { locale: hu })}
                        </span>
                    </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                    <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${user.email}`} className="text-sm hover:underline">
                            {user.email}
                        </a>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}