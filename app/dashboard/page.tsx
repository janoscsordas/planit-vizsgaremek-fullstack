import { auth } from "@/auth"
import { logOut } from "@/actions/user.action"

export default async function Dashboard() {

    const session = await auth()

    if (!session?.user) {
        return <div>Nincs bejelentkezve</div>
    }

    return (
        <div>
            <h1>Dashboard</h1>

            <p>Üdvözöljük {session.user.name}!</p>
            <p>Email cím: {session.user.email}</p>
            <p></p>
            {session.user.image && <img src={session.user.image} alt="Profilkép" width={100} height={100} />}
            <form action={async () => {
                "use server"
                await logOut()
            }}>
                <button type="submit">Kijelentkezés</button>
            </form>
        </div>
    )
}