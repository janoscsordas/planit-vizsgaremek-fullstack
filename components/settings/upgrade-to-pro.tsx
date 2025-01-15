import { Button } from "@/components/ui/button"

export default function UpgradeToPro() {
  return (
    <form action="">
      <div className="p-4 mt-6 border rounded-md">
        <div className="space-y-2">
          <h1 className="text-sm font-medium">Szolgáltatás módosítása</h1>
          <Button disabled title="Változtatás Pro-ra" variant="outline">
            <h2 className="text-sm font-medium">Váltás Pro-ra</h2>
          </Button>
          <p className="text-xs text-muted-foreground">
            A Pro szolgáltatás jelenleg még nem elérhető!
          </p>
        </div>
      </div>
    </form>
  )
}
