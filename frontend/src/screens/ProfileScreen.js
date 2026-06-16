import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Switch, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useAuthStore } from '../store/authStore';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import { COLORS } from '../theme/theme';

export default function ProfileScreen({ navigation }) {
  const { user, updateProfile, logout } = useAuthStore();
  
  // Toggles state
  const [isPublic, setIsPublic] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [githubSync, setGithubSync] = useState(true);
  const [linkedinSync, setLinkedinSync] = useState(true);

  // Edit fields
  const [name, setName] = useState(user?.name || 'Alex Rivera');
  const [title, setTitle] = useState(user?.title || 'Senior Full Stack Developer');
  const [bio, setBio] = useState(user?.bio || 'Building future agentic workflows.');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    updateProfile({ name, title, bio });
    setIsEditing(false);
    Alert.alert('Profile Saved', 'Your digital twin parameter state has been updated.');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout Workspace',
      'Are you sure you want to log out of this twin console?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: () => logout() }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Card Header */}
        <Animated.View entering={FadeInUp.duration(500)}>
          <GlassCard style={styles.profileHeaderCard}>
            <View style={styles.avatarRow}>
              <View style={styles.avatarWrapper}>
                <Text style={styles.avatarPlaceholder}>👤</Text>
              </View>
              <View style={styles.profileMeta}>
                {isEditing ? (
                  <TextInput 
                    style={styles.nameInput}
                    value={name}
                    onChangeText={setName}
                  />
                ) : (
                  <Text style={styles.profileName}>{name}</Text>
                )}
                {isEditing ? (
                  <TextInput 
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                  />
                ) : (
                  <Text style={styles.profileTitle}>{title}</Text>
                )}
              </View>
            </View>

            {isEditing ? (
              <TextInput 
                style={[styles.input, styles.bioInput]}
                value={bio}
                onChangeText={setBio}
                multiline
              />
            ) : (
              <Text style={styles.profileBio}>{bio}</Text>
            )}

            <View style={styles.editBtnRow}>
              {isEditing ? (
                <>
                  <Pressable onPress={() => setIsEditing(false)} style={styles.cancelBtn}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </Pressable>
                  <GlowButton title="Save Parameters" onPress={handleSave} style={styles.saveBtn} />
                </>
              ) : (
                <Pressable onPress={() => setIsEditing(true)} style={styles.editBtn}>
                  <Ionicons name="create-outline" size={16} color={COLORS.primary} />
                  <Text style={styles.editText}>Edit Profile Parameters</Text>
                </Pressable>
              )}
            </View>
          </GlassCard>
        </Animated.View>

        {/* Integration Syncs */}
        <Animated.View entering={FadeInUp.delay(100).duration(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>Connected Platforms</Text>
          <GlassCard style={styles.cardSettings}>
            
            <View style={styles.settingRow}>
              <View style={styles.settingLabelCol}>
                <Ionicons name="logo-github" size={20} color="#FFF" />
                <View>
                  <Text style={styles.settingLabel}>Sync GitHub Repositories</Text>
                  <Text style={styles.settingSub}>Imports stars, commits & coding reports</Text>
                </View>
              </View>
              <Switch 
                value={githubSync} 
                onValueChange={setGithubSync} 
                trackColor={{ true: COLORS.primary }}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingLabelCol}>
                <Ionicons name="logo-linkedin" size={20} color="#0077B5" />
                <View>
                  <Text style={styles.settingLabel}>Sync LinkedIn Credentials</Text>
                  <Text style={styles.settingSub}>Syncs experience records hourly</Text>
                </View>
              </View>
              <Switch 
                value={linkedinSync} 
                onValueChange={setLinkedinSync} 
                trackColor={{ true: COLORS.primary }}
              />
            </View>

          </GlassCard>
        </Animated.View>

        {/* Security & Settings Toggles */}
        <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Notifications</Text>
          <GlassCard style={styles.cardSettings}>
            
            <View style={styles.settingRow}>
              <View style={styles.settingLabelCol}>
                <Ionicons name="eye" size={20} color={COLORS.primary} />
                <View>
                  <Text style={styles.settingLabel}>Public Portfolio Twin</Text>
                  <Text style={styles.settingSub}>Allow recruiters to view matching index</Text>
                </View>
              </View>
              <Switch 
                value={isPublic} 
                onValueChange={setIsPublic} 
                trackColor={{ true: COLORS.primary }}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingLabelCol}>
                <Ionicons name="notifications" size={20} color={COLORS.secondary} />
                <View>
                  <Text style={styles.settingLabel}>AI Recommendations Alerts</Text>
                  <Text style={styles.settingSub}>Receive push alerts for career insights</Text>
                </View>
              </View>
              <Switch 
                value={pushEnabled} 
                onValueChange={setPushEnabled} 
                trackColor={{ true: COLORS.primary }}
              />
            </View>

          </GlassCard>
        </Animated.View>

        {/* Logout Control */}
        <Animated.View entering={FadeInUp.delay(300).duration(500)} style={styles.logoutWrapper}>
          <Pressable onPress={handleLogout} style={styles.logoutBtn}>
            <Ionicons name="log-out" size={20} color={COLORS.danger} />
            <Text style={styles.logoutText}>Disconnect Digital Twin Console</Text>
          </Pressable>
        </Animated.View>

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
    gap: 20,
  },
  profileHeaderCard: {
    padding: 20,
    gap: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholder: {
    fontSize: 32,
  },
  profileMeta: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  nameInput: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    color: '#FFF',
    padding: 6,
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileTitle: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  profileBio: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  bioInput: {
    height: 60,
    textAlignVertical: 'top',
  },
  editBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-end',
  },
  editText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
  },
  cancelText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: 'bold',
  },
  saveBtn: {
    alignSelf: 'flex-end',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  cardSettings: {
    paddingVertical: 8,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  settingLabelCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingLabel: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  settingSub: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 2,
    maxWidth: '90%',
  },
  logoutWrapper: {
    marginTop: 12,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 10,
  },
  logoutText: {
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderRadius: 8,
    color: '#FFF',
    padding: 8,
    fontSize: 13,
  },
});
