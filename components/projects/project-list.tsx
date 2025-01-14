import { ProjectData } from "@/lib/definitions/projects"
import ProjectCard from "./project-card"
import { Plus } from "lucide-react"
import { Button, Spinner } from "@radix-ui/themes"
import Link from "next/link"
type ProjectListProps = {
  title: string
  projects: ProjectData[]
  isLoading: boolean
  isOwnedProjects: boolean
}

const ProjectList = ({
  title,
  projects,
  isLoading,
  isOwnedProjects,
}: ProjectListProps) => {
  return (
    <section className="flex flex-col gap-4 p-4 mx-auto sm:w-3/4">
      <h2 className="py-4 text-xl font-bold text-primary">{title}</h2>
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-full py-8">
          <Spinner size="3" className="block mx-auto" />
        </div>
      ) : projects.length > 0 ? (
        <div className="flex flex-wrap items-center justify-start w-full gap-4 p-4 mx-auto border-2 border-dashed rounded-lg border-foreground/10">
          <div className="flex flex-col w-full gap-2">
            <div className="flex flex-col flex-wrap gap-4">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center w-full gap-4 p-4 mx-auto border-2 border-dashed rounded-lg border-foreground/10">
          {isOwnedProjects ? (
            <div className="flex flex-col items-center gap-2">
              <p className="text-lg font-medium text-primary">
                Még nem készítettél projektet
              </p>
              <p className="text-sm text-muted-foreground">
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
          ) : (
            <div className="flex flex-col items-center gap-2">
              <p className="text-lg font-medium text-primary">
                Még nem vagy tag egy projektben sem
              </p>
              <p className="text-sm text-muted-foreground">
                Ide kerülnek a projektek, amelyekbe meghívtak
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default ProjectList
