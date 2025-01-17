"use client"

import { TextField } from "@radix-ui/themes"
import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useDebounce } from "use-debounce"

export default function IssuesSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [debouncedQuery] = useDebounce(searchQuery, 300)

  // Memoized URL update function
  const updateURL = useCallback(
    (query: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (query) {
        params.set("q", query)
      } else {
        params.delete("q")
      }

      router.replace(`?${params.toString()}`, { scroll: false })
    },
    [searchParams, router]
  )

  // Update URL whenever debounced value changes
  useEffect(() => {
    updateURL(debouncedQuery)
  }, [debouncedQuery, updateURL])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <TextField.Root
      name="search"
      id="search"
      value={searchQuery}
      onChange={handleSearch}
      placeholder="Problémák keresése..."
      className="my-3"
      color="green"
    >
      <TextField.Slot>
        <Search className="w-4 h-4" />
      </TextField.Slot>
    </TextField.Root>
  )
}
