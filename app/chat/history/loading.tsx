import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@radix-ui/themes"

export default function Loading() {
  return (
    <Skeleton className="flex items-center justify-center w-full h-screen">
      <Spinner size="3" />
    </Skeleton>
  )
}
