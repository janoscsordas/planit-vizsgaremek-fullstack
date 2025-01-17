import { auth } from "@/auth"
import ProjectHeader from "../header"
import AddMemberForm from "@/components/projects/project/members/add-member-form"
import MemberComponent from "@/components/projects/project/members/member-component"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { db } from "@/database"
import { ProjectsTable } from "@/database/schema/projects"
import { eq } from "drizzle-orm"
import { Suspense } from "react"
import { notFound, redirect } from "next/navigation"
import { formatDate } from "date-fns"
import { Avatar } from "@radix-ui/themes"
import KickMemberComponent from "@/components/projects/project/members/kick-member-component"
import { Metadata } from "next"

interface PageProps {
  projectId: string
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projectId: string }>
}): Promise<Metadata> {
  const { projectId } = await params

  const projectData = await db.query.ProjectsTable.findFirst({
    columns: {
      name: true,
    },
    where: eq(ProjectsTable.id, projectId),
  })

  const projectName = projectData?.name || "Projekt"

  return {
    title: `Planitapp - ${projectName} - Tagok`,
    description: `${projectName} projekt tagjainak kezelése`,
    publisher: "Planitapp",
    openGraph: {
      title: `Planitapp - ${projectName} - Tagok`,
      description: `${projectName} projekt tagjainak kezelése`,
      siteName: "Planitapp",
      locale: "hu-HU",
      type: "website",
    },
  }
}

export default async function Members({
  params
}: {
  children: React.ReactNode
  params: PageProps
}) {
  const session = await auth()

  if (!session || !session.user) {
    return redirect("/login")
  }

  const { projectId } = params

  const projectData = await db.query.ProjectsTable.findFirst({
    where: eq(ProjectsTable.id, projectId),
    with: {
      members: {
        columns: {
          userId: true,
          projectId: true,
          id: true,
          role: true,
          addedAt: true,
        },
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      owner: {
        columns: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  })

  if (!projectData) {
    return notFound()
  }

  const isOwner = projectData.userId === session.user.id

  return (
    <>
      <ProjectHeader
        breadCrumb={[
          {
            label: projectData.name,
            href: `/projects/${projectData.id}`,
          },
          {
            label: "Tagok",
            href: `/projects/${projectData.id}/members`,
            active: true,
          },
        ]}
      />
      <main className="px-6 py-2">
        <h1 className="text-2xl font-bold">Tagok</h1>
        <div className="mt-8 border p-4 rounded-xl w-full lg:w-[75%]">
          <h1 className="mb-1 font-bold text-md">Projekt tagjai</h1>
          {isOwner ? (
            <>
              <p className="text-sm text-muted-foreground">
                Adj hozzá tagokat a projektedhez!
              </p>
              <p className="mb-4 text-sm text-muted-foreground">
                Ha el szeretnél távolítani valakit, kattints a profilképére!
              </p>
              <Suspense fallback={<Skeleton className="w-full h-[35px]" />}>
                <AddMemberForm projectId={projectData.id} />
              </Suspense>
            </>
          ) : (
            <p className="mb-4 text-sm text-muted-foreground">
              Itt láthatod a projekt tagjait
            </p>
          )}
          <Separator orientation="horizontal" className="mt-6 mb-4" />
          <MemberComponent
            ownerId={projectData.owner.id}
            image={projectData.owner.image}
            name={projectData.owner.name}
            email={projectData.owner.email}
            role="owner"
          />
          {projectData.members &&
            projectData.members.map((member) =>
              isOwner ? (
                <div className="flex items-center mt-6" key={member.id}>
                  <span className="flex items-center justify-center overflow-hidden rounded-full shrink-0 h-9 w-9">
                    <KickMemberComponent
                      memberId={member.id}
                      memberName={member.user.name!}
                      projectId={projectData.id}
                    >
                      <button>
                        <Avatar
                          radius="full"
                          src={member.user.image || ""}
                          alt={member.user.name || ""}
                          fallback={member.user.name?.charAt(0) || ""}
                        />
                      </button>
                    </KickMemberComponent>
                  </span>
                  <div className="ml-4 space-y-1">
                    <p className="flex items-center gap-1 text-sm font-medium leading-none tracking-tighter">
                      {member.user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {member.user.email}
                    </p>
                    {member.addedAt && (
                      <p className="text-xs text-emerald">
                        Csatlakozott: {formatDate(member.addedAt, "yyyy.MM.dd")}
                      </p>
                    )}
                  </div>
                  <div className="px-2 py-1 ml-auto text-xs font-medium border rounded-lg">
                    {(member.role === "admin" && "Admin") || "Tag"}
                  </div>
                </div>
              ) : (
                <MemberComponent
                  key={member.id}
                  image={member.user.image}
                  name={member.user.name}
                  email={member.user.email}
                  role={member.role}
                  addedAt={member.addedAt}
                />
              )
            )}
          {!projectData.members.length && (
            <p className="mt-6 text-sm text-muted-foreground">
              Jelenleg nincs tagja a projektednek. Hívj meg valakit a
              folytatáshoz!
            </p>
          )}
        </div>
      </main>
    </>
  )
}
