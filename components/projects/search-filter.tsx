import { Button, Select, TextField } from "@radix-ui/themes"
import { Filter, PlusIcon, Search } from "lucide-react"
import Link from "next/link"

type SearchFiltersProps = {
  searchTerm: string
  statusFilter: string
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
}

export default function SearchFilter({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusChange,
}: SearchFiltersProps) {
  return (
    <div className="flex items-center w-full gap-4 p-4 mx-auto sm:w-3/4">
      <Link href="/projects/create">
        <Button
          size="2"
          variant="soft"
          color="green"
          className="bg-[#006642] hover:bg-[#00A36C]/50 transition-colors text-primary text-xs md:text-sm font-medium w-fit hover:cursor-pointer"
          aria-label="Új projekt készítése"
        >
          <PlusIcon className="w-4 h-4 block sm:hidden" />
          <span className="hidden sm:block">Új projekt</span>
        </Button>
      </Link>

      <TextField.Root
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Projekt keresése..."
        radius="large"
        size="2"
        color="green"
        name="search"
        id="search"
      >
        <TextField.Slot>
          <Search height="16" width="16" />
        </TextField.Slot>
      </TextField.Root>

      <Select.Root
        defaultValue={statusFilter}
        onValueChange={(value) => onStatusChange(value)}
        size="2"
      >
        <Select.Trigger
          variant="soft"
          color="green"
          className="appearance-none [&>svg]:hidden hover:cursor-pointer"
          aria-label="Filter projekt"
        />
        <Select.Content color="green" aria-label="Filter projekt">
          <Select.Group>
            <Select.Item value="all">
              <Filter height="18" width="18" aria-label="Filter projekt" />
            </Select.Item>
            <Select.Item value="active">Aktív</Select.Item>
            <Select.Item value="completed">Befejezett</Select.Item>
            <Select.Item value="archived">Archivált</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </div>
  )
}
