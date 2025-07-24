'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setInitialized, setMobile, setTimeOfDay } from '@/store/slices/appSlice';
import { closeDetailPanel, closeGallery, nextImage, previousImage, setCurrentImage } from '@/store/slices/portfolioSlice';
import { useBackground } from '@/hooks/useBackground';
import { useScratch } from '@/hooks/useScratch';
import { usePerformance } from '@/hooks/usePerformance';
import ProjectNetwork from './ProjectNetwork';
import Console from './Console';
import DetailPanel from './DetailPanel';
import ImageGalleryOverlay from './ImageGalleryOverlay';

export default function Portfolio() {
  const dispatch = useAppDispatch();
  const { gallery } = useAppSelector(state => state.portfolio);
  const { logPaintTiming, logNavigationTiming } = usePerformance();

  // Initialize ambient systems
  useBackground();
  useScratch();

  // Initialize performance monitoring
  logPaintTiming();
  logNavigationTiming();



  useEffect(() => {
    // Initialize app state
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    dispatch(setMobile(isMobile));
    dispatch(setInitialized(true));

    // Set initial time
    const getTimeOfDay = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 7) return 'dawn';
      if (hour >= 7 && hour < 11) return 'morning';
      if (hour >= 11 && hour < 15) return 'midday';
      if (hour >= 15 && hour < 17) return 'afternoon';
      if (hour >= 17 && hour < 19) return 'evening';
      if (hour >= 19 && hour < 21) return 'dusk';
      if (hour >= 21 || hour < 2) return 'night';
      return 'late-night';
    };

    dispatch(setTimeOfDay(getTimeOfDay()));


  }, [dispatch]);

  const handleBackgroundClick = (e: React.MouseEvent) => {
    // Only close if clicking the background itself, not child elements
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
        
        {/* Image Gallery Overlay - positioned over the ProjectNetwork */}
        <ImageGalleryOverlay
          projectId={gallery.projectId || ''}
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
        {/* Detail Panel - takes remaining space */}
        <div className="flex-1 overflow-hidden">
          <DetailPanel />
        </div>

        {/* Console - fixed at bottom */}
        <div className="flex-shrink-0">
          <Console />
        </div>
      </div>
    </div>
  );
}