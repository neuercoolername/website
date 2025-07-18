'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setInitialized, setMobile, setTimeOfDay } from '@/store/slices/appSlice';
import { addMessage } from '@/store/slices/consoleSlice';
import { closeDetailPanel } from '@/store/slices/portfolioSlice';
import { useBackground } from '@/hooks/useBackground';
import { useScratch } from '@/hooks/useScratch';
import ProjectNetwork from './ProjectNetwork';
import Console from './Console';
import DetailPanel from './DetailPanel';

export default function Portfolio() {
  const dispatch = useAppDispatch();

  // Initialize ambient systems
  useBackground();
  useScratch();

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

    // Welcome message
    dispatch(addMessage({
      content: 'Living digital notebook initialized',
      type: 'system'
    }));
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