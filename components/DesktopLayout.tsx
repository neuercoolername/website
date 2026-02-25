'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closeDetailPanel, closeGallery, nextImage, previousImage, setCurrentImage } from '@/store/slices/portfolioSlice';
import ProjectNetwork from './ProjectNetwork';
import Console from './Console';
import DetailPanel from './DetailPanel';
import ImageGalleryOverlay from './ImageGalleryOverlay';

export default function DesktopLayout() {
  const dispatch = useAppDispatch();
  const { gallery } = useAppSelector(state => state.portfolio);

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      dispatch(closeDetailPanel());
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden">
      {/* Main canvas area */}
      <div
        className="flex-1 relative"
        onClick={handleBackgroundClick}
      >
        <ProjectNetwork />

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

      {/* Permanent sidebar */}
      <div className="w-96 bg-white/90 backdrop-blur-sm border-l border-white/60 flex flex-col h-full">
        <div className="flex-1 overflow-hidden">
          <DetailPanel />
        </div>
        <div className="flex-shrink-0">
          <Console />
        </div>
      </div>
    </div>
  );
}
