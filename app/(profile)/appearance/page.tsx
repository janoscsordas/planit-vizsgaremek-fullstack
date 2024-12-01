import ProfileNavbar from "@/components/profile/ProfileNavbar"
import { Button } from "@/components/ui/button"
import { Flex, RadioCards } from "@radix-ui/themes"
import Image from "next/image"
import ProfileHeader from "../ProfileHeader"

export default function AppearancePage() {
  return (
    <div className="w-[90%] mx-auto pt-8 md:pt-16">
      <ProfileHeader />
      <div className="flex flex-col md:flex-row">
        <ProfileNavbar />
        <div className="ml-0 md:ml-12 mt-2 w-full md:w-[50%]">
          <h3 className="text-xl font-medium">Megjelenés</h3>
          <p className="text-muted-foreground text-sm pt-2">
            Itt testreszabhatod az alkalmazás megjelenését.
          </p>
          <hr className="my-6" />
          <div className="space-y-4 border border-muted rounded-md p-6">
            <h4 className="font-medium text-sm">Téma beállítása</h4>
            <p className="text-muted-foreground text-xs pt-2 mb-3">
              Válaszd ki az alkalmazás témáját.
            </p>
            <form className="flex flex-col gap-10 mt-2 w-full">
              <RadioCards.Root
                defaultValue="light"
                color="green"
                columns={{ initial: "1", md: "2", lg: "3" }}
              >
                <RadioCards.Item value="light" className="">
                  <Flex direction="column">
                    <Image
                      className="rounded-md"
                      src="/lightMode.png"
                      alt="Világos"
                      width={180}
                      height={180}
                    />
                    <h4 className="text-sm text-center pt-2">Világos</h4>
                  </Flex>
                </RadioCards.Item>
                <RadioCards.Item value="dark" className="">
                  <Flex direction="column">
                    <Image
                      className="rounded-md"
                      src="/darkMode.png"
                      alt="Sötét"
                      width={180}
                      height={180}
                    />
                    <h4 className="text-sm text-center pt-2">Sötét</h4>
                  </Flex>
                </RadioCards.Item>
                <RadioCards.Item value="system" className="">
                  <Flex direction="column">
                    <Image
                      className="rounded-md"
                      src="/darkMode.png"
                      alt="Rendszer"
                      width={180}
                      height={180}
                    />
                    <h4 className="text-sm text-center pt-2">Rendszer</h4>
                  </Flex>
                </RadioCards.Item>
              </RadioCards.Root>
              <Button
                className="mb-10 bg-emerald hover:bg-emerald-hover w-fit"
                type="submit"
              >
                Változtatások mentése
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
