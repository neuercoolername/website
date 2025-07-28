import { prisma } from './prisma';

export interface Project {
  id: number;
  title: string;
  meta: string;
  description: string;
  links: string[];
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
      position: {
        x: project.positionX,
        y: project.positionY,
      },
    }));
  }
}
