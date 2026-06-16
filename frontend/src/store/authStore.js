import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/apiClient';

const MOCK_USER = {
  id: 'user_123',
  name: 'Alex Rivera',
  title: 'Senior Full Stack Developer & AI Enthusiast',
  email: 'alex.rivera@quantumai.dev',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  profileCompletion: 85,
  aiReadiness: 78,
  bio: 'Building the future of agentic workflows. Passionate about React Native, Node.js, and Generative AI.',
  skills: [
    { id: '1', name: 'React Native', level: 90, category: 'Frontend' },
    { id: '2', name: 'Node.js', level: 85, category: 'Backend' },
    { id: '3', name: 'TypeScript', level: 80, category: 'Languages' },
    { id: '4', name: 'Python', level: 75, category: 'Languages' },
    { id: '5', name: 'Docker', level: 70, category: 'DevOps' }
  ]
};

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  initialize: async () => {
    try {
      const storedToken = await AsyncStorage.getItem('user_token');
      const storedUser = await AsyncStorage.getItem('user_profile');
      
      if (storedToken && storedUser) {
        set({
          token: storedToken,
          user: JSON.parse(storedUser),
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        set({ isLoading: false });
      }
    } catch (e) {
      console.error('Failed to load auth state', e);
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // Attempt backend call
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      await AsyncStorage.setItem('user_token', token);
      await AsyncStorage.setItem('user_profile', JSON.stringify(user));
      
      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false
      });
      return { success: true };
    } catch (err) {
      console.warn('Backend login failed, using local mock verification', err.message);
      
      // Local Mock Fallback
      if (email && password) {
        const mockToken = 'mock_jwt_token_12345';
        await AsyncStorage.setItem('user_token', mockToken);
        await AsyncStorage.setItem('user_profile', JSON.stringify(MOCK_USER));
        
        set({
          token: mockToken,
          user: MOCK_USER,
          isAuthenticated: true,
          isLoading: false
        });
        return { success: true };
      }
      
      set({ error: err.message, isLoading: false });
      return { success: false, error: err.message };
    }
  },

  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/auth/signup', { name, email, password });
      const { token, user } = response.data;
      
      await AsyncStorage.setItem('user_token', token);
      await AsyncStorage.setItem('user_profile', JSON.stringify(user));
      
      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false
      });
      return { success: true };
    } catch (err) {
      console.warn('Backend signup failed, using local mock registration', err.message);
      
      // Local Mock Fallback
      const newUser = { ...MOCK_USER, name, email };
      const mockToken = 'mock_jwt_token_12345';
      await AsyncStorage.setItem('user_token', mockToken);
      await AsyncStorage.setItem('user_profile', JSON.stringify(newUser));
      
      set({
        token: mockToken,
        user: newUser,
        isAuthenticated: true,
        isLoading: false
      });
      return { success: true };
    }
  },

  updateProfile: async (updatedData) => {
    try {
      const response = await apiClient.post('/users/profile', updatedData);
      const updatedUser = response.data;
      await AsyncStorage.setItem('user_profile', JSON.stringify(updatedUser));
      set({ user: updatedUser });
    } catch (err) {
      console.warn('Failed to update backend profile, saving locally', err.message);
      const currentUser = get().user || MOCK_USER;
      const updatedUser = { ...currentUser, ...updatedData };
      await AsyncStorage.setItem('user_profile', JSON.stringify(updatedUser));
      set({ user: updatedUser });
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('user_token');
    await AsyncStorage.removeItem('user_profile');
    set({
      token: null,
      user: null,
      isAuthenticated: false
    });
  }
}));
