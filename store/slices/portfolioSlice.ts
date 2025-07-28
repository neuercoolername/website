import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project } from '@/lib/projects';

interface PortfolioState {
  selectedProject: Project | null;
  hoveredProject: number | null;
  detailPanelOpen: boolean;
  activeConnections: number[];
  selectedTag: string | null;
  gallery: {
    isOpen: boolean;
    projectId: string | null;
    currentImageIndex: number;
    images: string[];
  };
}

const initialState: PortfolioState = {
  selectedProject: null,
  hoveredProject: null,
  detailPanelOpen: false,
  activeConnections: [],
  selectedTag: null,
  gallery: {
    isOpen: false,
    projectId: null,
    currentImageIndex: 0,
    images: [],
  },
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
    openGallery: (state, action: PayloadAction<{ projectId: string; images: string[]; initialIndex?: number }>) => {
      state.gallery.isOpen = true;
      state.gallery.projectId = action.payload.projectId;
      state.gallery.images = action.payload.images;
      state.gallery.currentImageIndex = action.payload.initialIndex || 0;
    },
    closeGallery: (state) => {
      state.gallery.isOpen = false;
      state.gallery.projectId = null;
      state.gallery.images = [];
      state.gallery.currentImageIndex = 0;
    },
    nextImage: (state) => {
      if (state.gallery.currentImageIndex < state.gallery.images.length - 1) {
        state.gallery.currentImageIndex += 1;
      }
    },
    previousImage: (state) => {
      if (state.gallery.currentImageIndex > 0) {
        state.gallery.currentImageIndex -= 1;
      }
    },
    setCurrentImage: (state, action: PayloadAction<number>) => {
      if (action.payload >= 0 && action.payload < state.gallery.images.length) {
        state.gallery.currentImageIndex = action.payload;
      }
    },
    selectTag: (state, action: PayloadAction<string | null>) => {
      state.selectedTag = action.payload;
    },
  },
});

export const { 
  selectProject, 
  hoverProject, 
  closeDetailPanel, 
  setActiveConnections,
  openGallery,
  closeGallery,
  nextImage,
  previousImage,
  setCurrentImage,
  selectTag
} = portfolioSlice.actions;
export default portfolioSlice.reducer;