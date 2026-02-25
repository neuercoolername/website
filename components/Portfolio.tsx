'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setInitialized, setMobile } from '@/store/slices/appSlice';
import { useBackground } from '@/hooks/useBackground';
import { useScratch } from '@/hooks/useScratch';
import { usePerformance } from '@/hooks/usePerformance';
import { useClickTracking } from '@/hooks/useClickTracking';
import DesktopLayout from './DesktopLayout';
import MobileLayout from './MobileLayout';

export default function Portfolio() {
  const dispatch = useAppDispatch();
  const { isMobile } = useAppSelector(state => state.app);
  const { logPaintTiming, logNavigationTiming } = usePerformance();

  useBackground();
  useScratch();
  useClickTracking();
  logPaintTiming();
  logNavigationTiming();

  useEffect(() => {
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    dispatch(setMobile(isMobile));
    dispatch(setInitialized(true));

  }, [dispatch]);

  if (isMobile) return <MobileLayout />;
  return <DesktopLayout />;
}
