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
        <div className="flex flex-row items-center justify-between w-full gap-4">
          <div className="flex items-center gap-4">
            <p className="w-24 text-sm font-bold break-words text-primary md:w-auto lg:text-lg">
              {project.name}
            </p>
            <Badge
              color={project.tier === "free" ? "amber" : "violet"}
              className="hidden sm:block"
            >
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
        <div className="transition-opacity duration-300 opacity-0 group-hover:opacity-100">
          <ArrowRight width="20" height="20" className="text-emerald" />
        </div>
      </div>
    </Link>
  )
}

export default ProjectCard
