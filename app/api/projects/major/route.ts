import { NextResponse } from 'next/server';
import { ProjectService } from '@/lib/projects';

export async function GET() {
  try {
    const projects = await ProjectService.getMajorProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching major projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch major projects' },
      { status: 500 }
    );
  }
}