export const COLORS = {
  background: '#0B1120', // Deep Midnight Blue
  cardBackground: 'rgba(17, 24, 39, 0.7)', // Sleek dark card backing
  glassBackground: 'rgba(255, 255, 255, 0.05)', // Frosted glass overlay
  glassBorder: 'rgba(255, 255, 255, 0.1)', // Subtle glass border
  primary: '#06B6D4', // Electric Cyan
  secondary: '#8B5CF6', // Neon Purple
  textPrimary: '#FFFFFF', // High-contrast text
  textSecondary: '#94A3B8', // Subdued text
  accentCyan: '#22D3EE',
  accentPurple: '#A78BFA',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  border: 'rgba(255, 255, 255, 0.08)'
};

export const GRADIENTS = {
  primary: [COLORS.primary, COLORS.secondary],
  dark: ['#0B1120', '#1E1B4B'],
  cyanGlow: ['rgba(6, 182, 212, 0.15)', 'rgba(6, 182, 212, 0)'],
  purpleGlow: ['rgba(139, 92, 246, 0.15)', 'rgba(139, 92, 246, 0)']
};

export const SHADOWS = {
  glowCyan: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8
  },
  glowPurple: {
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8
  },
  glass: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10
  }
};

export const GLASS_STYLE = {
  backgroundColor: COLORS.glassBackground,
  borderColor: COLORS.glassBorder,
  borderWidth: 1,
  borderRadius: 16,
  padding: 16,
  ...SHADOWS.glass
};
