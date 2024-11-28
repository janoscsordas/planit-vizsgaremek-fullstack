"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/projects/tasks/data-table-view-options"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { priority, status } from "./columns"
import CreateTask from "./CreateTask"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center gap-10 justify-between">
      <div className="flex flex-1 flex-wrap gap-y-4 items-center space-x-2">
        <Input
          placeholder="Feladatok szűrése..."
          value={(table.getState().globalFilter as string) ?? ""}
          onChange={(event) =>
            table.setGlobalFilter(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Státusz"
            options={status}
          />
        )}
        {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Prioritás"
            options={priority}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Visszaállítás
            <X />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <CreateTask />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
