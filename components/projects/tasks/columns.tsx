"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { ArrowDown, ArrowRight, ArrowUp, CircleCheckBig, CircleDashed, Loader } from "lucide-react"

type Task = {
  id: string
  taskName: string
  taskDescription: string
  status: "pending" | "in progress" | "finished"
  createdAt: Date
  priority: "low" | "medium" | "high"
}

export const status = [
  { value: "pending", label: "Függőben", icon: CircleDashed },
  { value: "in progress", label: "Folyamatban", icon: Loader },
  { value: "finished", label: "Befejezett", icon: CircleCheckBig },
];

export const priority = [
  { value: "low", label: "Alacsony", icon: ArrowDown }, 
  { value: "medium", label: "Közepes", icon: ArrowRight }, 
  { value: "high", label: "Magas", icon: ArrowUp }
]

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "taskName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Feladat Címe" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("taskName")}</div>,
    enableSorting: true,
    enableHiding: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Státusz" />
    ),
    cell: ({ row }) => {
      const statusValue = status.find(
        (status) => status.value === row.getValue("status")
      );

      if (!statusValue) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {statusValue.icon && (
            <statusValue.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{statusValue.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prioritás" />
    ),
    cell: ({ row }) => {
      const priorities = priority.find(
        (priority) => priority.value === row.getValue("priority")
      )

      if (!priorities) {
        return null
      }

      return (
        <div className="flex items-center">
          {priorities.icon && (
            <priorities.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{priorities.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
