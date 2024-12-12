import {Skeleton} from "@/components/ui/skeleton";
import {Spinner} from "@radix-ui/themes";

export default function Loading() {
    return (
        <Skeleton className="flex items-center justify-center flex-col w-full h-screen">
            <h1 className="text-4xl font-bold">
                <Spinner size="3" className="block mx-auto" />
            </h1>
        </Skeleton>
    )
}