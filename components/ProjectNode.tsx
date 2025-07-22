'use client';

import { Project } from '@/lib/projects';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectProject, hoverProject } from '@/store/slices/portfolioSlice';
import { addMessage } from '@/store/slices/consoleSlice';
import { createInteractionDetails } from '@/utils/domUtils';

interface ProjectNodeProps {
  project: Project;
}

export default function ProjectNode({ project }: ProjectNodeProps) {
  const dispatch = useAppDispatch();
  const { hoveredProject, selectedProject } = useAppSelector(state => state.portfolio);

  const handleClick = (event: React.MouseEvent) => {
    dispatch(selectProject({ 
      project, 
      connections: [] 
    }));
    
    // Capture React event info before it gets nullified
    const reactCurrentTarget = event.currentTarget;
    const nativeEvent = event.nativeEvent;
    // Temporarily set currentTarget on native event
    Object.defineProperty(nativeEvent, 'currentTarget', {
      value: reactCurrentTarget,
      configurable: true
    });
    
    const details = createInteractionDetails(nativeEvent, 'click');
    const target = details.domElement?.selector || 'unknown element';
    const bubbleInfo = details.currentTarget && details.currentTarget.selector !== details.domElement?.selector
      ? `, bubbled up to <span class="dom-selector">${details.currentTarget.selector}</span>` 
      : '';
    dispatch(addMessage({
      content: `click event originated at <span class="dom-selector">${target}</span>${bubbleInfo}`,
      type: 'interaction',
      details
    }));
  };

  const handleMouseEnter = () => {
    dispatch(hoverProject({ 
      projectId: project.id, 
      connections: [] 
    }));
  };

  const handleMouseLeave = () => {
    dispatch(hoverProject({ 
      projectId: null, 
      connections: [] 
    }));
  };

  const isHovered = hoveredProject === project.id;
  const isSelected = selectedProject?.id === project.id;

  return (
    <div
      className={`project-node absolute cursor-pointer transition-all duration-300 ${
        project.isMajor ? 'w-48 h-32' : 'w-40 h-24'
      }`}
      style={{
        left: `${project.position.x}%`,
        top: `${project.position.y}%`,
        transform: `translate(-50%, -50%) ${isHovered ? 'scale(1.05)' : 'scale(1)'}`,
        pointerEvents: 'auto'
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Architectural Block */}
      <div className="relative w-full h-full">
        {/* Shadow faces - positioned behind */}
        <div 
          className="absolute bg-gray-300/40"
          style={{
            width: '100%',
            height: '100%',
            left: '6px',
            top: '6px',
            borderRadius: project.isMajor ? '8px' : '6px'
          }}
        />
        
        {/* Main face */}
        <div className={`
          relative w-full h-full p-4 transition-all duration-300
          backdrop-blur-sm border-2 z-10
          ${project.isMajor ? 'rounded-lg' : 'rounded-md'}
          ${isSelected 
            ? 'bg-blue-50/90 border-blue-400/70 shadow-lg shadow-blue-200/50' 
            : 'bg-white/85 border-gray-300/60'
          }
          ${isHovered && !isSelected
            ? 'bg-white/95 border-gray-400/80 shadow-md' 
            : ''
          }
        `}>
          <h3 className={`font-medium leading-tight transition-colors ${
            isSelected ? 'text-blue-900' : 'text-gray-800'
          } ${project.isMajor ? 'text-sm mb-2' : 'text-xs mb-1'}`}>
            {project.title}
          </h3>
          <p className={`transition-colors ${
            isSelected ? 'text-blue-700' : 'text-gray-600'
          } ${project.isMajor ? 'text-xs' : 'text-[10px]'}`}>
            {project.meta}
          </p>
          
          {/* Selection indicator */}
          {isSelected && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm" />
          )}
        </div>
      </div>
    </div>
  );
}