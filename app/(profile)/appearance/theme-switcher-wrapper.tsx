"use client"

import dynamic from "next/dynamic"

const ThemeSwitcher = dynamic(() => import("./theme-switcher-form"), {
  ssr: false,
})

export default function ThemeSwitcherWrapper() {
  return <ThemeSwitcher />
}
