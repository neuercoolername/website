import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project } from '@/data/projects';

interface PortfolioState {
  selectedProject: Project | null;
  hoveredProject: number | null;
  detailPanelOpen: boolean;
  activeConnections: number[];
}

const initialState: PortfolioState = {
  selectedProject: null,
  hoveredProject: null,
  detailPanelOpen: false,
  activeConnections: [],
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    selectProject: (state, action: PayloadAction<{ project: Project | null; connections: number[] }>) => {
      state.selectedProject = action.payload.project;
      state.detailPanelOpen = !!action.payload.project;
      state.activeConnections = action.payload.connections;
    },
    hoverProject: (state, action: PayloadAction<{ projectId: number | null; connections: number[] }>) => {
      state.hoveredProject = action.payload.projectId;
      if (!state.selectedProject) {
        state.activeConnections = action.payload.connections;
      }
    },
    closeDetailPanel: (state) => {
      state.selectedProject = null;
      state.detailPanelOpen = false;
      state.activeConnections = state.hoveredProject 
        ? state.activeConnections 
        : [];
    },
    setActiveConnections: (state, action: PayloadAction<number[]>) => {
      state.activeConnections = action.payload;
    },
  },
});

export const { selectProject, hoverProject, closeDetailPanel, setActiveConnections } = portfolioSlice.actions;
export default portfolioSlice.reducer;