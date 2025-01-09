import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"

export default function TaskCombobox({
    tasks,
    selectedTaskId,
    setSelectedTaskId,
    disabled
}: {
    tasks: any[]
    selectedTaskId: string
    setSelectedTaskId: (taskId: string) => void
    disabled?: boolean
}) {
    const [open, setOpen] = useState(false)
   
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[350px] justify-between"
            disabled={disabled}
          >
            {selectedTaskId
              ? tasks.find((task) => task.id === selectedTaskId)?.taskName
              : "Válassz feladatot..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[350px] p-0">
          <Command>
            <CommandInput placeholder="Feladat keresése..." className="h-9" />
            <CommandList>
              <CommandEmpty>Nem található ilyen feladat.</CommandEmpty>
              <CommandGroup>
                {tasks.map((task) => (
                  <CommandItem
                    key={task.id}
                    value={task.taskName}
                    onSelect={() => {
                      setSelectedTaskId(task.id)
                      setOpen(false)
                    }}
                  >
                    {task.taskName}
                    <Check
                      className={cn(
                        "ml-auto",
                        selectedTaskId === task.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
}
