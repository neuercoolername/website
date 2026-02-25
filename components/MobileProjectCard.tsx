'use client';

import { Project } from '@/lib/projects';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectProject } from '@/store/slices/portfolioSlice';

interface MobileProjectCardProps {
  project: Project;
}

export default function MobileProjectCard({ project }: MobileProjectCardProps) {
  const dispatch = useAppDispatch();
  const { selectedProject, selectedTag } = useAppSelector(state => state.portfolio);
  const isSelected = selectedProject?.id === project.id;
  const hasSelectedTag = selectedTag && project.tags.includes(selectedTag);

  return (
    <div
      className="relative cursor-pointer"
      onClick={() => dispatch(selectProject({ project, connections: [] }))}
    >
      {/* Shadow face */}
      <div className="absolute inset-0 bg-gray-300/40 translate-x-1 translate-y-1 rounded-lg" />

      {/* Main face */}
      <div className={`relative p-4 backdrop-blur-sm border-2 rounded-lg transition-all duration-200 ${
        isSelected
          ? 'bg-blue-50/90 border-blue-400/70 shadow-lg shadow-blue-200/50'
          : hasSelectedTag
          ? 'bg-orange-50/80 border-orange-300/70'
          : 'bg-white/85 border-gray-300/60'
      }`}>
        <h3 className={`text-sm font-medium leading-tight ${
          isSelected ? 'text-blue-900' : hasSelectedTag ? 'text-orange-900' : 'text-gray-800'
        }`}>
          {project.title}
        </h3>
        <p className={`text-xs mt-0.5 ${
          isSelected ? 'text-blue-700' : hasSelectedTag ? 'text-orange-700' : 'text-gray-500'
        }`}>
          {project.meta}
        </p>

        {isSelected && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm" />
        )}
      </div>
    </div>
  );
}
