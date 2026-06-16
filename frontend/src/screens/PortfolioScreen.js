import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useProjectStore } from '../store/projectStore';
import { useCareerStore } from '../store/careerStore';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import { COLORS } from '../theme/theme';

export default function PortfolioScreen({ navigation }) {
  const [activeSegment, setActiveSegment] = useState('projects'); // projects, knowledge
  const { projects, addProject, deleteProject } = useProjectStore();
  const { documents, uploadDocument, deleteDocument } = useCareerStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  
  // Project input fields
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newTags, setNewTags] = useState('');

  // Handle document upload simulation
  const handleUploadDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        const file = res.assets[0];
        
        uploadDocument({
          name: file.name,
          category: file.mimeType?.includes('pdf') ? 'Resume' : 'Certificates',
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        });
        
        Alert.alert('Upload Successful', `Document "${file.name}" synchronized to cloud database.`);
      }
    } catch (err) {
      console.warn('Document picker cancelled or failed', err);
      // Fallback manual upload input
      Alert.prompt(
        'Upload Document (Simulation)',
        'Enter document name manually:',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Upload',
            onPress: (val) => {
              if (val) {
                uploadDocument({
                  name: val,
                  category: 'Resume',
                  size: '1.1 MB'
                });
                Alert.alert('Success', `Uploaded: ${val}`);
              }
            }
          }
        ]
      );
    }
  };

  const handleCreateProject = () => {
    if (!newTitle || !newDesc || !newCategory) {
      Alert.alert('Error', 'Please fill in Project title, description and category.');
      return;
    }
    const tagsArr = newTags ? newTags.split(',').map(s => s.trim()) : ['React Native'];
    addProject({
      title: newTitle,
      description: newDesc,
      category: newCategory,
      techStack: tagsArr,
      githubLink: 'https://github.com/alexrivera/new-repo',
      aiSummary: 'A custom developer asset compiled and synchronized locally.'
    });
    setNewTitle('');
    setNewDesc('');
    setNewCategory('');
    setNewTags('');
    Alert.alert('Success', 'Project added to your portfolio showcase.');
  };

  const filteredDocs = documents.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Segment Selector */}
      <View style={styles.segmentContainer}>
        <Pressable 
          onPress={() => setActiveSegment('projects')} 
          style={[styles.segmentBtn, activeSegment === 'projects' && styles.activeSegmentBtn]}
        >
          <Text style={[styles.segmentText, activeSegment === 'projects' && styles.activeSegmentText]}>Projects</Text>
        </Pressable>
        <Pressable 
          onPress={() => setActiveSegment('knowledge')} 
          style={[styles.segmentBtn, activeSegment === 'knowledge' && styles.activeSegmentBtn]}
        >
          <Text style={[styles.segmentText, activeSegment === 'knowledge' && styles.activeSegmentText]}>Knowledge Base</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* PROJECTS TAB */}
        {activeSegment === 'projects' && (
          <Animated.View entering={FadeInUp.duration(400)} style={styles.section}>
            <Text style={styles.title}>Project Showcases</Text>
            
            <View style={styles.projectsList}>
              {projects.map((proj, idx) => (
                <GlassCard key={proj.id || idx} style={styles.projCard}>
                  <View style={styles.projHeader}>
                    <Text style={styles.projTitle}>{proj.title}</Text>
                    <Pressable onPress={() => deleteProject(proj.id)}>
                      <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
                    </Pressable>
                  </View>
                  <Text style={styles.projCategory}>{proj.category}</Text>
                  <Text style={styles.projDesc}>{proj.description}</Text>
                  
                  <View style={styles.tagRow}>
                    {proj.techStack?.map((tag, i) => (
                      <View key={i} style={styles.tagBadge}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.metaRow}>
                    <View style={styles.metaCol}>
                      <Ionicons name="star" size={14} color={COLORS.warning} />
                      <Text style={styles.metaText}>{proj.stars || 0} stars</Text>
                    </View>
                    <View style={styles.metaCol}>
                      <Ionicons name="git-commit" size={14} color={COLORS.primary} />
                      <Text style={styles.metaText}>{proj.commits || 0} commits</Text>
                    </View>
                  </View>

                  <GlowButton 
                    title="View Analytics" 
                    onPress={() => navigation.navigate('ProjectDetails', { project: proj })}
                    style={styles.detailsBtn}
                  />
                </GlassCard>
              ))}
            </View>

            {/* Create Project Form */}
            <GlassCard style={styles.formCard}>
              <Text style={styles.formTitle}>Register New Project</Text>
              <TextInput style={styles.input} placeholder="Project Name (e.g. AI Digital Twin App)" placeholderTextColor="rgba(255,255,255,0.4)" value={newTitle} onChangeText={setNewTitle} />
              <TextInput style={styles.input} placeholder="Description (e.g. Companion cross-platform mobile app)" placeholderTextColor="rgba(255,255,255,0.4)" value={newDesc} onChangeText={setNewDesc} />
              <TextInput style={styles.input} placeholder="Category (e.g. Mobile Development)" placeholderTextColor="rgba(255,255,255,0.4)" value={newCategory} onChangeText={setNewCategory} />
              <TextInput style={styles.input} placeholder="Tech Stack Tags (comma separated: React Native, Expo, Zustand)" placeholderTextColor="rgba(255,255,255,0.4)" value={newTags} onChangeText={setNewTags} />
              <GlowButton title="Deploy Project Showcase" onPress={handleCreateProject} />
            </GlassCard>
          </Animated.View>
        )}

        {/* KNOWLEDGE BASE TAB */}
        {activeSegment === 'knowledge' && (
          <Animated.View entering={FadeInUp.duration(400)} style={styles.section}>
            <Text style={styles.title}>Digital Knowledge Nodes</Text>
            <Text style={styles.subtitle}>Upload your PDFs, documents, or research notes. The AI Twin indexes files to context-retrieved prompts.</Text>

            {/* Search inputs */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={18} color={COLORS.textSecondary} />
              <TextInput 
                style={styles.searchInput}
                placeholder="Search knowledge files..." 
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Upload Button */}
            <Pressable onPress={handleUploadDocument} style={styles.uploadCard}>
              <Ionicons name="cloud-upload-outline" size={32} color={COLORS.primary} />
              <Text style={styles.uploadText}>Upload PDF, Word, or Certificate</Text>
              <Text style={styles.uploadSub}>Expo Document Picker Integration</Text>
            </Pressable>

            {/* Document list */}
            <View style={styles.documentsList}>
              {filteredDocs.map((doc, idx) => (
                <GlassCard key={doc.id || idx} style={styles.docCard}>
                  <View style={styles.docRow}>
                    <View style={styles.docIconBg}>
                      <Ionicons 
                        name={doc.category === 'Resume' ? 'document-text' : 'ribbon'} 
                        size={20} 
                        color={COLORS.primary} 
                      />
                    </View>
                    <View style={styles.docInfo}>
                      <Text style={styles.docName} numberOfLines={1}>{doc.name}</Text>
                      <Text style={styles.docMeta}>{doc.category} • {doc.size} • {doc.uploadedAt}</Text>
                    </View>
                    <Pressable onPress={() => deleteDocument(doc.id)} style={styles.docDelete}>
                      <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
                    </Pressable>
                  </View>
                </GlassCard>
              ))}
            </View>
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
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(11, 17, 32, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 12,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
  },
  activeSegmentBtn: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  segmentText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: 'bold',
  },
  activeSegmentText: {
    color: '#FFF',
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    gap: 16,
  },
  title: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 14,
  },
  uploadCard: {
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.25)',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    backgroundColor: 'rgba(6, 182, 212, 0.02)',
    gap: 10,
    marginVertical: 8,
  },
  uploadText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  uploadSub: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  projectsList: {
    gap: 16,
  },
  projCard: {
    padding: 16,
    gap: 10,
  },
  projHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  projCategory: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  projDesc: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  tagBadge: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.07)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  tagText: {
    color: COLORS.primary,
    fontSize: 10,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 4,
  },
  metaCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  detailsBtn: {
    width: '100%',
    marginTop: 8,
  },
  documentsList: {
    gap: 12,
  },
  docCard: {
    padding: 14,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  docIconBg: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docInfo: {
    flex: 1,
    gap: 4,
  },
  docName: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  docMeta: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  docDelete: {
    padding: 6,
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
});
