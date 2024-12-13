import ProfileNavbar from "@/components/profile/ProfileNavbar"
import { Button } from "@/components/ui/button"
import { Flex, RadioCards } from "@radix-ui/themes"
import Image from "next/image"
import ProfileHeader from "../ProfileHeader"
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import ThemeSwitcherComponent from "./theme-switcher-form"

export default async function AppearancePage() {
  const session = await auth()

  if (!session || !session.user) {
    return redirect('/login')
  }

  return (
    <div className="w-[90%] mx-auto pt-8 md:pt-16">
      <ProfileHeader />
      <div className="flex flex-col md:flex-row">
        <ProfileNavbar />
        <div className="ml-0 md:ml-12 mt-2 w-full md:w-[65%]">
          <h3 className="text-xl font-medium">Megjelenés</h3>
          <p className="text-muted-foreground text-sm pt-2">
            Itt testreszabhatod az alkalmazás megjelenését.
          </p>
          <hr className="my-6" />
          <div className="border border-muted rounded-md p-6 mb-4">
            <h4 className="font-medium text-sm">Téma beállítása</h4>
            <p className="text-muted-foreground text-xs mb-6">
              Válaszd ki az alkalmazás témáját.
            </p>
            <ThemeSwitcherComponent />
          </div>
        </div>
      </div>
    </div>
  )
}
