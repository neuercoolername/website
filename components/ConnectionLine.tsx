'use client';

import { useAppSelector } from '@/store/hooks';

interface ConnectionLineProps {
  connection: {
    id: number;
    from: number;
    to: number;
    points: number[][];
  };
}

export default function ConnectionLine({ connection }: ConnectionLineProps) {
  const { activeConnections } = useAppSelector(state => state.portfolio);
  
  const isActive = activeConnections.includes(connection.id);
  const [fromPoint, toPoint] = connection.points;

  // Calculate line position and rotation
  const deltaX = toPoint[0] - fromPoint[0];
  const deltaY = toPoint[1] - fromPoint[1];
  const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

  return (
    <div
      className={`absolute transition-all duration-300 ${
        isActive ? 'opacity-80' : 'opacity-20'
      }`}
      style={{
        left: `${fromPoint[0]}%`,
        top: `${fromPoint[1]}%`,
        width: `${length}%`,
        height: '1px',
        transformOrigin: '0 0',
        transform: `rotate(${angle}deg)`,
        background: isActive ? 'var(--accent)' : 'rgba(100,100,100,0.3)'
      }}
    />
  );
}