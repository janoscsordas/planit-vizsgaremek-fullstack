import { NextResponse } from 'next/server'
import { getProjectsByUserId, getProjectsWhereUserIsMember } from '@/actions/projects.action'
import { auth } from '@/auth'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: 'Unauthorized' }, 
            { status: 401 }
        )
    }
    
    // Execute both queries in parallel using Promise.all
    const [ownedProjects, memberProjects] = await Promise.all([
        getProjectsByUserId(),
        getProjectsWhereUserIsMember()
    ])
    
    if (!ownedProjects.success || !memberProjects.success) {
      return NextResponse.json(
        { error: "Hiba történt a projektek lekérése során" }, 
        { status: 400 }
      )
    }

    return NextResponse.json({ ownedProjects: ownedProjects.data, memberProjects: memberProjects.data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    )
  }
}