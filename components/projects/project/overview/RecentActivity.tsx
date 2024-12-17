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
  
export default function RecentActivity({ recentActivity }: { recentActivity: RecentActivity[] }) {
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
        {recentActivity.length > 0 ? recentActivity.map((item) => (
          <TableRow key={item.id}>
            <TableCell title={item.user.name} className="font-medium">{item.user.name.slice(0, 20) + (item.user.name.length > 20 ? "..." : "")}</TableCell>
            <TableCell title={item.taskName}>{item.taskName.slice(0, 50) + (item.taskName.length > 50 ? "..." : "")}</TableCell>
            <TableCell className="text-right">{formatDistance(new Date(item.createdAt), new Date(), { addSuffix: true, locale: hu })}</TableCell>
          </TableRow>
        )) : (
          <TableRow>
            <TableCell className="font-medium text-center text-muted-foreground" colSpan={3}>Nincs adat. Készíts új feladatot.</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}