import { type RecentActivity } from "@/lib/definitions/analytics"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDistance } from "date-fns"
import { hu } from "date-fns/locale/hu"

export default function RecentActivity({
  recentActivity,
}: {
  recentActivity: RecentActivity[]
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Felhasználó</TableHead>
          <TableHead>Aktivitás</TableHead>
          <TableHead className="text-right">Idő</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentActivity.length > 0 ? (
          recentActivity.map((item) => (
            <TableRow key={item.id}>
              <TableCell
                title={item.user.name}
                className="text-[12px] font-medium sm:text-sm"
                style={{
                  maxWidth: "calc(var(--vw) * 20)",
                }}
              >
                {item.user.name}
              </TableCell>
              <TableCell
                title={item.taskName}
                className="break-words text-ellipsis overflow-hidden text-[12px] sm:text-sm"
                style={{
                  maxWidth: "calc(var(--vw) * 30)",
                }}
              >
                {item.taskName}
              </TableCell>
              <TableCell className="text-[12px] text-right sm:text-sm">
                {formatDistance(new Date(item.createdAt), new Date(), {
                  addSuffix: true,
                  locale: hu,
                })}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              className="font-medium text-center text-muted-foreground"
              colSpan={3}
            >
              Nincs adat. Készíts új feladatot!
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
