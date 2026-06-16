import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
import { useAuthStore } from '../store/authStore';
import { useCareerStore } from '../store/careerStore';
import { useProjectStore } from '../store/projectStore';
import GlassCard from '../components/GlassCard';
import { COLORS, SHADOWS } from '../theme/theme';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { user } = useAuthStore();
  const { experiences, achievements, documents, analytics, fetchCareerData } = useCareerStore();
  const { projects, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchCareerData();
    fetchProjects();
  }, []);

  const profileScore = user?.profileCompletion || 85;
  const aiReadiness = user?.aiReadiness || 78;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <LinearGradient
        colors={['#0B1120', '#020617']}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Welcome Section */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.welcomeRow}>
          <View>
            <Text style={styles.greet}>Welcome back,</Text>
            <Text style={styles.username}>{user?.name || 'Alex Rivera'}</Text>
          </View>
          <View style={styles.avatarGlow}>
            <Ionicons name="sparkles" size={24} color={COLORS.primary} />
          </View>
        </Animated.View>

        {/* Dynamic Score Cards Row */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.scoreRow}>
          
          <GlassCard style={[styles.scoreCard, { flex: 1.1 }]}>
            <Text style={styles.cardHeader}>PROFILE STRENGTH</Text>
            <View style={styles.radialContainer}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                style={styles.radialCircle}
              >
                <Text style={styles.radialText}>{profileScore}%</Text>
              </LinearGradient>
            </View>
            <Text style={styles.scoreCaption}>Synced with LinkedIn</Text>
          </GlassCard>

          <GlassCard style={[styles.scoreCard, { flex: 1 }]}>
            <Text style={styles.cardHeader}>AI READINESS</Text>
            <View style={styles.readinessContainer}>
              <Text style={styles.readinessNumber}>{aiReadiness}%</Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${aiReadiness}%` }]} />
              </View>
              <Text style={styles.scoreCaption}>5/8 Knowledge Nodes</Text>
            </View>
          </GlassCard>

        </Animated.View>

        {/* Quick Actions Grid */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Quick Operations</Text>
          <View style={styles.actionsGrid}>
            <Pressable 
              onPress={() => navigation.navigate('AI Assistant')} 
              style={styles.actionBtn}
            >
              <View style={[styles.actionIconBg, { backgroundColor: 'rgba(6, 182, 212, 0.12)' }]}>
                <Ionicons name="chatbubbles" size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.actionText}>Ask AI Twin</Text>
            </Pressable>

            <Pressable 
              onPress={() => navigation.navigate('MockInterview', { mode: 'Custom' })} 
              style={styles.actionBtn}
            >
              <View style={[styles.actionIconBg, { backgroundColor: 'rgba(139, 92, 246, 0.12)' }]}>
                <Ionicons name="mic" size={20} color={COLORS.secondary} />
              </View>
              <Text style={styles.actionText}>Mock Interview</Text>
            </Pressable>

            <Pressable 
              onPress={() => navigation.navigate('Portfolio')} 
              style={styles.actionBtn}
            >
              <View style={[styles.actionIconBg, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
                <Ionicons name="cloud-upload" size={20} color={COLORS.success} />
              </View>
              <Text style={styles.actionText}>Add Project</Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* Career Insights Widget */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <GlassCard style={styles.insightCard}>
            <View style={styles.insightHeaderRow}>
              <Ionicons name="bulb" size={20} color={COLORS.warning} />
              <Text style={styles.insightHeading}>AI Career Suggestions</Text>
            </View>
            <Text style={styles.insightBody}>
              "Your tech stack matches 88% of Google's Mobile Architect roles. Linking your AWS Cloud certification can push your matching accuracy to 95%."
            </Text>
          </GlassCard>
        </Animated.View>

        {/* GitHub stats and activity */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Connected GitHub Metrics</Text>
          <GlassCard style={styles.githubCard}>
            <View style={styles.gitRow}>
              <View style={styles.gitCol}>
                <Text style={styles.gitMetricLabel}>Commits</Text>
                <Text style={styles.gitMetricVal}>145</Text>
              </View>
              <View style={styles.gitCol}>
                <Text style={styles.gitMetricLabel}>Repos Synced</Text>
                <Text style={styles.gitMetricVal}>12</Text>
              </View>
              <View style={styles.gitCol}>
                <Text style={styles.gitMetricLabel}>Consistency</Text>
                <Text style={[styles.gitMetricVal, { color: COLORS.success }]}>92%</Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        {/* Recent Projects Showcase */}
        <Animated.View entering={FadeInDown.delay(500).duration(500)} style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Active Portfolio Showcase</Text>
            <Pressable onPress={() => navigation.navigate('Portfolio')}>
              <Text style={styles.seeAll}>Manage ({projects.length})</Text>
            </Pressable>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.projectScroll}>
            {projects.map((proj, idx) => (
              <GlassCard key={proj.id || idx} style={styles.projItemCard}>
                <Text style={styles.projTitle} numberOfLines={1}>{proj.title}</Text>
                <Text style={styles.projDesc} numberOfLines={2}>{proj.description}</Text>
                
                <View style={styles.tagRow}>
                  {proj.techStack?.slice(0, 3).map((tag, i) => (
                    <View key={i} style={styles.tagBadge}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>

                <Pressable 
                  style={styles.detailsBtn}
                  onPress={() => navigation.navigate('ProjectDetails', { project: proj })}
                >
                  <Text style={styles.detailsBtnText}>View Analytics</Text>
                  <Ionicons name="arrow-forward-outline" size={14} color={COLORS.primary} />
                </Pressable>
              </GlassCard>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Extra margin to account for Custom Animated Bottom Tab Bar height */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1120',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 16,
  },
  welcomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greet: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  username: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  avatarGlow: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(6, 182, 212, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.glowCyan,
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  scoreCard: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 164,
  },
  cardHeader: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  radialContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  radialCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.glowCyan,
  },
  radialText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scoreCaption: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 8,
  },
  readinessContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  readinessNumber: {
    color: COLORS.secondary,
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 8,
    textShadowColor: COLORS.secondary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  progressBarBg: {
    width: '90%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.secondary,
    borderRadius: 3,
  },
  sectionContainer: {
    marginTop: 20,
    marginBottom: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAll: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 10,
  },
  actionIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  insightCard: {
    padding: 16,
    backgroundColor: 'rgba(245, 158, 11, 0.04)',
    borderColor: 'rgba(245, 158, 11, 0.15)',
    marginTop: 12,
  },
  insightHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  insightHeading: {
    color: COLORS.warning,
    fontSize: 13,
    fontWeight: 'bold',
  },
  insightBody: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  githubCard: {
    padding: 16,
  },
  gitRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  gitCol: {
    alignItems: 'center',
  },
  gitMetricLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginBottom: 6,
  },
  gitMetricVal: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  projectScroll: {
    gap: 16,
    paddingRight: 16,
  },
  projItemCard: {
    width: 260,
    height: 180,
    padding: 16,
    justifyContent: 'space-between',
  },
  projTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  projDesc: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  tagBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  tagText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '500',
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailsBtnText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
});
