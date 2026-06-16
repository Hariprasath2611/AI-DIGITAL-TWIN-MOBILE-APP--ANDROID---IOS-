import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuthStore } from '../store/authStore';
import GlowButton from '../components/GlowButton';
import GlassCard from '../components/GlassCard';
import { COLORS } from '../theme/theme';

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup, isLoading } = useAuthStore();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    const result = await signup(name, email, password);
    if (result.success) {
      Alert.alert('Registration Successful', 'Welcome to your AI Digital Twin workspace!');
    } else {
      Alert.alert('Signup Failed', result.error || 'Please check input details');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0F172A', '#020617']}
        style={StyleSheet.absoluteFillObject}
      />

      <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
        <Text style={styles.title}>Initialize Twin</Text>
        <Text style={styles.subtitle}>Enter your profile parameters below</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.formContainer}>
        <GlassCard style={styles.glassCard}>
          <Text style={styles.label}>FULL NAME</Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>EMAIL ADDRESS</Text>
          <TextInput
            style={styles.input}
            placeholder="john.doe@email.com"
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>SECURITY KEY (PASSWORD)</Text>
          <TextInput
            style={styles.input}
            placeholder="Create password"
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <GlowButton
            title={isLoading ? "Configuring Agent..." : "Create Account"}
            onPress={handleSignup}
            style={styles.signUpButton}
          />
        </GlassCard>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.footer}>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginHighlight}>Sign In</Text>
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
  signUpButton: {
    width: '100%',
    marginTop: 8,
  },
  footer: {
    alignItems: 'center',
  },
  loginText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  loginHighlight: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
