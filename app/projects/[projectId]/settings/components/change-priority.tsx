import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface StatusData {
  projectStatus: "active" | "completed" | "archived"
}

export default function ChangePriority({
  projectId,
  statusData,
}: {
  projectId: string
  statusData: StatusData
}) {
  // TODO: change priority
  // (property) status: "active" | "completed" | "archived"
  return (
    <div className="border border-muted rounded-md p-4 mt-6">
      <h4 className="font-medium text-sm">Prioritás megváltoztatása</h4>
      <p className="text-muted-foreground text-xs my-1 mb-4">
        Itt megváltoztathatod a projekt priorításat.
      </p>
      <RadioGroup defaultValue="option-one" className="mt-2">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-one" id="option-one" />
          <Label htmlFor="option-active">Aktív</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-two" id="option-two" />
          <Label htmlFor="option-completed">Elvégzett</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-three" id="option-three" />
          <Label htmlFor="option-archived">Archivált</Label>
        </div>
      </RadioGroup>
    </div>
  )
}
