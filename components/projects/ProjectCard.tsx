import { ProjectData } from "@/lib/definitions/projects"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Badge } from "@radix-ui/themes"

type ProjectCardProps = {
  project: ProjectData
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="p-4 border rounded-md hover:border-emerald group"
    >
      <div className="flex items-center justify-between gap-8">
        <div className="flex flex-row justify-between w-full items-center gap-4">
          <div className="flex items-center gap-4">
            <p className="text-primary text-[1.1rem] font-bold">
              {project.name}
            </p>
            <Badge color={project.tier === "free" ? "amber" : "violet"}>
              {project.tier}
            </Badge>
          </div>
          <Badge
            color={
              project.status === "active"
                ? "green"
                : project.status === "completed"
                ? "blue"
                : "crimson"
            }
          >
            {project.status}
          </Badge>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ArrowRight width="20" height="20" className="text-emerald" />
        </div>
      </div>
    </Link>
  )
}

export default ProjectCard
