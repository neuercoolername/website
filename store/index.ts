import { configureStore } from '@reduxjs/toolkit';
import portfolioSlice from './slices/portfolioSlice';
import consoleSlice from './slices/consoleSlice';
import scratchSlice from './slices/scratchSlice';
import appSlice from './slices/appSlice';
import projectSlice from './slices/projectSlice';
import performanceMiddleware from './middleware/performanceMiddleware';

export const store = configureStore({
  reducer: {
    portfolio: portfolioSlice,
    console: consoleSlice,
    scratch: scratchSlice,
    app: appSlice,
    projects: projectSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['scratch/addPath'],
        ignoredPaths: ['scratch.paths'],
      },
    }).concat(performanceMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;