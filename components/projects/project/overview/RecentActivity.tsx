import { fetchRecentActivity } from "@/actions/analytics.action"
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
  
export default async function RecentActivity({projectId}: {projectId: string}) {
  const recentActivity = await fetchRecentActivity(projectId)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Felhasználó</TableHead>
          <TableHead>Aktivitás</TableHead>
          <TableHead>Idő</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentActivity.length > 0 ? recentActivity.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.user.name}</TableCell>
            <TableCell>{item.taskName}</TableCell>
            <TableCell>{formatDistance(new Date(item.createdAt), new Date(), { addSuffix: true, locale: hu })}</TableCell>
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