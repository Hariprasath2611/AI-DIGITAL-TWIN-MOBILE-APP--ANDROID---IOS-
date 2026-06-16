const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory data store for mocking
const mockDb = {
  user: {
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
  },
  projects: [
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
  ],
  experiences: [
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
  ],
  achievements: [
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
  ],
  documents: [
    { id: 'doc_1', name: 'Resume_2026_v4.pdf', size: '1.2 MB', category: 'Resume', uploadedAt: '2026-05-10' },
    { id: 'doc_2', name: 'AI_Agent_Research_Paper.pdf', size: '3.4 MB', category: 'Documents', uploadedAt: '2026-06-01' }
  ],
  memories: [
    { id: 'mem_1', note: 'Prefers TypeScript over Javascript.', timestamp: '2026-06-10T09:30:00Z' },
    { id: 'mem_2', note: 'Targeting Senior AI Architect roles in Berlin/Remote.', timestamp: '2026-06-12T14:20:00Z' }
  ],
  notifications: [
    { id: 'not_1', type: 'recruiter', title: 'New Recruiter Visit', message: 'A technical recruiter from Google viewed your Quantum Agent project.', read: false, time: '10m ago' },
    { id: 'not_2', type: 'system', title: 'AI Recommendation', message: 'Add AWS certification to your projects to increase career matching score by 12%.', read: false, time: '2h ago' }
  ],
  recruiterMessages: [
    { id: 'msg_1', sender: 'Sarah Jennings (Google HR)', text: 'Hey Alex, I saw your GitHub repo for Quantum Agent Workspaces. Do you have time for a chat this Thursday?', time: '3h ago' }
  ]
};

// --- AUTHENTICATION ---
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  // Return dummy credentials with token
  res.json({
    success: true,
    token: 'jwt_token_alex_rivera_quantum_twin',
    user: mockDb.user
  });
});

app.post('/api/auth/signup', (req, res) => {
  const { name, email } = req.body;
  mockDb.user.name = name || mockDb.user.name;
  mockDb.user.email = email || mockDb.user.email;
  res.json({
    success: true,
    token: 'jwt_token_alex_rivera_quantum_twin',
    user: mockDb.user
  });
});

// --- PROFILE & USER ---
app.get('/api/users/profile', (req, res) => {
  res.json(mockDb.user);
});

app.post('/api/users/profile', (req, res) => {
  const { name, title, bio } = req.body;
  if (name) mockDb.user.name = name;
  if (title) mockDb.user.title = title;
  if (bio) mockDb.user.bio = bio;
  res.json(mockDb.user);
});

// --- PROJECTS ---
app.get('/api/projects', (req, res) => {
  res.json(mockDb.projects);
});

app.post('/api/projects', (req, res) => {
  const newProject = {
    id: `proj_${Date.now()}`,
    stars: 0,
    commits: 0,
    lastUpdated: 'Just now',
    ...req.body
  };
  mockDb.projects.push(newProject);
  res.json(newProject);
});

app.put('/api/projects/:id', (req, res) => {
  const index = mockDb.projects.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    mockDb.projects[index] = { ...mockDb.projects[index], ...req.body };
    res.json(mockDb.projects[index]);
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});

app.delete('/api/projects/:id', (req, res) => {
  mockDb.projects = mockDb.projects.filter(p => p.id !== req.params.id);
  res.json({ success: true });
});

// --- SKILLS ---
app.get('/api/skills', (req, res) => {
  res.json(mockDb.user.skills);
});

app.post('/api/skills', (req, res) => {
  const newSkill = {
    id: `skill_${Date.now()}`,
    ...req.body
  };
  mockDb.user.skills.push(newSkill);
  res.json(newSkill);
});

// --- EXPERIENCES ---
app.get('/api/experiences', (req, res) => {
  res.json(mockDb.experiences);
});

app.post('/api/experiences', (req, res) => {
  const newExp = {
    id: `exp_${Date.now()}`,
    ...req.body
  };
  mockDb.experiences.push(newExp);
  res.json(newExp);
});

// --- DOCUMENTS / KNOWLEDGE BASE ---
app.get('/api/documents', (req, res) => {
  res.json(mockDb.documents);
});

app.post('/api/documents', (req, res) => {
  const newDoc = {
    id: `doc_${Date.now()}`,
    size: '1.5 MB',
    uploadedAt: new Date().toISOString().split('T')[0],
    ...req.body
  };
  mockDb.documents.push(newDoc);
  res.json(newDoc);
});

app.delete('/api/documents/:id', (req, res) => {
  mockDb.documents = mockDb.documents.filter(d => d.id !== req.params.id);
  res.json({ success: true });
});

// --- MEMORIES ---
app.get('/api/memories', (req, res) => {
  res.json(mockDb.memories);
});

app.post('/api/memories', (req, res) => {
  const newMemory = {
    id: `mem_${Date.now()}`,
    timestamp: new Date().toISOString(),
    ...req.body
  };
  mockDb.memories.push(newMemory);
  res.json(newMemory);
});

