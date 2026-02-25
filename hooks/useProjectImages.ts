'use client';

import { useEffect, useRef, useState } from 'react';
import { fetchProjectImages } from '@/utils/imageUtils';

interface UseProjectImagesResult {
  images: string[];
  loading: boolean;
}

export function useProjectImages(projectId: number | null): UseProjectImagesResult {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const cache = useRef<Record<string, string[]>>({});

  useEffect(() => {
    if (!projectId) {
      setImages([]);
      setLoading(false);
      return;
    }

    const key = projectId.toString();
    if (cache.current[key]) {
      setImages(cache.current[key]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setImages([]);
    fetchProjectImages(projectId).then((fetched) => {
      cache.current[key] = fetched;
      setImages(fetched);
      setLoading(false);
    });
  }, [projectId]);

  return { images, loading };
}
