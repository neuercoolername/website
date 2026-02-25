'use client';

import { useRef, useState } from 'react';

interface BottomSheetProps {
  onClose: () => void;
  children: React.ReactNode;
}

export default function BottomSheet({ onClose, children }: BottomSheetProps) {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    startY.current = e.clientY;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setDragY(Math.max(0, e.clientY - startY.current));
  };

  const handlePointerUp = () => {
    if (dragY > 120) onClose();
    setDragY(0);
    setIsDragging(false);
  };

  return (
    <>
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div
        className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto"
        style={{
          transform: `translateY(${dragY}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease',
        }}
      >
        {/* Drag handle */}
        <div
          className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>
        {children}
      </div>
    </>
  );
}
