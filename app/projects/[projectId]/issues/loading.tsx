import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@radix-ui/themes"

export default function Loading() {
  return (
    <Skeleton className="flex flex-col items-center justify-center w-full h-screen">
      <h1 className="text-4xl font-bold">
        <Spinner size="3" className="block mx-auto" />
      </h1>
    </Skeleton>
  )
}
