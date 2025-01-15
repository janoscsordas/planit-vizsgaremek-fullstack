import ProfileNavbar from "@/components/profile/profile-navbar"
import ProfileHeader from "../profile-header"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import ThemeSwitcherWrapper from "./theme-switcher-wrapper"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Planitapp - Megjelenés",
  description: "Planitapp - Megjelenés",
  publisher: "Planitapp",
  openGraph: {
    title: "Planitapp - Megjelenés",
    description: "Planitapp - Megjelenés",
    siteName: "Planitapp",
    locale: "hu-HU",
    type: "website",
  },
}

export default async function AppearancePage() {
  const session = await auth()

  if (!session || !session.user) {
    return redirect("/login")
  }

  return (
    <div className="w-[90%] mx-auto pt-8 md:pt-16">
      <ProfileHeader birthDate={null} />
      <div className="flex flex-col md:flex-row">
        <ProfileNavbar />
        <div className="ml-0 md:ml-12 mt-2 w-full md:w-[65%]">
          <h3 className="text-xl font-medium">Megjelenés</h3>
          <p className="pt-2 text-sm text-muted-foreground">
            Itt testreszabhatod az alkalmazás megjelenését.
          </p>
          <hr className="my-6" />
          <div className="p-6 mb-4 border rounded-md border-muted">
            <h4 className="text-sm font-medium">Téma beállítása</h4>
            <p className="mb-6 text-xs text-muted-foreground">
              Válaszd ki az alkalmazás témáját!
            </p>
            <ThemeSwitcherWrapper />
          </div>
        </div>
      </div>
    </div>
  )
}