// --- GITHUB & LINKEDIN ---
app.get('/api/github/stats', (req, res) => {
  res.json({
    username: 'alexrivera',
    stars: 213,
    commitsThisMonth: 145,
    contributions: 1420,
    languages: {
      TypeScript: 55,
      JavaScript: 25,
      Python: 15,
      HTML: 5
    },
    strengthReport: 'Exceptional. Developer consistently outputs high quality code in modular clusters. Highly active on weekends.',
    consistencyScore: 92
  });
});

app.get('/api/linkedin/profile', (req, res) => {
  res.json({
    synced: true,
    connections: 500,
    profileSummary: mockDb.user.bio
  });
});

// --- ANALYTICS ---
app.get('/api/analytics', (req, res) => {
  res.json({
    profileGrowth: [
      { month: 'Jan', score: 60 },
      { month: 'Feb', score: 65 },
      { month: 'Mar', score: 70 },
      { month: 'Apr', score: 75 },
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
  });
});

// --- CHAT & SUGGESTIONS ---
app.post('/api/chat/message', (req, res) => {
  const { message } = req.body;
  let reply = '';

  // Simple rule-based mock matching if no Gemini key is used
  const lowerMsg = message.toLowerCase();
  if (lowerMsg.includes('resume') || lowerMsg.includes('cv')) {
    reply = "I've reviewed your resume. I suggest enhancing the 'Quantum Agent Workspaces' description: explain how you handled latency in multi-agent handoffs. Let me know if you'd like me to draft that section.";
  } else if (lowerMsg.includes('interview') || lowerMsg.includes('practice')) {
    reply = "I can guide you through a Mock Interview! I support Frontend, Backend, Full Stack, and Mobile configurations. Which one would you like to launch?";
  } else if (lowerMsg.includes('project') || lowerMsg.includes('portfolio')) {
    reply = "Your public portfolio currently features 'Quantum Agent Workspaces' and 'Glassmorphic Mobile Kit'. Visitors have surged 40% this week. I suggest highlighting your skill badge for React Native Reanimated.";
  } else if (lowerMsg.includes('salary') || lowerMsg.includes('market')) {
    reply = "Based on your tech stack (React Native + LangChain) and Senior role expectations, current remote salary ranges from $130,000 to $165,000 USD, with premium bonuses for generative AI integrations.";
  } else {
    reply = `As your Digital Twin Assistant, I've analyzed your question: "${message}". Based on your knowledge base (Resume, Projects) and preferences, I recommend focusing on learning LangChain core callbacks. How can I help you implement this?`;
  }

  res.json({
    reply,
    suggestedFollowups: [
      'Draft resume description',
      'Start a Backend mock interview',
      'Optimize my project tech tags'
    ]
  });
});

// --- NOTIFICATIONS ---
app.get('/api/notifications', (req, res) => {
  res.json(mockDb.notifications);
});

app.post('/api/notifications/read', (req, res) => {
  mockDb.notifications.forEach(n => n.read = true);
  res.json({ success: true });
});

// --- SOCKET CONNECTIONS (Realtime Chat and Events) ---
io.on('connection', (socket) => {
  console.log(`Socket client connected: ${socket.id}`);

  socket.on('sendMessage', (data) => {
    const { text, user } = data;
    console.log(`Received chat message from ${user?.name || 'Anonymous'}: ${text}`);

    // Simulate typing indicator trigger
    socket.emit('typing', { typing: true });

    setTimeout(() => {
      let replyText = `Received: "${text}". I have synced this request to your Digital Twin backend. What would you like to build next?`;
      if (text.toLowerCase().includes('hello') || text.toLowerCase().includes('hi')) {
        replyText = `Hello Alex! How is your digital twin doing today? Let's check your career analytics or start an AI Mock Interview.`;
      }
      
      socket.emit('typing', { typing: false });
      socket.emit('receiveMessage', {
        id: `msg_socket_${Date.now()}`,
        text: replyText,
        createdAt: new Date().toISOString(),
        user: {
          _id: 2,
          name: 'AI Twin',
          avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200'
        }
      });
    }, 1200);
  });

  socket.on('disconnect', () => {
    console.log(`Socket client disconnected: ${socket.id}`);
  });
});

// Trigger a mock recruiter visit notification every 30 seconds for active testing
setInterval(() => {
  const randomViews = Math.floor(Math.random() * 5) + 1;
  const newNotification = {
    id: `not_${Date.now()}`,
    type: 'recruiter',
    title: 'Recruiter Engagement',
    message: `${randomViews} recruiters from top companies checked your portfolio.`,
    read: false,
    time: 'Just now'
  };
  mockDb.notifications.unshift(newNotification);
  
  // Notify connected sockets
  io.emit('newNotification', newNotification);
}, 35000);

server.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`AI Digital Twin Mock Backend is running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}/api`);
  console.log(`Socket Endpoint: http://localhost:${PORT}`);
  console.log(`===================================================`);
});
