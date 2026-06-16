import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import { COLORS } from '../theme/theme';

const MOCK_QUESTIONS = {
  'Mobile Developer': [
    'Explain the React Native bridge architecture and how it differs in the new architecture (TurboModules/Fabric).',
    'How do you optimize list rendering in React Native for lists with over 10,000 complex items?',
    'What strategies do you use for secure token and token cache management on iOS and Android devices?',
    'Explain the Expo updates mechanism and how EAS Update works under the hood.',
    'How do you manage local offline caches using SQLite or watermelondb?'
  ],
  'Frontend Developer': [
    'What is the difference between Virtual DOM and Shadow DOM?',
    'How does React Server Components differ from Server Side Rendering (SSR)?',
    'Explain how web workers work and when you would implement them.',
    'How do you optimize Core Web Vitals on a high-traffic e-commerce landing page?',
    'What is your approach to micro-frontend architectures?'
  ],
  'Backend Developer': [
    'How do you scale WebSocket connections to support 1 million concurrent users?',
    'Explain the CAP theorem and how it guides database choice.',
    'How does a message queue like RabbitMQ handle worker failure?',
    'What is your strategy for schema migrations in high-availability SQL databases?',
    'How do you prevent SQL injection and DDoS attacks at the API Gateway level?'
  ],
  'Full Stack Developer': [
    'Describe the end-to-end flow of a request from client click to database and back.',
    'How do you handle atomic transaction failures across microservices?',
    'What is your approach to caching strategies (Write-through vs Write-back)?',
    'How do you implement OAuth2 and Refresh tokens securely?',
    'Explain your methodology for continuous delivery pipelines.'
  ]
};

