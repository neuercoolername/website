'use client';

import { useEffect } from 'react';

interface ImageGalleryOverlayProps {
  projectId: string;
  currentImageIndex: number;
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSetImage?: (index: number) => void;
}

export default function ImageGalleryOverlay({
  projectId,
  currentImageIndex,
  images,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  onSetImage,
}: ImageGalleryOverlayProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          onPrevious();
          break;
        case 'ArrowRight':
          onNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrevious]);

  if (!isOpen) return null;

  const currentImage = images[currentImageIndex];

  return (
    <div
      className="absolute inset-0 bg-white/20 backdrop-blur-[0.5px] 
 z-50 flex items-start justify-center pt-20"
      onClick={onClose}
    >
      {/* Main image */}
      <div
        className="max-w-6xl max-h-[85vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={`/images/projects/${projectId}/gallery/${currentImage}`}
          alt={`Project image ${currentImageIndex + 1}`}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onSetImage?.(index)}
              className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                index === currentImageIndex
                  ? 'border-white shadow-lg scale-105'
                  : 'border-white/30 hover:border-white/60'
              }`}
            >
              <img
                src={`/images/projects/${projectId}/gallery/${image}`}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
