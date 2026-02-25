'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProjects } from '@/store/slices/projectSlice';
import { closeDetailPanel, closeGallery, nextImage, previousImage, selectTag, setCurrentImage } from '@/store/slices/portfolioSlice';
import MobileProjectCard from './MobileProjectCard';
import DetailPanel from './DetailPanel';
import BottomSheet from './BottomSheet';
import Console from './Console';
import ImageGalleryOverlay from './ImageGalleryOverlay';

export default function MobileLayout() {
  const dispatch = useAppDispatch();
  const { projects, loading } = useAppSelector(state => state.projects);
  const { selectedProject, selectedTag, gallery } = useAppSelector(state => state.portfolio);

  useEffect(() => {
    if (projects.length === 0) {
      dispatch(fetchProjects());
    }
  }, [dispatch, projects.length]);

  const allTags = [...new Set(projects.flatMap(p => p.tags))].sort();

  return (
    <div className="flex flex-col h-screen relative overflow-hidden">
      {/* Scrollable project list */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="p-4 pb-0">
          <h1 className="text-2xl font-light text-gray-700 mb-3">David Amberg</h1>
          {allTags.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => dispatch(selectTag(selectedTag === tag ? null : tag))}
                  className={`flex-shrink-0 px-3 py-1 text-xs rounded-full border transition-colors ${
                    selectedTag === tag
                      ? 'bg-gray-800 text-white border-gray-800'
                      : 'bg-white text-gray-600 border-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Project list */}
        <div className="p-4 space-y-3">
          {loading && (
            <p className="text-gray-500 text-sm">Loading (:</p>
          )}
          {projects.map(project => (
            <MobileProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      {/* Console */}
      <div className="flex-shrink-0">
        <Console />
      </div>

      {/* Bottom sheet */}
      {selectedProject && (
        <BottomSheet onClose={() => dispatch(closeDetailPanel())}>
          <DetailPanel />
        </BottomSheet>
      )}

      {/* Gallery overlay */}
      <ImageGalleryOverlay
        currentImageIndex={gallery.currentImageIndex}
        images={gallery.images}
        isOpen={gallery.isOpen}
        onClose={() => dispatch(closeGallery())}
        onNext={() => dispatch(nextImage())}
        onPrevious={() => dispatch(previousImage())}
        onSetImage={(index) => dispatch(setCurrentImage(index))}
      />
    </div>
  );
}
