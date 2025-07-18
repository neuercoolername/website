import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TimeOfDay = 'dawn' | 'morning' | 'midday' | 'afternoon' | 'evening' | 'dusk' | 'night' | 'late-night';

interface AppState {
  timeOfDay: TimeOfDay;
  isMobile: boolean;
  isInitialized: boolean;
  lastInteraction: number;
}

const initialState: AppState = {
  timeOfDay: 'midday',
  isMobile: false,
  isInitialized: false,
  lastInteraction: Date.now(),
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setTimeOfDay: (state, action: PayloadAction<TimeOfDay>) => {
      state.timeOfDay = action.payload;
    },
    setMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    updateLastInteraction: (state) => {
      state.lastInteraction = Date.now();
    },
  },
});

export const { 
  setTimeOfDay, 
  setMobile, 
  setInitialized, 
  updateLastInteraction 
} = appSlice.actions;

export default appSlice.reducer;