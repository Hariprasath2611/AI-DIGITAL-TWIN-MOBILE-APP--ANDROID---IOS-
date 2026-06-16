import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import GlassCard from '../components/GlassCard';
import { COLORS } from '../theme/theme';

export default function ProjectDetailsScreen({ route, navigation }) {
  const { project } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Back Button */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#FFF" />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>{project.title}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Core Stats Row */}
        <Animated.View entering={FadeInUp.duration(400)} style={styles.statsRow}>
          <GlassCard style={styles.statCard}>
            <Ionicons name="star" size={24} color={COLORS.warning} />
            <Text style={styles.statVal}>{project.stars || 124}</Text>
            <Text style={styles.statLbl}>Stars</Text>
          </GlassCard>

          <GlassCard style={styles.statCard}>
            <Ionicons name="git-commit" size={24} color={COLORS.primary} />
            <Text style={styles.statVal}>{project.commits || 342}</Text>
            <Text style={styles.statLbl}>Commits</Text>
          </GlassCard>

          <GlassCard style={styles.statCard}>
            <Ionicons name="time" size={24} color={COLORS.secondary} />
            <Text style={styles.statVal}>Active</Text>
            <Text style={styles.statLbl}>{project.lastUpdated || '2 hours ago'}</Text>
          </GlassCard>
        </Animated.View>

        {/* Project Description */}
        <Animated.View entering={FadeInUp.delay(100).duration(400)}>
          <GlassCard style={styles.card}>
            <Text style={styles.cardTitle}>Overview</Text>
            <Text style={styles.bodyText}>{project.description}</Text>
            
            <Text style={styles.subTitle}>Tech Stack Tags</Text>
            <View style={styles.tagRow}>
              {project.techStack?.map((tag, i) => (
                <View key={i} style={styles.tagBadge}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </GlassCard>
        </Animated.View>

        {/* AI Analytics Summary */}
        <Animated.View entering={FadeInUp.delay(200).duration(400)}>
          <GlassCard style={styles.aiCard}>
            <View style={styles.aiHeader}>
              <Ionicons name="sparkles" size={18} color={COLORS.primary} />
              <Text style={styles.aiTitle}>AI Twin Integration Report</Text>
            </View>
            <Text style={styles.aiBody}>
              {project.aiSummary || "No AI summary compiled yet. The Twin is queuing repo files for static analysis."}
            </Text>
          </GlassCard>
        </Animated.View>

        {/* GitHub Repository Sync Details */}
        <Animated.View entering={FadeInUp.delay(300).duration(400)}>
          <GlassCard style={styles.card}>
            <Text style={styles.cardTitle}>Repository Diagnostics</Text>
            <View style={styles.diagRow}>
              <Text style={styles.diagLabel}>Link State</Text>
              <Text style={[styles.diagValue, { color: COLORS.success }]}>Connected</Text>
            </View>
            <View style={styles.diagRow}>
              <Text style={styles.diagLabel}>Main Webhook</Text>
              <Text style={styles.diagValue}>active_production</Text>
            </View>
            <View style={styles.diagRow}>
              <Text style={styles.diagLabel}>Sync Frequency</Text>
              <Text style={styles.diagValue}>Upon Git Push commits</Text>
            </View>
          </GlassCard>
        </Animated.View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1120',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    gap: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  statVal: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLbl: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
  card: {
    padding: 20,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  bodyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tagBadge: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.07)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  tagText: {
    color: COLORS.primary,
    fontSize: 12,
  },
  aiCard: {
    padding: 20,
    backgroundColor: 'rgba(6, 182, 212, 0.03)',
    borderColor: 'rgba(6, 182, 212, 0.15)',
    borderWidth: 1,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  aiTitle: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  aiBody: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  diagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  diagLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  diagValue: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
