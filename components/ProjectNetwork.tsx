'use client';

import { projectData } from '@/data/projects';
import { useAppSelector } from '@/store/hooks';
import ProjectNode from './ProjectNode';

export default function ProjectNetwork() {
  const projects = Object.values(projectData);

  return (
    <div 
      className="relative w-full h-full"
      style={{ pointerEvents: 'none' }}
    >
      {/* Project nodes layer */}
      <div className="relative z-10 w-full h-full" style={{ pointerEvents: 'none' }}>
        {projects.map((project) => (
          <ProjectNode
            key={project.id}
            project={project}
          />
        ))}
      </div>

      {/* Header */}
      <header className="absolute top-8 left-8 z-20">
        <h1 className="text-2xl font-light text-gray-700">
          David Amberg
        </h1>
      </header>
    </div>
  );
}