import {Button, Select, TextField} from "@radix-ui/themes"
import {Filter, Search} from "lucide-react"
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
    <div className="flex items-center gap-4 p-4 w-full sm:w-3/4 mx-auto">
      <Link href="/projects/create">
        <Button
          size="2"
          variant="outline"
          color="green"
          className="bg-[#00A36C] hover:bg-[#00A36C]/50 transition-colors text-primary font-medium w-max cursor-pointer"
        >
          Új projekt
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
          className="appearance-none [&>svg]:hidden"
        />
        <Select.Content color="green">
          <Select.Group>
            <Select.Item value="all">
              <Filter height="18" width="18" />
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
