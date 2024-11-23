import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function ProfileHeader() {
  return (
    <>
      <section className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Fiókbeállítások</h2>
          <p className="text-muted-foreground pt-2">
            Fiókbeállítások kezelése és testreszabása.
          </p>
        </div>
        <Link href="/projects">
          <Button variant="outline">
            <ChevronLeft /> Vissza a projektekhez
          </Button>
        </Link>
      </section>
      <hr className="my-6" />
    </>
  )
}
