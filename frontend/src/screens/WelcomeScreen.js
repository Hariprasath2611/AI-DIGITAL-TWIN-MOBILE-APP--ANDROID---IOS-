import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import GlowButton from '../components/GlowButton';
import { COLORS } from '../theme/theme';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    title: 'Your Digital Twin',
    desc: 'An intelligent AI clone that acts as your career proxy, showcase portfolio, and personal branding assistant.',
    icon: '👤'
  },
  {
    title: 'Intelligent Insights',
    desc: 'Analyze skill gaps, compare developer strengths, and map optimized paths for remote technical jobs.',
    icon: '⚡'
  },
  {
    title: 'AI Mock Interviews',
    desc: 'Simulate live developer interviews with tailored questions, scoring reports, and feedback loops.',
    icon: '🎙️'
  }
];

export default function WelcomeScreen({ navigation }) {
  const [activeSlide, setActiveSlide] = useState(0);

  const handleNext = () => {
    if (activeSlide < SLIDES.length - 1) {
      setActiveSlide(activeSlide + 1);
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0F172A', '#020617']}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Top Header Logo */}
      <Animated.View entering={FadeIn.delay(200)} style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>🌀</Text>
          <Text style={styles.brandName}>QUANTUM TWIN</Text>
        </View>
      </Animated.View>

      {/* Main Slide Carousel */}
      <View style={styles.slideContainer}>
        <Animated.View 
          key={activeSlide} 
          entering={FadeInUp.duration(600)} 
          style={styles.slide}
        >
          <Text style={styles.slideIcon}>{SLIDES[activeSlide].icon}</Text>
          <Text style={styles.slideTitle}>{SLIDES[activeSlide].title}</Text>
          <Text style={styles.slideDesc}>{SLIDES[activeSlide].desc}</Text>
        </Animated.View>
      </View>

      {/* Slide Indicators */}
      <View style={styles.indicatorContainer}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.indicator,
              activeSlide === i && styles.activeIndicator
            ]}
          />
        ))}
      </View>

      {/* Navigation Controls */}
      <View style={styles.footer}>
        <GlowButton
          title={activeSlide === SLIDES.length - 1 ? "Get Started" : "Continue"}
          onPress={handleNext}
          style={styles.button}
        />
        {activeSlide < SLIDES.length - 1 && (
          <Text 
            style={styles.skip}
            onPress={() => navigation.navigate('Login')}
          >
            Skip Intro
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    backgroundColor: '#0B1120',
  },
  header: {
    alignItems: 'center',
    marginTop: 32,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 28,
  },
  brandName: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  slideIcon: {
    fontSize: 72,
    marginBottom: 24,
  },
  slideTitle: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  slideDesc: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeIndicator: {
    width: 24,
    backgroundColor: COLORS.primary,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 48,
    gap: 16,
  },
  button: {
    width: '100%',
  },
  skip: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});
