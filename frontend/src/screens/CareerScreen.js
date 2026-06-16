import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useCareerStore } from '../store/careerStore';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import { COLORS } from '../theme/theme';

const TRACKS = [
  { title: 'Frontend Developer', icon: '💻', desc: 'React, React Native, TypeScript, CSS architecture' },
  { title: 'Backend Developer', icon: '⚙️', desc: 'Node.js, databases, system design, security, scalability' },
  { title: 'Full Stack Developer', icon: '🌐', desc: 'End-to-end integration, hosting, full lifecycle' },
  { title: 'Mobile Developer', icon: '📱', desc: 'Expo, native bridges, performance, App Store rules' }
];

export default function CareerScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('roadmap'); // roadmap, interviews, tools, achievements
  const { experiences, achievements, addExperience, addAchievement } = useCareerStore();

  const [newRole, setNewRole] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newDuration, setNewDuration] = useState('');

  const [newAchTitle, setNewAchTitle] = useState('');
  const [newAchCategory, setNewAchCategory] = useState('');

  const handleAddExp = () => {
    if (!newRole || !newCompany || !newDuration) {
      Alert.alert('Error', 'Please fill in role, company, and duration.');
      return;
    }
    addExperience({
      role: newRole,
      company: newCompany,
      duration: newDuration,
      description: 'Added manually via workspace dashboard',
      insights: 'AI Twin is processing impacts...'
    });
    setNewRole('');
    setNewCompany('');
    setNewDuration('');
    Alert.alert('Success', 'Experience entry logged into your twin.');
  };

  const handleAddAch = () => {
    if (!newAchTitle || !newAchCategory) {
      Alert.alert('Error', 'Please fill in achievement details.');
      return;
    }
    addAchievement({
      title: newAchTitle,
      category: newAchCategory,
      date: 'Just now',
      description: 'Earned and registered manually.'
    });
    setNewAchTitle('');
    setNewAchCategory('');
    Alert.alert('Success', 'Achievement saved. AI Score updated.');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Sub-Tab Navigation Bar */}
      <View style={styles.subTabBar}>
        <Pressable onPress={() => setActiveTab('roadmap')} style={[styles.subTab, activeTab === 'roadmap' && styles.activeSubTab]}>
          <Text style={[styles.subTabText, activeTab === 'roadmap' && styles.activeSubTabText]}>Roadmap</Text>
        </Pressable>
        <Pressable onPress={() => setActiveTab('interviews')} style={[styles.subTab, activeTab === 'interviews' && styles.activeSubTab]}>
          <Text style={[styles.subTabText, activeTab === 'interviews' && styles.activeSubTabText]}>Interviews</Text>
        </Pressable>
        <Pressable onPress={() => setActiveTab('tools')} style={[styles.subTab, activeTab === 'tools' && styles.activeSubTab]}>
          <Text style={[styles.subTabText, activeTab === 'tools' && styles.activeSubTabText]}>Tools</Text>
        </Pressable>
        <Pressable onPress={() => setActiveTab('achievements')} style={[styles.subTab, activeTab === 'achievements' && styles.activeSubTab]}>
          <Text style={[styles.subTabText, activeTab === 'achievements' && styles.activeSubTabText]}>Badges</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ROADMAP / EXPERIENCES TAB */}
        {activeTab === 'roadmap' && (
          <Animated.View entering={FadeInUp.duration(400)} style={styles.tabContent}>
            <Text style={styles.title}>Career Timeline</Text>
            
            {/* Timeline Tree */}
            <View style={styles.timeline}>
              {experiences.map((exp, idx) => (
                <View key={exp.id || idx} style={styles.timelineItem}>
                  <View style={styles.timelinePoint} />
                  <GlassCard style={styles.timelineCard}>
                    <Text style={styles.roleText}>{exp.role}</Text>
                    <Text style={styles.companyText}>{exp.company} • {exp.duration}</Text>
                    <Text style={styles.descText}>{exp.description}</Text>
                    {exp.insights && (
                      <View style={styles.insightBox}>
                        <Text style={styles.insightTag}>AI INSIGHT</Text>
                        <Text style={styles.insightText}>{exp.insights}</Text>
                      </View>
                    )}
                  </GlassCard>
                </View>
              ))}
            </View>

            {/* Quick Add Form */}
            <GlassCard style={styles.formCard}>
              <Text style={styles.formTitle}>Add Experience Node</Text>
              <TextInput style={styles.input} placeholder="Role (e.g. Mobile Developer)" placeholderTextColor="rgba(255,255,255,0.4)" value={newRole} onChangeText={setNewRole} />
              <TextInput style={styles.input} placeholder="Company (e.g. Tesla)" placeholderTextColor="rgba(255,255,255,0.4)" value={newCompany} onChangeText={setNewCompany} />
              <TextInput style={styles.input} placeholder="Duration (e.g. 2025 - Present)" placeholderTextColor="rgba(255,255,255,0.4)" value={newDuration} onChangeText={setNewDuration} />
              <GlowButton title="Append Experience" onPress={handleAddExp} />
            </GlassCard>
          </Animated.View>
        )}

        {/* MOCK INTERVIEW LAUNCHER TAB */}
        {activeTab === 'interviews' && (
          <Animated.View entering={FadeInUp.duration(400)} style={styles.tabContent}>
            <Text style={styles.title}>AI Mock Interview Coach</Text>
            <Text style={styles.subtitle}>Select an interview track. Your digital twin records answers and delivers feedback score sheets.</Text>

            <View style={styles.tracksGrid}>
              {TRACKS.map((track, idx) => (
                <GlassCard key={idx} style={styles.trackCard}>
                  <View style={styles.trackHeader}>
                    <Text style={styles.trackIcon}>{track.icon}</Text>
                    <Text style={styles.trackTitle}>{track.title}</Text>
                  </View>
                  <Text style={styles.trackDesc}>{track.desc}</Text>
                  <GlowButton 
                    title="Launch Simulator" 
                    onPress={() => navigation.navigate('MockInterview', { mode: track.title })}
                    style={styles.trackBtn}
                  />
                </GlassCard>
              ))}
            </View>
          </Animated.View>
        )}

        {/* CAREER TOOLS TAB */}
        {activeTab === 'tools' && (
          <Animated.View entering={FadeInUp.duration(400)} style={styles.tabContent}>
            <Text style={styles.title}>Brand & Content Builder</Text>
            
            <GlassCard style={styles.toolCard}>
              <View style={styles.toolHeader}>
                <Ionicons name="document-text" size={24} color={COLORS.primary} />
                <Text style={styles.toolTitle}>Resume AI Analyzer</Text>
              </View>
              <Text style={styles.toolDesc}>Upload or analyze your resume text against mobile developer requirements to find skill gaps.</Text>
              <GlowButton title="Run Resume Review" onPress={() => Alert.alert('AI Review', 'Analyzing resume against latest Web3/Mobile job matches... Score: 82/100.')} />
            </GlassCard>

            <GlassCard style={styles.toolCard}>
              <View style={styles.toolHeader}>
                <Ionicons name="sparkles" size={24} color={COLORS.secondary} />
                <Text style={styles.toolTitle}>LinkedIn Bio Generator</Text>
              </View>
              <Text style={styles.toolDesc}>Generate clean LinkedIn summaries matching your GitHub stars, code consistency and latest projects.</Text>
              <GlowButton 
                title="Create Pitch Summary" 
                onPress={() => Alert.alert('Generated Pitch', '"Lead Mobile Developer specialized in high-performance React Native and AI orchestration. Built Quantum Agent workflows, lowering WebSockets latency by 40%."')} 
              />
            </GlassCard>
          </Animated.View>
        )}

        {/* ACHIEVEMENTS TAB */}
        {activeTab === 'achievements' && (
          <Animated.View entering={FadeInUp.duration(400)} style={styles.tabContent}>
            <Text style={styles.title}>Achievements & Certificates</Text>

            <View style={styles.achievementsList}>
              {achievements.map((ach, idx) => (
                <GlassCard key={ach.id || idx} style={styles.achCard}>
                  <View style={styles.achHeaderRow}>
                    <Text style={styles.achTitleText}>{ach.title}</Text>
                    <View style={styles.scoreBadge}>
                      <Text style={styles.scoreBadgeText}>🏆 {ach.score || 85}%</Text>
                    </View>
                  </View>
                  <Text style={styles.achMeta}>{ach.category} • {ach.date}</Text>
                  <Text style={styles.achDesc}>{ach.description}</Text>
                </GlassCard>
              ))}
            </View>

            {/* Quick Add Achievement Form */}
            <GlassCard style={styles.formCard}>
              <Text style={styles.formTitle}>Register New Milestone</Text>
              <TextInput style={styles.input} placeholder="Milestone (e.g. AWS Certified Solutions Architect)" placeholderTextColor="rgba(255,255,255,0.4)" value={newAchTitle} onChangeText={setNewAchTitle} />
              <TextInput style={styles.input} placeholder="Category (e.g. Certification, Hackathon)" placeholderTextColor="rgba(255,255,255,0.4)" value={newAchCategory} onChangeText={setNewAchCategory} />
              <GlowButton title="Submit Achievement" onPress={handleAddAch} />
            </GlassCard>
          </Animated.View>
        )}

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
  subTabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(11, 17, 32, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  subTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeSubTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  subTabText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  activeSubTabText: {
    color: COLORS.primary,
  },
  scrollContent: {
    padding: 20,
  },
  tabContent: {
    gap: 16,
  },
  title: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  timeline: {
    paddingLeft: 16,
    borderLeftWidth: 1.5,
    borderLeftColor: 'rgba(255,255,255,0.1)',
    marginLeft: 8,
    gap: 24,
    marginVertical: 16,
  },
  timelineItem: {
    position: 'relative',
  },
  timelinePoint: {
    position: 'absolute',
    left: -22,
    top: 14,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: '#0B1120',
  },
  timelineCard: {
    padding: 16,
  },
  roleText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  companyText: {
    color: COLORS.primary,
    fontSize: 13,
    marginTop: 4,
  },
  descText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
  },
  insightBox: {
    backgroundColor: 'rgba(6, 182, 212, 0.05)',
    borderColor: 'rgba(6, 182, 212, 0.15)',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
  },
  insightTag: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  insightText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 4,
    lineHeight: 16,
  },
  formCard: {
    padding: 20,
    gap: 12,
    marginTop: 16,
  },
  formTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderRadius: 10,
    color: '#FFF',
    padding: 12,
    fontSize: 14,
  },
  tracksGrid: {
    gap: 16,
  },
  trackCard: {
    padding: 18,
    gap: 12,
  },
  trackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trackIcon: {
    fontSize: 24,
  },
  trackTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  trackDesc: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  trackBtn: {
    marginTop: 8,
  },
  toolCard: {
    padding: 20,
    gap: 12,
  },
  toolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toolTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toolDesc: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  achievementsList: {
    gap: 16,
  },
  achCard: {
    padding: 16,
    gap: 8,
  },
  achHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  achTitleText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
  },
  scoreBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  scoreBadgeText: {
    color: COLORS.warning,
    fontSize: 11,
    fontWeight: 'bold',
  },
  achMeta: {
    color: COLORS.primary,
    fontSize: 12,
  },
  achDesc: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
});
