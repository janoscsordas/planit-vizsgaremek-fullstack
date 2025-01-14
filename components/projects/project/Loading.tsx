import { Spinner } from "@radix-ui/themes"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <Skeleton className="flex items-center justify-center w-full h-full">
      <Spinner size={"3"} />
    </Skeleton>
  )
}
