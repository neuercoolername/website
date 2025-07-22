import { Middleware } from '@reduxjs/toolkit';
import { addMessage } from '../slices/consoleSlice';

const performanceMiddleware: Middleware = (store) => (next) => (action) => {
  const start = performance.now();
  const result = next(action);
  const duration = performance.now() - start;

  // Only log data fetching related actions
  const actionType = (action as any).type as string;
  const isDataFetchingAction = actionType.includes('fetch') || 
                              actionType.includes('load') || 
                              actionType.includes('/pending') ||
                              actionType.includes('/fulfilled') ||
                              actionType.includes('/rejected');

  if (isDataFetchingAction && duration > 0.1) {
    store.dispatch(addMessage({
      content: `[REDUX] ${actionType} ${duration.toFixed(2)}ms`,
      type: 'system'
    }));
  }

  return result;
};

export default performanceMiddleware;