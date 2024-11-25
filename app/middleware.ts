// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/database/index';
import { 
  ProjectsTable, 
  ProjectMembersTable 
} from '@/database/schema/projects';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/auth';

// middleware for checking if user has access to specific project
export async function middleware(req: NextRequest) {
  const session = await auth()
  
  if (!session || !session.user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Check if route is a project page
  const projectId = req.nextUrl.pathname.split('/')[2];
  
  if (projectId) {
    const [projectAccess] = await db
      .select({
        isOwner: eq(ProjectsTable.userId, session.user.id as string),
        isMember: ProjectMembersTable.id
      })
      .from(ProjectsTable)
      .leftJoin(
        ProjectMembersTable, 
        and(
          eq(ProjectMembersTable.projectId, projectId),
          eq(ProjectMembersTable.userId, session.user.id as string)
        )
      )
      .where(eq(ProjectsTable.id, projectId))
      .limit(1);

    if (!projectAccess?.isOwner && !projectAccess?.isMember) {
      return NextResponse.redirect(new URL('/projects', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/projects/:path*'
}