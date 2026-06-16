import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { useChatStore } from '../store/chatStore';
import GlassCard from '../components/GlassCard';
import { COLORS } from '../theme/theme';

const SUGGESTIONS = [
  'Interview practice',
  'Resume review help',
  'Skill gaps report',
  'Draft professional bio'
];

export default function AIAssistantScreen({ navigation }) {
  const [inputText, setInputText] = useState('');
  const [voiceMode, setVoiceMode] = useState(false);
  const { messages, isTyping, sendMessage, initSocket, disconnectSocket, clearChat } = useChatStore();
  const flatListRef = useRef(null);

  useEffect(() => {
    initSocket();
    return () => disconnectSocket();
  }, []);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
    scrollToBottom();
  };

  const handleSuggestion = (suggestion) => {
    sendMessage(suggestion);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const toggleVoiceMode = () => {
    if (!voiceMode) {
      setVoiceMode(true);
      Alert.alert(
        '🎙️ Voice Assistant Active',
        'Listening to your commands hands-free...',
        [{ text: 'Close', onPress: () => setVoiceMode(false) }]
      );
    } else {
      setVoiceMode(false);
    }
  };

  const renderMessageItem = ({ item }) => {
    const isUser = item.user._id === 1;
    return (
      <View style={[styles.messageRow, isUser ? styles.userRow : styles.botRow]}>
        {!isUser && (
          <View style={styles.botAvatar}>
            <Text style={styles.avatarText}>🤖</Text>
          </View>
        )}
        <GlassCard style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
          <Text style={styles.messageText}>{item.text}</Text>
        </GlassCard>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>AI Digital Twin</Text>
          <Text style={styles.statusText}>
            {isTyping ? 'Twin is thinking...' : 'Ready for queries'}
          </Text>
        </View>
        <View style={styles.headerBtns}>
          <Pressable onPress={clearChat} style={styles.clearBtn}>
            <Ionicons name="refresh" size={18} color={COLORS.textSecondary} />
          </Pressable>
        </View>
      </View>

      {/* Message Area */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={scrollToBottom}
        showsVerticalScrollIndicator={false}
      />

      {/* Suggested Questions (only when input is blank and not typing) */}
      {messages.length === 1 && (
        <View style={styles.suggestionsWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsScroll}>
            {SUGGESTIONS.map((sug, i) => (
              <Pressable key={i} onPress={() => handleSuggestion(sug)} style={styles.suggestionPill}>
                <Text style={styles.suggestionText}>{sug}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Typing indicator */}
      {isTyping && (
        <View style={styles.typingContainer}>
          <Text style={styles.typingText}>Twin is drafting response...</Text>
        </View>
      )}

      {/* Voice Mode Overlay Simulation */}
      {voiceMode && (
        <Animated.View entering={FadeIn} style={styles.voiceOverlay}>
          <View style={styles.voiceOverlayCard}>
            <Ionicons name="mic" size={48} color={COLORS.primary} style={styles.voiceMicIcon} />
            <Text style={styles.voiceTitle}>Hands-free Activated</Text>
            <Text style={styles.voiceSubtitle}>Speak, your AI Twin is listening...</Text>
            <Pressable onPress={() => setVoiceMode(false)} style={styles.voiceCloseBtn}>
              <Text style={styles.voiceCloseText}>Switch to Text</Text>
            </Pressable>
          </View>
        </Animated.View>
      )}

      {/* Input controls */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <View style={styles.inputContainer}>
          <Pressable onPress={toggleVoiceMode} style={styles.voiceBtn}>
            <Ionicons name="mic-outline" size={24} color={COLORS.primary} />
          </Pressable>

          <TextInput
            style={styles.input}
            placeholder="Ask about projects, skills, or interviews..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
          />

          <Pressable onPress={handleSend} style={styles.sendBtn}>
            <Ionicons name="send" size={18} color="#FFF" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
      <View style={{ height: 90 }} />
    </SafeAreaView>
  );
}

// Helper scroll view import
import { ScrollView } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1120',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  title: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusText: {
    color: COLORS.primary,
    fontSize: 12,
    marginTop: 2,
  },
  headerBtns: {
    flexDirection: 'row',
    gap: 12,
  },
  clearBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesList: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    width: '100%',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  botRow: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
  },
  bubble: {
    maxWidth: '80%',
    padding: 14,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: COLORS.secondary,
    borderBottomRightRadius: 2,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  botBubble: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderBottomLeftRadius: 2,
  },
  messageText: {
    color: '#FFF',
    fontSize: 14,
    lineHeight: 20,
  },
  suggestionsWrapper: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  suggestionsScroll: {
    flexDirection: 'row',
  },
  suggestionPill: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  suggestionText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  typingContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  typingText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontStyle: 'italic',
  },
  voiceOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 17, 32, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  voiceOverlayCard: {
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
  },
  voiceMicIcon: {
    marginBottom: 20,
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  voiceTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  voiceSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  voiceCloseBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  voiceCloseText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(11, 17, 32, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    gap: 10,
  },
  voiceBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderRadius: 22,
    color: '#FFF',
    paddingHorizontal: 16,
    height: 44,
    fontSize: 14,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
