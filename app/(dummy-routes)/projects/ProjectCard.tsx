import { Project } from '@/lib/definitions/projects'

type ProjectCardProps = {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div className="p-4 border rounded-md">
      {project.name} 
      {project.createdAt.toString()}
      {project.status}
    </div>
  )
}

export default ProjectCard
