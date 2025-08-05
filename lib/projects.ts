import { prisma } from './prisma';

export interface ProjectLink {
  title: string;
  url: string;
}

export interface Project {
  id: number;
  title: string;
  meta: string;
  description: string;
  links: ProjectLink[];
  tags: string[];
  isMajor: boolean;
  position: {
    x: number;
    y: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export class ProjectService {
  static async getAllProjects(): Promise<Project[]> {
    const projects = await prisma.project.findMany({
      orderBy: { id: 'asc' },
    });

    return projects.map((project) => ({
      ...project,
      links: project.links as unknown as ProjectLink[],
      position: {
        x: project.positionX,
        y: project.positionY,
      },
    }));
  }

  static async getProjectById(id: number): Promise<Project | null> {
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) return null;

    return {
      ...project,
      links: project.links as unknown as ProjectLink[],
      position: {
        x: project.positionX,
        y: project.positionY,
      },
    };
  }

  static async getMajorProjects(): Promise<Project[]> {
    const projects = await prisma.project.findMany({
      where: { isMajor: true },
      orderBy: { id: 'asc' },
    });

    return projects.map((project) => ({
      ...project,
      links: project.links as unknown as ProjectLink[],
      position: {
        x: project.positionX,
        y: project.positionY,
      },
    }));
  }

  static async getProjectsByTag(tag: string): Promise<Project[]> {
    const projects = await prisma.project.findMany({
      where: {
        tags: {
          has: tag,
        },
      },
      orderBy: { id: 'asc' },
    });

    return projects.map((project) => ({
      ...project,
      links: project.links as unknown as ProjectLink[],
      position: {
        x: project.positionX,
        y: project.positionY,
      },
    }));
  }
}
