import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@radix-ui/themes";

export default function Loading() {

    return (
        <Skeleton className="w-full h-screen flex justify-center items-center">
            <Spinner size="3" />
        </Skeleton>
    )
}