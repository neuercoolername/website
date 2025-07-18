'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProjects } from '@/store/slices/projectSlice';
import ProjectNode from './ProjectNode';

export default function ProjectNetwork() {
  const dispatch = useAppDispatch();
  const { projects, loading, error } = useAppSelector((state) => state.projects);

  useEffect(() => {
    if (projects.length === 0) {
      dispatch(fetchProjects());
    }
  }, [dispatch, projects.length]);

  if (loading) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="text-gray-500">Loading :)</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

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