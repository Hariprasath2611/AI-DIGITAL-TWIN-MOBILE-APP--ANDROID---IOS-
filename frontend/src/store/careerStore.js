import { create } from 'zustand';
import apiClient from '../api/apiClient';

const MOCK_EXPERIENCES = [
  {
    id: 'exp_1',
    company: 'Quantum Tech Labs',
    role: 'Lead Mobile Developer',
    type: 'Full-time',
    duration: '2024 - Present',
    description: 'Architecting cross-platform AI solutions and leading the mobile dashboard development using React Native and Expo.',
    insights: 'Spearheaded adoption of local SQLite caching, increasing user retention by 25%.'
  },
  {
    id: 'exp_2',
    company: 'Aether Software',
    role: 'Full Stack Engineer',
    type: 'Contract',
    duration: '2022 - 2024',
    description: 'Created responsive frontend client dashboards and optimized Node.js microservices for real-time WebSockets.',
    insights: 'Integrated Redis-based message queue, dropping WebSocket event latency by 40%.'
  }
];

const MOCK_ACHIEVEMENTS = [
  {
    id: 'ach_1',
    title: 'Global Generative AI Hackathon - 1st Place',
    category: 'Hackathon',
    date: 'Dec 2025',
    score: 95,
    description: 'Won first prize among 500+ global teams by creating an autonomous agent that drafts, tests, and deploys npm libraries.'
  },
  {
    id: 'ach_2',
    title: 'AWS Certified Solutions Architect',
    category: 'Certification',
    date: 'Mar 2025',
    score: 88,
    description: 'Completed architecting training and validated cloud service optimization.'
  }
];

const MOCK_DOCUMENTS = [
  { id: 'doc_1', name: 'Resume_2026_v4.pdf', size: '1.2 MB', category: 'Resume', uploadedAt: '2026-05-10' },
  { id: 'doc_2', name: 'AI_Agent_Research_Paper.pdf', size: '3.4 MB', category: 'Documents', uploadedAt: '2026-06-01' }
];

const MOCK_ANALYTICS = {
  profileGrowth: [
    { month: 'Jan', score: 60 },
    { month: 'Feb', score: 63 },
    { month: 'Mar', score: 70 },
    { month: 'Apr', score: 74 },
    { month: 'May', score: 80 },
    { month: 'Jun', score: 85 }
  ],
  skillGrowth: [
    { name: 'AI Agent Architectures', level: 40 },
    { name: 'React Native', level: 90 },
    { name: 'TypeScript', level: 80 },
    { name: 'System Design', level: 75 }
  ],
  recruiterEngagement: [
    { week: 'W1', views: 8 },
    { week: 'W2', views: 15 },
    { week: 'W3', views: 22 },
    { week: 'W4', views: 48 }
  ],
  aiUsage: {
    chatsCount: 120,
    interviewsSimulated: 14,
    resumeReviews: 8
  }
};

export const useCareerStore = create((set, get) => ({
  experiences: [],
  achievements: [],
  documents: [],
  analytics: MOCK_ANALYTICS,
  notifications: [],
  isLoading: false,

  fetchCareerData: async () => {
    set({ isLoading: true });
    try {
      const [expRes, achRes, docRes, anaRes, notRes] = await Promise.all([
        apiClient.get('/experiences'),
        apiClient.get('/achievements').catch(() => ({ data: MOCK_ACHIEVEMENTS })),
        apiClient.get('/documents'),
        apiClient.get('/analytics'),
        apiClient.get('/notifications')
      ]);

      set({
        experiences: expRes.data,
        achievements: achRes.data,
        documents: docRes.data,
        analytics: anaRes.data,
        notifications: notRes.data,
        isLoading: false
      });
    } catch (err) {
      console.warn('Failed to load career data, using mock values', err.message);
      set({
        experiences: MOCK_EXPERIENCES,
        achievements: MOCK_ACHIEVEMENTS,
        documents: MOCK_DOCUMENTS,
        analytics: MOCK_ANALYTICS,
        notifications: [
          { id: 'not_1', type: 'recruiter', title: 'New Recruiter Visit', message: 'A technical recruiter from Google viewed your Quantum Agent project.', read: false, time: '10m ago' },
          { id: 'not_2', type: 'system', title: 'AI Recommendation', message: 'Add AWS certification to your projects to increase career matching score by 12%.', read: false, time: '2h ago' }
        ],
        isLoading: false
      });
    }
  },

  addExperience: async (expData) => {
    try {
      const res = await apiClient.post('/experiences', expData);
      set({ experiences: [...get().experiences, res.data] });
    } catch (err) {
      const newExp = { id: `exp_local_${Date.now()}`, ...expData };
      set({ experiences: [...get().experiences, newExp] });
    }
  },

  addAchievement: async (achData) => {
    try {
      const res = await apiClient.post('/achievements', achData);
      set({ achievements: [...get().achievements, res.data] });
    } catch (err) {
      const newAch = { id: `ach_local_${Date.now()}`, score: 85, ...achData };
      set({ achievements: [...get().achievements, newAch] });
    }
  },

  uploadDocument: async (docData) => {
    try {
      const res = await apiClient.post('/documents', docData);
      set({ documents: [...get().documents, res.data] });
    } catch (err) {
      const newDoc = {
        id: `doc_local_${Date.now()}`,
        size: '1.4 MB',
        uploadedAt: new Date().toISOString().split('T')[0],
        ...docData
      };
      set({ documents: [...get().documents, newDoc] });
    }
  },

  deleteDocument: async (id) => {
    try {
      await apiClient.delete(`/documents/${id}`);
      set({ documents: get().documents.filter(d => d.id !== id) });
    } catch (err) {
      set({ documents: get().documents.filter(d => d.id !== id) });
    }
  },

  markNotificationsAsRead: async () => {
    try {
      await apiClient.post('/notifications/read');
    } catch (e) {
      console.warn('Could not sync read notifications with backend');
    }
    set({
      notifications: get().notifications.map(n => ({ ...n, read: true }))
    });
  }
}));
