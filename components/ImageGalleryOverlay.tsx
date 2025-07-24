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
  onSetImage
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
    <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10"
      >
        ×
      </button>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={onPrevious}
            className="absolute left-4 text-white text-3xl hover:text-gray-300 z-10"
            disabled={currentImageIndex === 0}
          >
            ‹
          </button>
          <button
            onClick={onNext}
            className="absolute right-4 text-white text-3xl hover:text-gray-300 z-10"
            disabled={currentImageIndex === images.length - 1}
          >
            ›
          </button>
        </>
      )}

      {/* Main image */}
      <div className="max-w-4xl max-h-[80vh] flex items-center justify-center">
        <img
          src={`/images/projects/${projectId}/gallery/${currentImage}`}
          alt={`Project image ${currentImageIndex + 1}`}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
          {currentImageIndex + 1} / {images.length}
        </div>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 mt-8">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onSetImage?.(index)}
              className={`w-12 h-12 rounded overflow-hidden border-2 ${
                index === currentImageIndex ? 'border-white' : 'border-transparent'
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