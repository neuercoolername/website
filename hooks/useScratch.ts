'use client';

import { useEffect, useRef, useCallback } from 'react';

interface ScratchConfig {
  fadeDelay?: number; // milliseconds before fade starts
  fadeDuration?: number; // seconds for fade animation
  strokeOpacity?: number;
  strokeWidth?: number;
  maxPaths?: number; // limit simultaneous paths
  minMoveDistance?: number; // pixels before adding new point
  avoidSelectors?: string[]; // CSS selectors to avoid drawing over
}

interface Point {
  x: number;
  y: number;
}

interface ScratchPath {
  id: string;
  points: Point[];
  element: SVGPathElement;
}

const defaultConfig: Required<ScratchConfig> = {
  fadeDelay: 0,
  fadeDuration: 60,
  strokeOpacity: 0.6,
  strokeWidth: 2,
  maxPaths: 20,
  minMoveDistance: 4,
  avoidSelectors: [
    'header', 'nav', 'button', 'a',
    '.project-node', '.detail-panel', '.console',
    '[role="button"]', '[role="link"]'
  ]
};

export function useScratch(config: ScratchConfig = {}) {
  const {
    fadeDelay,
    fadeDuration,
    strokeOpacity,
    strokeWidth,
    maxPaths,
    minMoveDistance,
    avoidSelectors
  } = { ...defaultConfig, ...config };

  const svgRef = useRef<SVGSVGElement | null>(null);
  const pathsRef = useRef<ScratchPath[]>([]);
  const currentPathRef = useRef<ScratchPath | null>(null);
  const lastPointRef = useRef<Point | null>(null);
  const enabledRef = useRef(true);
  const lastMoveTimeRef = useRef<number>(Date.now());

  // Check if mouse is over UI elements to avoid
  const shouldAvoidDrawing = useCallback((x: number, y: number): boolean => {
    const element = document.elementFromPoint(x, y);
    if (!element) return false;

    return avoidSelectors.some(selector => {
      try {
        return element.closest(selector) !== null;
      } catch {
        return false;
      }
    });
  }, [avoidSelectors]);

  // Create SVG path string from points
  const createPathString = useCallback((points: Point[]): string => {
    if (points.length < 2) return '';

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    return path;
  }, []);

  // Remove path after fade animation
  const removePath = useCallback((pathId: string) => {
    const pathIndex = pathsRef.current.findIndex(p => p.id === pathId);
    if (pathIndex !== -1) {
      const path = pathsRef.current[pathIndex];

      // Clear current path if it's the one being removed
      if (currentPathRef.current?.id === pathId) {
        currentPathRef.current = null;
        lastPointRef.current = null;
      }

      path.element.remove();
      pathsRef.current.splice(pathIndex, 1);
    }
  }, []);

  // Start fade animation for a path
  const startFade = useCallback((path: ScratchPath) => {
    setTimeout(() => {
      path.element.style.animation = `fadeScratch ${fadeDuration}s ease-out forwards`;

      // Remove from DOM after animation completes
      setTimeout(() => {
        removePath(path.id);
      }, fadeDuration * 1000);
    }, fadeDelay);
  }, [fadeDelay, fadeDuration, removePath]);

  // Start new path
  const startNewPath = useCallback((x: number, y: number) => {
    if (!svgRef.current) return;

    // Remove oldest path if we've hit the limit
    if (pathsRef.current.length >= maxPaths) {
      const oldestPath = pathsRef.current[0];
      removePath(oldestPath.id);
    }

    const pathId = `scratch-${Date.now()}-${Math.random()}`;
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    pathElement.setAttribute('class', 'scratch-path');
    pathElement.setAttribute('fill', 'none');
    pathElement.setAttribute('stroke', `rgba(100, 108, 255, ${strokeOpacity})`); // Blue accent color
    pathElement.setAttribute('stroke-width', strokeWidth.toString());
    pathElement.setAttribute('stroke-linecap', 'round');
    pathElement.setAttribute('stroke-linejoin', 'round');
    pathElement.setAttribute('opacity', '1');

    // Create initial path with just one point
    pathElement.setAttribute('d', `M ${x} ${y}`);

    svgRef.current.appendChild(pathElement);

    const newPath: ScratchPath = {
      id: pathId,
      points: [{ x, y }],
      element: pathElement
    };

    pathsRef.current.push(newPath);
    currentPathRef.current = newPath;
    lastPointRef.current = { x, y };

    // Start fade timer
    startFade(newPath);
  }, [maxPaths, strokeOpacity, strokeWidth, removePath, startFade]);

  // Add point to current path
  const addPointToPath = useCallback((x: number, y: number) => {
    const currentPath = currentPathRef.current;
    const lastPoint = lastPointRef.current;

    if (!currentPath || !lastPoint) return;

    // Check minimum distance
    const distance = Math.sqrt(
      Math.pow(x - lastPoint.x, 2) + Math.pow(y - lastPoint.y, 2)
    );

    if (distance < minMoveDistance) return;

    currentPath.points.push({ x, y });
    const pathString = createPathString(currentPath.points);
    currentPath.element.setAttribute('d', pathString);
    lastPointRef.current = { x, y };
  }, [minMoveDistance, createPathString]);

  // Handle mouse move
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!enabledRef.current || !svgRef.current) return;

    const x = event.clientX;
    const y = event.clientY;
    const now = Date.now();

    // Update last move time
    lastMoveTimeRef.current = now;

    // Check if we should avoid drawing here
    if (shouldAvoidDrawing(x, y)) {
      // End current path when avoiding UI elements
      if (currentPathRef.current) {
        currentPathRef.current = null;
        lastPointRef.current = null;
      }
      return;
    }

    // If too much time has passed since last move, start fresh
    if (currentPathRef.current && now - lastMoveTimeRef.current > 500) {
      currentPathRef.current = null;
      lastPointRef.current = null;
    }

    // Start new path or continue current one
    if (!currentPathRef.current) {
      startNewPath(x, y);
    } else {
      addPointToPath(x, y);
    }
  }, [shouldAvoidDrawing, startNewPath, addPointToPath]);

  // End current path (on mouse leave or UI interaction)
  const endCurrentPath = useCallback(() => {
    currentPathRef.current = null;
    lastPointRef.current = null;
  }, []);

  // Disable/enable scratch drawing
  const setEnabled = useCallback((enabled: boolean) => {
    enabledRef.current = enabled;
    if (!enabled) {
      endCurrentPath();
    }
  }, [endCurrentPath]);

  // Clear all paths
  const clearAll = useCallback(() => {
    pathsRef.current.forEach(path => {
      path.element.remove();
    });
    pathsRef.current = [];
    currentPathRef.current = null;
    lastPointRef.current = null;
  }, []);

  useEffect(() => {

    // Create SVG overlay
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'fixed';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '1000';

    document.body.appendChild(svg);
    svgRef.current = svg;


    // Add CSS animation for fade
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeScratch {
        0% { opacity: ${strokeOpacity}; }
        100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    // Event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', endCurrentPath);

    // Disable on mobile/touch devices
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isMobile) {
      setEnabled(false);
    }

    return () => {
      // Cleanup
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', endCurrentPath);
      svg.remove();
      style.remove();
      clearAll();
    };
  }, [handleMouseMove, endCurrentPath, strokeOpacity, setEnabled, clearAll]);

  return {
    setEnabled,
    clearAll,
    isEnabled: () => enabledRef.current
  };
}