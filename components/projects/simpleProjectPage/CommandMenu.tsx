"use client"

import * as React from "react"
import { Calculator, Calendar, Monitor, Smile, User } from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Link from "next/link"

export default function CommandMenu() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <p className="text-sm text-muted-foreground">
        Parancs Menü{" "}
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>J
        </kbd>
      </p>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogHeader className="sr-only">
          <DialogTitle>Parancsok</DialogTitle>
          <DialogDescription>Parancsok keresése</DialogDescription>
        </DialogHeader>
        <CommandInput placeholder="Parancs keresése..." />
        <CommandList>
          <CommandEmpty>Nincs találat.</CommandEmpty>
          <CommandGroup heading="Projekt">
            <CommandItem>
              <Calendar />
              <span>Naptár</span>
            </CommandItem>
            <CommandItem>
              <Smile />
              <span>Emoji keresés</span>
            </CommandItem>
            <CommandItem>
              <Calculator />
              <span>Kalkulátor</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Profil">
            <Link href="/profile">
              <CommandItem>
                <User />
                <span>Profil beállítások</span>
              </CommandItem>
            </Link>
            <Link href="/appearance">
              <CommandItem>
                <Monitor />
                <span>Megjelenés</span>
              </CommandItem>
            </Link>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
