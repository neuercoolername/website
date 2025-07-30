'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  closeDetailPanel,
  closeGallery,
  openGallery,
  selectTag,
} from '@/store/slices/portfolioSlice';
import { addMessage } from '@/store/slices/consoleSlice';
import { createInteractionDetails } from '@/utils/domUtils';
import { getProjectGalleryImages } from '@/utils/imageUtils';
import { useEffect, useState } from 'react';

export default function DetailPanel() {
  const dispatch = useAppDispatch();
  const { selectedProject, selectedTag } = useAppSelector((state) => state.portfolio);
  const { projects } = useAppSelector((state) => state.projects);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    if (projects && projects.length > 0) {
      const tags = [...new Set(projects.flatMap((project: any) => project.tags))];
      setAllTags(tags.sort());
    }
  }, [projects]);

  const handleClose = (event: React.MouseEvent) => {
    dispatch(closeDetailPanel());
    dispatch(closeGallery());
    dispatch(
      addMessage({
        content: 'Detail panel closed',
        type: 'interaction',
        details: createInteractionDetails(event.nativeEvent, 'click'),
      })
    );
  };

  const handleTagClick = (tag: string) => {
    dispatch(selectTag(selectedTag === tag ? null : tag));
  };

  if (!selectedProject) {
    return (
      <div className="w-full h-full flex flex-col">
        {/* Title when no project selected */}
        <div className="p-6 border-b border-white/40">
          <h1 className="text-2xl font-light text-gray-700">David Amberg</h1>
        </div>

        {/* Navigation Links */}
        <div className="p-4 border-b border-white/40">
          <div className="space-y-1">
            <button className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100/50 rounded transition-colors">
              About →
            </button>
            <button className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100/50 rounded transition-colors">
              Imprint →
            </button>
          </div>
        </div>

        {/* Tag Filter */}
        {allTags.length > 0 && (
          <div className="p-4">
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    selectedTag === tag
                      ? 'bg-gray-800 text-white border-gray-800'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`
      w-full h-full transition-all duration-300
      ${selectedProject ? 'block' : 'hidden'}
    `}
    >
      {/* Project Header */}
      <div className="relative p-4 border-b border-white/40">
        <button
          onClick={handleClose}
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 text-lg flex items-center justify-center w-6 h-6"
          title="Back to main view"
        >
          ←
        </button>
        <div className="ml-10">
          <h2 className="text-lg font-medium text-gray-800 leading-tight mb-1">
            {selectedProject.title}
          </h2>
          <p className="text-xs text-gray-500 uppercase tracking-wide">{selectedProject.meta}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-5">
        {/* Description */}
        <div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {selectedProject.description}
          </p>
        </div>

        {/* Links */}
        <div className="space-y-1">
          {selectedProject.links.map((link: string, index: number) => (
            <button
              key={index}
              className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100/50 rounded transition-colors"
            >
              {link} →
            </button>
          ))}
        </div>

        {/* Images */}
        {(() => {
            const galleryImages = getProjectGalleryImages(selectedProject.id);
            if (galleryImages.length === 0) return null;

            return (
              <div>
                <div className="grid grid-cols-3 gap-2">
                  {galleryImages.map((imageName, index) => (
                    <button
                      key={index}
                      className="aspect-square bg-gray-100 rounded overflow-hidden hover:opacity-80 transition-opacity"
                      onClick={() => {
                        dispatch(
                          openGallery({
                            projectId: selectedProject.id.toString(),
                            images: galleryImages,
                            initialIndex: index,
                          })
                        );
                      }}
                    >
                      <img
                        src={`/images/projects/${selectedProject.id}/${imageName}`}
                        alt={`${selectedProject.title} screenshot ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

      </div>
    </div>
  );
}
