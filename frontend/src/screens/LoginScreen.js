import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuthStore } from '../store/authStore';
import GlowButton from '../components/GlowButton';
import GlassCard from '../components/GlassCard';
import { COLORS } from '../theme/theme';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('alex.rivera@quantumai.dev');
  const [password, setPassword] = useState('password123');
  const { login, error, isLoading } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter your email and password');
      return;
    }
    const result = await login(email, password);
    if (!result.success) {
      Alert.alert('Login Failed', result.error || 'Check details');
    }
  };

  const handleOAuthLogin = async (platform) => {
    // Simulate GitHub or Google Login using mock response
    Alert.alert(`OAuth Sync`, `Authenticating securely via ${platform}...`);
    const result = await login(`oauth_${platform}@quantum.dev`, 'oauth_password');
    if (!result.success) {
      Alert.alert('Login Failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0F172A', '#020617']}
        style={StyleSheet.absoluteFillObject}
      />

      <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Securely access your AI Digital Twin</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.formContainer}>
        <GlassCard style={styles.glassCard}>
          <Text style={styles.label}>EMAIL ADDRESS</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>PASSWORD</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Pressable onPress={() => Alert.alert('Reset Password', 'An email verification link has been sent.')}>
            <Text style={styles.forgot}>Forgot password?</Text>
          </Pressable>

          <GlowButton
            title={isLoading ? "Authenticating..." : "Sign In"}
            onPress={handleLogin}
            style={styles.signInButton}
          />
        </GlassCard>
      </Animated.View>

      {/* OAuth Options */}
      <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.oauthContainer}>
        <Text style={styles.dividerText}>OR CONNECT VIA</Text>
        
        <View style={styles.oauthRow}>
          <Pressable 
            onPress={() => handleOAuthLogin('Google')}
            style={styles.oauthButton}
          >
            <Text style={styles.oauthIcon}>🌐</Text>
            <Text style={styles.oauthBtnText}>Google</Text>
          </Pressable>

          <Pressable 
            onPress={() => handleOAuthLogin('GitHub')}
            style={styles.oauthButton}
          >
            <Text style={styles.oauthIcon}>🐙</Text>
            <Text style={styles.oauthBtnText}>GitHub</Text>
          </Pressable>
        </View>

        <Pressable onPress={() => navigation.navigate('Signup')} style={styles.signupLink}>
          <Text style={styles.signupText}>
            Don't have an account? <Text style={styles.signupHighlight}>Sign Up</Text>
          </Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    backgroundColor: '#0B1120',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 32,
  },
  glassCard: {
    padding: 24,
  },
  label: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderRadius: 12,
    color: '#FFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 20,
  },
  forgot: {
    color: COLORS.secondary,
    textAlign: 'right',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 24,
  },
  signInButton: {
    width: '100%',
  },
  oauthContainer: {
    alignItems: 'center',
    gap: 16,
  },
  dividerText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  oauthRow: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  oauthButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  oauthIcon: {
    fontSize: 18,
  },
  oauthBtnText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  signupLink: {
    marginTop: 16,
  },
  signupText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  signupHighlight: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
