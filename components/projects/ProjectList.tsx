import { Project } from "@/lib/definitions/projects"
import ProjectCard from "./ProjectCard"
import { Plus } from "lucide-react"
import { Button } from "@radix-ui/themes"
import Link from "next/link"
type ProjectListProps = {
  title: string
  projects: Project[]
}

const ProjectList = ({ title, projects }: ProjectListProps) => {
  return (
    <section className="flex flex-wrap gap-4 p-4 sm:w-3/4 mx-auto">
      <h2 className="text-primary text-xl py-4 font-bold">{title}</h2>
      {projects.length > 0 && (
        <div className="flex flex-wrap justify-start items-center gap-4 p-4 mx-auto w-full border-2 border-dashed border-foreground/10 rounded-lg">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-wrap flex-col gap-4">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </div>
      )}
      {projects.length === 0 && (
        <div className="flex flex-wrap justify-center items-center gap-4 p-4 mx-auto w-full border-2 border-dashed border-foreground/10 rounded-lg">
          <div className="flex flex-col gap-2 items-center">
            <p className="text-primary text-lg font-medium">
              Még nem készítettél projektet
            </p>
            <p className="text-muted-foreground text-md">
              Készíts egy új projektet
            </p>
            <Link href="/projects/create">
              <Button
                size="2"
                variant="outline"
                color="green"
                className="bg-[#00A36C] hover:bg-[#00A36C]/90 text-primary font-medium w-max mt-2 cursor-pointer"
              >
                <Plus width="14" height="14" />
                Új projekt
              </Button>
            </Link>
          </div>
        </div>
      )}
    </section>
  )
}

export default ProjectList
