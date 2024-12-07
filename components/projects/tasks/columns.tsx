"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"

import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { ArrowDown, ArrowRight, ArrowUp, CircleCheckBig, CircleDashed, Loader } from "lucide-react"
import { Badge } from "@radix-ui/themes"
import {ProjectData} from "@/lib/definitions/projects"

export const status = [
  { value: "pending", label: "Elvégzendő", icon: CircleDashed },
  { value: "in progress", label: "Folyamatban", icon: Loader },
  { value: "finished", label: "Befejezett", icon: CircleCheckBig },
];

export const priority = [
  { value: "low", label: "Alacsony", icon: ArrowDown }, 
  { value: "medium", label: "Közepes", icon: ArrowRight }, 
  { value: "high", label: "Magas", icon: ArrowUp }
]

export const columns: ColumnDef<ProjectData["tasks"][number] & { members: ProjectData["members"], projectOwner: ProjectData["projectOwner"] }>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex h-4 w-4 items-center">
        <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex h-4 w-4 items-center">
        <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "taskName",
    header: ({ column }) => (
      <DataTableColumnHeader className="pl-2" column={column} title="Feladat Címe" />
    ),
    cell: ({ row }) => <div className="pl-2 w-[50%]">{row.getValue("taskName")}</div>,
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
        <div className="flex gap-2 items-center">
          {statusValue.icon && (
            <statusValue.icon className="h-4 w-4" />
          )}
          <Badge color={statusValue.value === "pending" ? "orange" : statusValue.value === "in progress" ? "blue" : "green"}>
            <span>{statusValue.label}</span>
          </Badge>
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
    cell: ({ row }) => <DataTableRowActions row={row} members={row.original.members} projectOwner={row.original.projectOwner} />,
  },
]
