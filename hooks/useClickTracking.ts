'use client';

import { useEffect, useCallback } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { addMessage } from '@/store/slices/consoleSlice';
import { createInteractionDetails } from '@/utils/domUtils';

export function useClickTracking() {
  const dispatch = useAppDispatch();

  const handleClick = useCallback((e: MouseEvent) => {
    const details = createInteractionDetails(e, 'click');
    dispatch(addMessage({
      content: '[EVENT] click origin',
      type: 'interaction',
      details,
    }));
  }, [dispatch]);

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [handleClick]);
}
