'use client';

import { useEffect } from 'react';

interface BackgroundConfig {
  updateInterval?: number; // milliseconds
  transitionDuration?: number; // seconds
}

type TimeOfDay = 'dawn' | 'morning' | 'midday' | 'afternoon' | 'evening' | 'dusk' | 'night' | 'late-night';

const defaultConfig: Required<BackgroundConfig> = {
  updateInterval: 60000, // 1 minute
  transitionDuration: 4 // 4 seconds
};

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 7) return 'dawn';
  if (hour >= 7 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 15) return 'midday';
  if (hour >= 15 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 19) return 'evening';
  if (hour >= 19 && hour < 21) return 'dusk';
  if (hour >= 21 || hour < 2) return 'night';
  return 'late-night'; // 2-5am
}

function applyTimeClass(timeOfDay: TimeOfDay, transitionDuration: number) {
  const body = document.body;

  // Remove all existing time classes
  body.classList.remove(
    'time-dawn', 'time-morning', 'time-midday', 'time-afternoon',
    'time-evening', 'time-dusk', 'time-night', 'time-late-night'
  );

  // Set transition duration
  body.style.transition = `background ${transitionDuration}s ease-in-out`;

  // Add new time class
  body.classList.add(`time-${timeOfDay}`);
}

export function useBackground(config: BackgroundConfig = {}) {
  const { updateInterval, transitionDuration } = { ...defaultConfig, ...config };

  useEffect(() => {
    // Apply the current time-based background
    const currentTime = getTimeOfDay();
    applyTimeClass(currentTime, transitionDuration);

    // Set up interval to update background based on real time
    const interval = setInterval(() => {
      const newTime = getTimeOfDay();
      applyTimeClass(newTime, transitionDuration);
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval, transitionDuration]);

  // Return current time of day for other components to use
  return getTimeOfDay();
}