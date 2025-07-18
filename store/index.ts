import { configureStore } from '@reduxjs/toolkit';
import portfolioSlice from './slices/portfolioSlice';
import consoleSlice from './slices/consoleSlice';
import scratchSlice from './slices/scratchSlice';
import appSlice from './slices/appSlice';

export const store = configureStore({
  reducer: {
    portfolio: portfolioSlice,
    console: consoleSlice,
    scratch: scratchSlice,
    app: appSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['scratch/addPath'],
        ignoredPaths: ['scratch.paths'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;