import { Project } from '@/lib/definitions/projects'
import ProjectCard from './ProjectCard'

type ProjectListProps = {
  title: string;
  projects: Project[];
}

const ProjectList = ({ title, projects }: ProjectListProps) => {
  return (
    <section>
        <h2 className="text-xl font-semibold mb-3">{title}</h2>
        {projects.length > 0 && (
            <div className="space-y-2">
                {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        )}
        {projects.length === 0 && <div>Nem található projekt.</div>}
    </section>
  )
}

export default ProjectList
