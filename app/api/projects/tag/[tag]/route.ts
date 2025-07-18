import { NextResponse } from 'next/server';
import { ProjectService } from '@/lib/projects';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tag: string }> }
) {
  try {
    const { tag: tagParam } = await params;
    const tag = decodeURIComponent(tagParam);
    const projects = await ProjectService.getProjectsByTag(tag);
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects by tag:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects by tag' },
      { status: 500 }
    );
  }
}