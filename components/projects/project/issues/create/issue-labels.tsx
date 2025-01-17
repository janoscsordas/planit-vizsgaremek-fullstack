import { Check, X } from "lucide-react"
import { ISSUE_LABELS } from "@/lib/utils/globalVariables"

export default function IssueLabels({
  selectedLabels,
  setSelectedLabels,
  disabled,
}: {
  selectedLabels: string[]
  setSelectedLabels: (labels: string[]) => void
  disabled?: boolean
}) {
  const toggleLabel = (labelName: string) => {
    if (selectedLabels.includes(labelName)) {
      setSelectedLabels(selectedLabels.filter((name) => name !== labelName))
    } else {
      setSelectedLabels([...selectedLabels, labelName])
    }
  }

  return (
    <div className="w-full max-w-2xl py-4 space-y-4">
      <div className="flex flex-wrap gap-2">
        {ISSUE_LABELS.map((label) => (
          <button
            key={label.id}
            onClick={() => toggleLabel(label.name)}
            type="button"
            className={`
                  ${label.color} ${label.textColor}
                  px-3 py-1 rounded-full
                  font-medium text-sm
                  transition-colors duration-200
                  flex items-center gap-1
                `}
            disabled={disabled}
          >
            {label.name}
            {selectedLabels.includes(label.name) ? (
              <X className="w-4 h-4" />
            ) : (
              <Check className="w-4 h-4 opacity-0 group-hover:opacity-100" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <h3 className="mb-2 text-sm font-medium">Kiválasztott címkék:</h3>
        <div className="flex flex-wrap gap-2">
          {selectedLabels.length === 0 ? (
            <span className="italic text-gray-500">
              Nincs címke kiválasztva!
            </span>
          ) : (
            ISSUE_LABELS.filter((label) =>
              selectedLabels.includes(label.name)
            ).map((label) => (
              <span
                key={label.id}
                className={`${label.color} ${label.textColor} px-2 py-0.5 rounded-full text-sm`}
              >
                {label.name}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
