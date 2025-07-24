'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closeDetailPanel, openGallery } from '@/store/slices/portfolioSlice';
import { addMessage } from '@/store/slices/consoleSlice';
import { createInteractionDetails } from '@/utils/domUtils';
import { getProjectThumbnailUrl, getProjectGalleryImages } from '@/utils/imageUtils';

export default function DetailPanel() {
  const dispatch = useAppDispatch();
  const { selectedProject } = useAppSelector(state => state.portfolio);

  const handleClose = (event: React.MouseEvent) => {
    dispatch(closeDetailPanel());
    dispatch(addMessage({
      content: 'Detail panel closed',
      type: 'interaction',
      details: createInteractionDetails(event.nativeEvent, 'click')
    }));
  };

  if (!selectedProject) {
    return (
      <div className="w-full h-full flex flex-col">
        {/* Title when no project selected */}
        <div className="p-6 border-b border-white/40">
          <h1 className="text-2xl font-light text-gray-700">
            David Amberg
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      w-full h-full transition-all duration-300
      ${selectedProject ? 'block' : 'hidden'}
    `}>
      {/* Project Header */}
      <div className="p-6 border-b border-white/40">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-medium text-gray-800 leading-tight">
            {selectedProject.title}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
      </div>

      {/* Project Thumbnail */}
      <div className="border-b border-white/40">
        <img
          src={getProjectThumbnailUrl(selectedProject.id) || ''}
          alt={`${selectedProject.title} thumbnail`}
          className="w-full h-48 object-cover"
        />
      </div>
      
      {/* Project Metadata */}
      <div className="p-6 border-b border-white/40">
        <p className="text-sm text-gray-600">
          {selectedProject.meta}
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {selectedProject.description}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Links</h3>
            <div className="space-y-2">
              {selectedProject.links.map((link: string, index: number) => (
                <button
                  key={index}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100/50 rounded transition-colors"
                >
                  {link} →
                </button>
              ))}
            </div>
          </div>

          {/* Images */}
          {(() => {
            const galleryImages = getProjectGalleryImages(selectedProject.id);
            if (galleryImages.length === 0) return null;
            
            return (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Images</h3>
                <div className="grid grid-cols-3 gap-2">
                  {galleryImages.map((imageName, index) => (
                    <button
                      key={index}
                      className="aspect-square bg-gray-100 rounded overflow-hidden hover:opacity-80 transition-opacity"
                      onClick={() => {
                        dispatch(openGallery({
                          projectId: selectedProject.id.toString(),
                          images: galleryImages,
                          initialIndex: index
                        }));
                      }}
                    >
                      <img
                        src={`/images/projects/${selectedProject.id}/gallery/${imageName}`}
                        alt={`${selectedProject.title} screenshot ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Related Projects */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Related Projects</h3>
            <div className="space-y-2">
              {selectedProject.related.map((related: string, index: number) => (
                <div
                  key={index}
                  className="px-3 py-2 text-sm text-gray-600 bg-gray-50/50 rounded"
                >
                  {related}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}