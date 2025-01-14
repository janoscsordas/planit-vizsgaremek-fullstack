"use client"

import { Button } from "@/components/ui/button"
import { Flex, RadioCards } from "@radix-ui/themes"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function ThemeSwitcherComponent() {
  const { theme, setTheme } = useTheme()
  const [selectedTheme, setSelectedTheme] = useState("system")

  useEffect(() => {
    if (theme) {
      setSelectedTheme(theme)
    }
  }, [theme])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setTheme(selectedTheme)
  }

  return (
    <form className="flex flex-col w-full gap-10 mt-2" onSubmit={handleSubmit}>
      <RadioCards.Root
        defaultValue={theme}
        value={selectedTheme}
        onValueChange={setSelectedTheme}
        color="green"
        columns={{ initial: "1", md: "2", lg: "3" }}
      >
        <RadioCards.Item value="light" className="hover:cursor-pointer">
          <Flex direction="column">
            <Image
              className="rounded-md"
              src="/light-mode.png"
              alt="Világos"
              width={180}
              height={180}
            />
            <h4 className="pt-2 text-sm text-center">Világos</h4>
          </Flex>
        </RadioCards.Item>
        <RadioCards.Item value="dark" className="hover:cursor-pointer">
          <Flex direction="column">
            <Image
              className="rounded-md"
              src="/dark-mode.png"
              alt="Sötét"
              width={180}
              height={180}
            />
            <h4 className="pt-2 text-sm text-center">Sötét</h4>
          </Flex>
        </RadioCards.Item>
        <RadioCards.Item value="system" className="hover:cursor-pointer">
          <Flex direction="column">
            <Image
              className="rounded-md"
              src="/system-mode.png"
              alt="Rendszer"
              width={180}
              height={180}
            />
            <h4 className="pt-2 text-sm text-center">Rendszer</h4>
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
