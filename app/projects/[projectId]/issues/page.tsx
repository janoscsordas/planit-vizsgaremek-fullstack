import { ProjectsTable } from "@/database/schema/projects";
import { eq } from "drizzle-orm";
import ProjectHeader from "../header";
import { db } from "@/database";
import { notFound } from "next/navigation";

export default async function Page({
    params
}: {
    params: Promise<{ projectId: string }>
}) {
    const { projectId } = await params;

    const projectData = await db.query.ProjectsTable.findFirst({
        columns: {
            id: true,
            userId: true,
            name: true,
        },
        where: eq(ProjectsTable.id, projectId),
    });

    if (!projectData) {
        return notFound();
    }

    return (
        <>
          <ProjectHeader
            breadCrumb={[
              {
                label: projectData.name,
                href: `/projects/${projectData.id}`,
              },
              {
                label: "Issues",
                href: `/projects/${projectData.id}/issues`,
                active: true,
              },
            ]}
          />
          <main className="px-6 py-2">
            <div>
              Hamarosan...
            </div>
          </main>
        </>
    )
} 