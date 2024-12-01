import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
  
const recentActivity = [
    { user: "Alice", task: "Updated project timeline", timestamp: "2 hours ago" },
    { user: "Bob", task: "Completed task: Design mockups", timestamp: "4 hours ago" },
    { user: "Charlie", task: "Added new task: Client meeting", timestamp: "Yesterday" },
    { user: "David", task: "Commented on: Bug fix #123", timestamp: "2 days ago" },
    { user: "Eve", task: "Assigned task to: Frank", timestamp: "3 days ago" },
]
  
export default function RecentActivity() {
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
          {recentActivity.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.user}</TableCell>
              <TableCell>{item.task}</TableCell>
              <TableCell>{item.timestamp}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
}