import { create } from 'zustand';
import apiClient from '../api/apiClient';

const MOCK_PROJECTS = [
  {
    id: 'proj_1',
    title: 'Quantum Agent Workspaces',
    description: 'An AI-driven task orchestration system utilizing multi-agent frameworks to automate complex developer workflows.',
    category: 'AI & Machine Learning',
    techStack: ['Node.js', 'React', 'LangChain', 'OpenAI'],
    githubLink: 'https://github.com/alexrivera/quantum-agents',
    aiSummary: 'A multi-agent development workflow automation system with built-in sandbox execution and task evaluation loops.',
    stars: 124,
    commits: 342,
    lastUpdated: '2 hours ago'
  },
  {
    id: 'proj_2',
    title: 'Glassmorphic Mobile Kit',
    description: 'A premium React Native component library designed specifically for dark theme futuristic dashboard UI styling.',
    category: 'Mobile Development',
    techStack: ['React Native', 'Reanimated', 'Expo'],
    githubLink: 'https://github.com/alexrivera/glassmorphic-native',
    aiSummary: 'High-performance React Native component kit offering 60fps glassmorphism styles and interactive micro-animations.',
    stars: 89,
    commits: 112,
    lastUpdated: '1 day ago'
  }
];

export const useProjectStore = create((set, get) => ({
  projects: [],
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/projects');
      set({ projects: response.data, isLoading: false });
    } catch (err) {
      console.warn('Failed to load projects from backend, using mock', err.message);
      set({ projects: MOCK_PROJECTS, isLoading: false });
    }
  },

  addProject: async (projectData) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.post('/projects', projectData);
      set({
        projects: [...get().projects, response.data],
        isLoading: false
      });
      return { success: true };
    } catch (err) {
      console.warn('Failed to add project to backend, using local state', err.message);
      const newProj = {
        id: `proj_local_${Date.now()}`,
        stars: 0,
        commits: 0,
        lastUpdated: 'Just now',
        ...projectData
      };
      set({
        projects: [...get().projects, newProj],
        isLoading: false
      });
      return { success: true };
    }
  },

  updateProject: async (id, updatedData) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.put(`/projects/${id}`, updatedData);
      set({
        projects: get().projects.map(p => p.id === id ? response.data : p),
        isLoading: false
      });
      return { success: true };
    } catch (err) {
      console.warn('Failed to update project, applying to local state', err.message);
      set({
        projects: get().projects.map(p => p.id === id ? { ...p, ...updatedData } : p),
        isLoading: false
      });
      return { success: true };
    }
  },

  deleteProject: async (id) => {
    set({ isLoading: true });
    try {
      await apiClient.delete(`/projects/${id}`);
      set({
        projects: get().projects.filter(p => p.id !== id),
        isLoading: false
      });
    } catch (err) {
      console.warn('Failed to delete project on backend, removing from local state', err.message);
      set({
        projects: get().projects.filter(p => p.id !== id),
        isLoading: false
      });
    }
  }
}));
