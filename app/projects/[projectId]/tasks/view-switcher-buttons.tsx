import { Grid, List } from "lucide-react";

export default function ViewSwitcherButtons({ viewMode, handleViewChange }: { viewMode: string, handleViewChange: (option: string) => void }) {

    return (
        <div className=" flex items-center gap-4">
          <button
            onClick={() => handleViewChange("list")}
            className={`p-2 rounded ${
              viewMode === "list" ? "bg-emerald-hover" : "hover:bg-emerald-hover"
            }`}
            title="List View"
          >
            <List
              className={`w-4 h-4 ${
                viewMode === "list" ? "text-primary" : "text-white"
              }`}
            />
          </button>
          <button
            onClick={() => handleViewChange("kanbantable")}
            className={`p-2 rounded ${
              viewMode === "kanbantable" ? "bg-emerald-hover" : "hover:bg-emerald-hover"
            }`}
            title="Grid View"
          >
            <Grid
              className={`w-4 h-4 ${
                viewMode === "kanbantable" ? "text-primary" : "text-white"
              }`}
            />
          </button>
        </div>
    )
}