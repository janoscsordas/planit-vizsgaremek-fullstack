import { TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@radix-ui/themes";

export default function LoadingComponentForRecentActivity() {
    return (
        <>
            <TableRow>
                <TableCell><Skeleton className="w-full h-8 rounded-md" /></TableCell>
            </TableRow>
            <TableRow>
                <TableCell><Skeleton className="w-full h-8 rounded-md" /></TableCell>
            </TableRow>
            <TableRow>
                <TableCell><Skeleton className="w-full h-8 rounded-md" /></TableCell>
            </TableRow>
            <TableRow>
                <TableCell><Skeleton className="w-full h-8 rounded-md" /></TableCell>
            </TableRow>
            <TableRow>
                <TableCell><Skeleton className="w-full h-8 rounded-md" /></TableCell>
            </TableRow>
        </>
    )
}