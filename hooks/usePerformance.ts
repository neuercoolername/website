'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { addMessage } from '@/store/slices/consoleSlice';

interface PerformanceTiming {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

export function usePerformance() {
  const dispatch = useAppDispatch();
  const timersRef = useRef<Map<string, PerformanceTiming>>(new Map());

  const startTimer = (name: string) => {
    const startTime = performance.now();
    timersRef.current.set(name, { name, startTime });
    
    dispatch(addMessage({
      content: `[PERF] timer:start ${name}`,
      type: 'system'
    }));
  };

  const endTimer = (name: string) => {
    const timer = timersRef.current.get(name);
    if (!timer) return;

    const endTime = performance.now();
    const duration = endTime - timer.startTime;
    
    timer.endTime = endTime;
    timer.duration = duration;
    
    dispatch(addMessage({
      content: `[PERF] timer:end ${name} ${duration.toFixed(2)}ms`,
      type: 'system'
    }));

    timersRef.current.delete(name);
    return duration;
  };

  const logRender = (componentName: string) => {
    const renderTime = performance.now();
    dispatch(addMessage({
      content: `[RENDER] ${componentName} @${renderTime.toFixed(2)}ms`,
      type: 'system'
    }));
  };

  const logPaintTiming = () => {
    useEffect(() => {
      // Check if paint entries already exist
      const existingPaintEntries = performance.getEntriesByType('paint');
      existingPaintEntries.forEach((entry) => {
        dispatch(addMessage({
          content: `[PAINT] ${entry.name} ${entry.startTime.toFixed(2)}ms`,
          type: 'system'
        }));
      });

      // Observe future paint events
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'paint') {
            dispatch(addMessage({
              content: `[PAINT] ${entry.name} ${entry.startTime.toFixed(2)}ms`,
              type: 'system'
            }));
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['paint'] });
      } catch (e) {
        // Paint timing might not be supported
        dispatch(addMessage({
          content: `[PERF] Paint timing not supported`,
          type: 'system'
        }));
      }
      
      return () => observer.disconnect();
    }, []);
  };

  const logNavigationTiming = () => {
    useEffect(() => {
      // Wait for load event to complete before reading timing
      const checkTiming = () => {
        const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (timing && timing.loadEventEnd > 0) {
          const domContentLoaded = timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart;
          const loadComplete = timing.loadEventEnd - timing.loadEventStart;
          
          if (domContentLoaded > 0) {
            dispatch(addMessage({
              content: `[NAV] DOMContentLoaded ${domContentLoaded.toFixed(2)}ms`,
              type: 'system'
            }));
          }
          
          if (loadComplete > 0) {
            dispatch(addMessage({
              content: `[NAV] load ${loadComplete.toFixed(2)}ms`,
              type: 'system'
            }));
          }
        }
      };

      if (document.readyState === 'complete') {
        setTimeout(checkTiming, 100); // Small delay to ensure timing is available
      } else {
        window.addEventListener('load', () => setTimeout(checkTiming, 100));
      }
    }, []);
  };

  return {
    startTimer,
    endTimer,
    logRender,
    logPaintTiming,
    logNavigationTiming
  };
}

export function useComponentPerformance(componentName: string) {
  const { logRender } = usePerformance();
  const renderStart = useRef(performance.now());

  useEffect(() => {
    const renderTime = performance.now() - renderStart.current;
    logRender(`${componentName} ${renderTime.toFixed(2)}ms`);
  }, [componentName, logRender]);
}