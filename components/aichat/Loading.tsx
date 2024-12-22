import { Spinner } from "@radix-ui/themes";
import { Skeleton } from "../ui/skeleton";

export default function Loading() {

    return (
        <Skeleton className="w-full h-full flex items-center justify-center">
            <Spinner size={"3"} />
        </Skeleton>
    )
}