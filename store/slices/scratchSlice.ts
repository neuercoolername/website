import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ScratchPath {
  id: string;
  points: { x: number; y: number }[];
  element: SVGPathElement;
}

interface ScratchState {
  isEnabled: boolean;
  currentPath: ScratchPath | null;
  activePaths: ScratchPath[];
  totalPathsCreated: number;
}

const initialState: ScratchState = {
  isEnabled: true,
  currentPath: null,
  activePaths: [],
  totalPathsCreated: 0,
};

const scratchSlice = createSlice({
  name: 'scratch',
  initialState,
  reducers: {
    setEnabled: (state, action: PayloadAction<boolean>) => {
      state.isEnabled = action.payload;
      if (!action.payload) {
        state.currentPath = null;
      }
    },
    startPath: (state, action: PayloadAction<ScratchPath>) => {
      state.currentPath = action.payload;
      state.activePaths.push(action.payload);
      state.totalPathsCreated += 1;
    },
    updatePath: (state, action: PayloadAction<{ id: string; points: { x: number; y: number }[] }>) => {
      if (state.currentPath?.id === action.payload.id) {
        state.currentPath.points = action.payload.points;
      }
      const pathIndex = state.activePaths.findIndex(p => p.id === action.payload.id);
      if (pathIndex !== -1) {
        state.activePaths[pathIndex].points = action.payload.points;
      }
    },
    endPath: (state) => {
      state.currentPath = null;
    },
    removePath: (state, action: PayloadAction<string>) => {
      const pathIndex = state.activePaths.findIndex(p => p.id === action.payload);
      if (pathIndex !== -1) {
        state.activePaths.splice(pathIndex, 1);
      }
      if (state.currentPath?.id === action.payload) {
        state.currentPath = null;
      }
    },
    clearAllPaths: (state) => {
      state.activePaths = [];
      state.currentPath = null;
    },
  },
});

export const { 
  setEnabled, 
  startPath, 
  updatePath, 
  endPath, 
  removePath, 
  clearAllPaths 
} = scratchSlice.actions;

export default scratchSlice.reducer;