import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Project } from '@/lib/projects';

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  selectedProject: Project | null;
}

const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
  selectedProject: null,
};

// Async thunks
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async () => {
    const response = await fetch('/api/projects');
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    return await response.json();
  }
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (id: number) => {
    const response = await fetch(`/api/projects/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch project');
    }
    return await response.json();
  }
);

export const fetchMajorProjects = createAsyncThunk(
  'projects/fetchMajorProjects',
  async () => {
    const response = await fetch('/api/projects/major');
    if (!response.ok) {
      throw new Error('Failed to fetch major projects');
    }
    return await response.json();
  }
);

export const fetchProjectsByTag = createAsyncThunk(
  'projects/fetchProjectsByTag',
  async (tag: string) => {
    const response = await fetch(`/api/projects/tag/${encodeURIComponent(tag)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch projects by tag');
    }
    return await response.json();
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    selectProject: (state, action: PayloadAction<Project | null>) => {
      state.selectedProject = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch projects';
      })
      
      // Fetch project by ID
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch project';
      })
      
      // Fetch major projects
      .addCase(fetchMajorProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMajorProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchMajorProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch major projects';
      })
      
      // Fetch projects by tag
      .addCase(fetchProjectsByTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectsByTag.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjectsByTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch projects by tag';
      });
  },
});

export const { selectProject, clearError } = projectSlice.actions;
export default projectSlice.reducer;