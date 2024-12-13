import { Button } from "@/components/ui/button";
import { Flex, RadioCards } from "@radix-ui/themes";
import Image from "next/image";

export default function ThemeSwitcherComponent() {
    return (
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
                className="mb-2 bg-emerald hover:bg-emerald-hover w-fit"
                type="submit"
            >
                Változtatások mentése
            </Button>
        </form>
    )
}