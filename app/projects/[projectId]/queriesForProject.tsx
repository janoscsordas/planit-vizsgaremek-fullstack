// app/projects/[projectId]/page.tsx
import { db } from '@/database/index';
import { ProjectsTable } from '@/database/schema/projects';
import { eq } from 'drizzle-orm';

/* -------------------------------------------------------------------------------
    Ez az oldal egy támpont lesz az adatbázis query-khez.
    A projekt és a dolgai így lesznek lekérve!
    Az analitika nem.
    Lentebb sorrol sorra le írtam, hogyan működik a dolog.

    Az alábbi oldalak, a következőt fogják használni:
    áttekintés: Egyiket sem, saját analitika query-t kap majd
    feladatok: Mindent le fog kérni, szóval a lenti példát kell majd alkalmazni
    tagok: A tagok információját kéri le.
    beállítások: Csak a projekthez kapcsolatos dolgokat kéri le

    ------------------------------------------------------------------------------
*/

export default async function ProjectDetailPage({ 
  params 
}: { 
  params: { projectId: string } 
}) {
    // query a projekt táblához
  const project = await db.query.ProjectsTable.findFirst({
    // ahol a params.projectId megegyezik a ProjectsTable.id-vel
    where: eq(ProjectsTable.id, params.projectId),
    // itt adja meg, hogy az ehhez a projekthez tartozó adatokat is vissza adja
    with: {
        // ugye a project members tábla, innen minden tagot aki tagja a projektnek
      members: {
        with: { user: true }
      },
      // a feladatokat
      tasks: {
        with: { 
            // azokat, akik egy feladathoz hozzá vannak csatolva
          assigns: { 
            with: { user: true } 
          } 
        }
      }
    }
  });

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div>
      <h1>{project.name}</h1>
      <h2>Members</h2>
      {project.members.map(member => (
        <div key={member.id}>
          {member.user.name} - {member.role}
        </div>
      ))}
      <h2>Tasks</h2>
      {project.tasks.map(task => (
        <div key={task.id}>
          {task.taskName} - {task.status}
          Assignees: {task.assigns.map(assign => assign.user.name).join(', ')}
        </div>
      ))}
    </div>
  );
}