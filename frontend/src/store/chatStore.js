import { create } from 'zustand';
import io from 'socket.io-client';
import apiClient, { getBaseUrl } from '../api/apiClient';

const INITIAL_MOCK_MESSAGES = [
  {
    id: 'msg_1',
    text: "Hello Alex! I am your AI Digital Twin. I'm synchronized with your resume, portfolio certificates, and GitHub stats. Ask me anything about career strategies, skill gaps, or let's start a mock interview!",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    user: {
      _id: 2,
      name: 'AI Twin',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200'
    }
  }
];

export const useChatStore = create((set, get) => ({
  messages: INITIAL_MOCK_MESSAGES,
  memories: [],
  socket: null,
  isTyping: false,
  isLoading: false,

  initSocket: (userInfo) => {
    if (get().socket) return;
    
    // Convert API URL endpoint back to main URL (e.g. drop /api)
    const baseApiUrl = getBaseUrl();
    const socketUrl = baseApiUrl.replace(/\/api$/, '') || 'http://localhost:5051';
    
    console.log('Connecting socket to:', socketUrl);
    const newSocket = io(socketUrl);
    
    newSocket.on('connect', () => {
      console.log('Socket.io connected to backend successfully');
    });

    newSocket.on('typing', (data) => {
      set({ isTyping: data.typing });
    });

    newSocket.on('receiveMessage', (message) => {
      set({
        messages: [...get().messages, message]
      });
    });

    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const s = get().socket;
    if (s) {
      s.disconnect();
      set({ socket: null });
    }
  },

  sendMessage: async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: `msg_user_${Date.now()}`,
      text,
      createdAt: new Date().toISOString(),
      user: {
        _id: 1,
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
      }
    };

    // Append user message immediately
    set({
      messages: [...get().messages, userMessage],
      isTyping: true
    });

    const s = get().socket;
    if (s && s.connected) {
      // Send via real-time WebSocket if connected
      s.emit('sendMessage', { text, user: { name: 'Alex Rivera' } });
    } else {
      // Fallback to HTTP API Client chat message
      try {
        const response = await apiClient.post('/chat/message', { message: text });
        const { reply } = response.data;
        
        set({ isTyping: false });
        
        const botMessage = {
          id: `msg_bot_${Date.now()}`,
          text: reply,
          createdAt: new Date().toISOString(),
          user: {
            _id: 2,
            name: 'AI Twin',
            avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200'
          }
        };

        set({
          messages: [...get().messages, botMessage]
        });
      } catch (err) {
        console.warn('Chat API failed, responding with local fallback rules', err.message);
        
        setTimeout(() => {
          let replyText = `I processed your message: "${text}". However, the digital twin backend API is offline. Here is a simulated suggestion: Focus on optimizing your TypeScript type definitions in 'Quantum Agent Workspaces'.`;
          if (text.toLowerCase().includes('hello') || text.toLowerCase().includes('hi')) {
            replyText = "Hello! I am offline, but I can still read your cached profile. Would you like to practice a mock interview?";
          }
          
          const botMessage = {
            id: `msg_bot_${Date.now()}`,
            text: replyText,
            createdAt: new Date().toISOString(),
            user: {
              _id: 2,
              name: 'AI Twin',
              avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200'
            }
          };
          set({
            messages: [...get().messages, botMessage],
            isTyping: false
          });
        }, 1000);
      }
    }
  },

  fetchMemories: async () => {
    try {
      const response = await apiClient.get('/memories');
      set({ memories: response.data });
    } catch (err) {
      console.warn('Failed to load memories, using mock', err.message);
      set({
        memories: [
          { id: 'mem_1', note: 'Prefers TypeScript over Javascript.', timestamp: '2026-06-10T09:30:00Z' },
          { id: 'mem_2', note: 'Targeting Senior AI Architect roles in Berlin/Remote.', timestamp: '2026-06-12T14:20:00Z' }
        ]
      });
    }
  },

  addMemory: async (note) => {
    try {
      const response = await apiClient.post('/memories', { note });
      set({ memories: [...get().memories, response.data] });
    } catch (err) {
      const newMemory = {
        id: `mem_local_${Date.now()}`,
        note,
        timestamp: new Date().toISOString()
      };
      set({ memories: [...get().memories, newMemory] });
    }
  },

  clearChat: () => {
    set({ messages: INITIAL_MOCK_MESSAGES });
  }
}));
