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
import LoadingComponentForRecentActivity from "./LoadingComponent"
  
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
        {recentActivity ? recentActivity.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.user.name}</TableCell>
            <TableCell>{item.taskName}</TableCell>
            <TableCell>{formatDistance(new Date(item.createdAt), new Date(), { addSuffix: true, locale: hu })}</TableCell>
          </TableRow>
        )) : (
          <LoadingComponentForRecentActivity />
        )}
      </TableBody>
    </Table>
  )
}