export default function MockInterviewScreen({ route, navigation }) {
  const { mode } = route.params;
  const trackName = MOCK_QUESTIONS[mode] ? mode : 'Mobile Developer';
  const questions = MOCK_QUESTIONS[trackName];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);

  const handleNext = () => {
    if (!currentAnswer.trim() && !voiceMode) {
      Alert.alert('Empty Answer', 'Please speak or write your answer before proceeding.');
      return;
    }

    const updatedAnswers = [...answers, currentAnswer || 'Answer provided via Voice Input interface.'];
    setAnswers(updatedAnswers);
    setCurrentAnswer('');

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleVoiceInputSimulate = () => {
    Alert.alert(
      '🎙️ Recording Audio',
      'Speaking: "I would use a FlatList with getItemLayout, windowSize, and memoized items..."',
      [
        {
          text: 'Apply Text',
          onPress: () => setCurrentAnswer('I would use a FlatList with getItemLayout, windowSize, and memoized render items to prevent re-renders.')
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header back */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#FFF" />
        </Pressable>
        <Text style={styles.headerTitle}>{trackName} Interview</Text>
      </View>

      {!isFinished ? (
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Question Index Progress */}
          <View style={styles.progressRow}>
            {questions.map((_, i) => (
              <View 
                key={i} 
                style={[
                  styles.progressBar, 
                  i <= currentIndex ? styles.activeProgressBar : styles.inactiveProgressBar
                ]}
              />
            ))}
          </View>

          {/* Question Card */}
          <Animated.View entering={FadeIn.duration(400)}>
            <GlassCard style={styles.questionCard}>
              <Text style={styles.questionLabel}>QUESTION {currentIndex + 1} OF {questions.length}</Text>
              <Text style={styles.questionText}>{questions[currentIndex]}</Text>
            </GlassCard>
          </Animated.View>

          {/* Mode switch */}
          <View style={styles.modeRow}>
            <Pressable 
              onPress={() => setVoiceMode(false)} 
              style={[styles.modeBtn, !voiceMode && styles.activeModeBtn]}
            >
              <Ionicons name="create-outline" size={16} color={!voiceMode ? '#FFF' : COLORS.textSecondary} />
              <Text style={[styles.modeText, !voiceMode && styles.activeModeText]}>Text Mode</Text>
            </Pressable>
            <Pressable 
              onPress={() => setVoiceMode(true)} 
              style={[styles.modeBtn, voiceMode && styles.activeModeBtn]}
            >
              <Ionicons name="mic-outline" size={16} color={voiceMode ? '#FFF' : COLORS.textSecondary} />
              <Text style={[styles.modeText, voiceMode && styles.activeModeText]}>Voice Mode</Text>
            </Pressable>
          </View>

          {/* Answer Workspace */}
          {voiceMode ? (
            <Pressable onPress={handleVoiceInputSimulate} style={styles.voiceTrigger}>
              <Ionicons name="mic" size={48} color={COLORS.primary} />
              <Text style={styles.voiceText}>Tap to start speaking</Text>
              <Text style={styles.voiceSub}>AI will transcribe and evaluate answers</Text>
            </Pressable>
          ) : (
            <GlassCard style={styles.answerCard}>
              <TextInput
                style={styles.answerInput}
                placeholder="Type your explanation here..."
                placeholderTextColor="rgba(255,255,255,0.4)"
                multiline
                value={currentAnswer}
                onChangeText={setCurrentAnswer}
              />
            </GlassCard>
          )}

          <GlowButton 
            title={currentIndex === questions.length - 1 ? "Complete Interview" : "Submit Answer"} 
            onPress={handleNext}
            style={styles.actionBtn}
          />
        </ScrollView>
      ) : (
        // Scorecard display
        <Animated.View entering={SlideInDown.duration(600)} style={styles.scorecardContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            
            <GlassCard style={styles.scoreCard}>
              <Text style={styles.scoreTitle}>INTERVIEW EVALUATION</Text>
              <Text style={styles.scoreValue}>88%</Text>
              <Text style={styles.scoreRating}>Excellent Strength Rating</Text>
              
              <View style={styles.metricsGrid}>
                <View style={styles.metric}>
                  <Text style={styles.metricVal}>5/5</Text>
                  <Text style={styles.metricLbl}>Completed</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricVal}>Good</Text>
                  <Text style={styles.metricLbl}>Consistency</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricVal}>94%</Text>
                  <Text style={styles.metricLbl}>Vocabulary</Text>
                </View>
              </View>
            </GlassCard>

            <GlassCard style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Ionicons name="sparkles" size={18} color={COLORS.primary} />
                <Text style={styles.summaryTitle}>AI Feedback Report</Text>
              </View>
              <Text style={styles.summaryBody}>
                "You demonstrate high proficiency in listing optimization and caching hooks. In bridge explanations, we recommend speaking more explicitly about JSI (JavaScript Interface) and C++ bindings in the new architecture."
              </Text>
            </GlassCard>

            <GlowButton 
              title="Return to Career Center" 
              onPress={() => navigation.goBack()}
              style={styles.actionBtn}
            />

          </ScrollView>
        </Animated.View>
      )}
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
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  activeProgressBar: {
    backgroundColor: COLORS.primary,
  },
  inactiveProgressBar: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  questionCard: {
    padding: 24,
  },
  questionLabel: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  questionText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  activeModeBtn: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  modeText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  activeModeText: {
    color: '#FFF',
  },
  answerCard: {
    padding: 16,
    height: 180,
  },
  answerInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 14,
    lineHeight: 22,
    textAlignVertical: 'top',
  },
  voiceTrigger: {
    height: 180,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.25)',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(6, 182, 212, 0.02)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  voiceText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  voiceSub: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  actionBtn: {
    width: '100%',
    marginTop: 12,
  },
  scorecardContainer: {
    flex: 1,
  },
  scoreCard: {
    padding: 24,
    alignItems: 'center',
  },
  scoreTitle: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  scoreValue: {
    color: COLORS.primary,
    fontSize: 64,
    fontWeight: '900',
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  scoreRating: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 20,
  },
  metricsGrid: {
    flexDirection: 'row',
    width: '100%',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingTop: 16,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricVal: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  metricLbl: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 4,
  },
  summaryCard: {
    padding: 20,
    backgroundColor: 'rgba(6, 182, 212, 0.03)',
    borderColor: 'rgba(6, 182, 212, 0.15)',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  summaryTitle: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  summaryBody: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
});
