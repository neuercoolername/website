import { NextResponse } from 'next/server';
import { ProjectService } from '@/lib/projects';

export async function GET() {
  try {
    const projects = await ProjectService.getAllProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}