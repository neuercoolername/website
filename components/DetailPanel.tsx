'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  closeDetailPanel,
  closeGallery,
  openGallery,
} from '@/store/slices/portfolioSlice';
import { addMessage } from '@/store/slices/consoleSlice';
import { createInteractionDetails } from '@/utils/domUtils';
import { getProjectGalleryImages } from '@/utils/imageUtils';

export default function DetailPanel() {
  const dispatch = useAppDispatch();
  const { selectedProject } = useAppSelector((state) => state.portfolio);

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

  if (!selectedProject) {
    return (
      <div className="w-full h-full flex flex-col">
        {/* Title when no project selected */}
        <div className="p-6 border-b border-white/40">
          <h1 className="text-2xl font-light text-gray-700">David Amberg</h1>
        </div>
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

      </div>
    </div>
  );
}
