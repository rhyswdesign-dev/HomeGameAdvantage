import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import theme from '../theme/safeTheme';

const { colors, spacing } = theme;
const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

// Simple Bubble Animation Component
function AnimatedBubble({ delay, size, left }: { delay: number; size: number; left: number }) {
  const translateY = React.useRef(new Animated.Value(height + 50)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;
  const scale = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      // Reset values
      translateY.setValue(height + 50);
      opacity.setValue(0);
      scale.setValue(0);

      // Start animations
      Animated.parallel([
        // Float up animation
        Animated.timing(translateY, {
          toValue: -100,
          duration: 4000 + Math.random() * 2000, // Variable duration
          useNativeDriver: true,
        }),
        // Fade in then out
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.6,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.3,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        // Scale animation
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1.2,
            duration: 3700,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        // Restart animation
        setTimeout(startAnimation, 500 + Math.random() * 1000);
      });
    };

    // Start first animation with delay
    const timer = setTimeout(startAnimation, delay);
    return () => clearTimeout(timer);
  }, [translateY, opacity, scale, delay]);

  return (
    <Animated.View
      style={[
        styles.bubble,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          left: left,
          transform: [{ translateY }, { scale }],
          opacity,
        },
      ]}
    />
  );
}

// Floating Bubbles Component
function FloatingBubbles() {
  const bubbles = [
    { delay: 0, size: 20, left: width * 0.1 },
    { delay: 500, size: 15, left: width * 0.8 },
    { delay: 1000, size: 25, left: width * 0.3 },
    { delay: 1500, size: 18, left: width * 0.7 },
    { delay: 2000, size: 12, left: width * 0.5 },
    { delay: 800, size: 22, left: width * 0.15 },
    { delay: 1800, size: 16, left: width * 0.85 },
    { delay: 600, size: 14, left: width * 0.6 },
  ];

  return (
    <View style={styles.bubbleContainer} pointerEvents="none">
      {bubbles.map((bubble, index) => (
        <AnimatedBubble
          key={index}
          delay={bubble.delay}
          size={bubble.size}
          left={bubble.left}
        />
      ))}
    </View>
  );
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-finish after 2.5 seconds
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, onFinish]);

  return (
    <View style={styles.container}>
      {/* Floating Bubbles Background */}
      <FloatingBubbles />
      
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* App Logo/Icon placeholder */}
        <View style={styles.logo}>
          <Text style={styles.logoText}>🥃🍸</Text>
        </View>
        
        {/* App Name */}
        <Text style={styles.appName}>Home Game Advantage</Text>
        <Text style={styles.tagline}>Your ultimate bar & spirits companion</Text>
      </Animated.View>

      {/* Loading indicator */}
      <View style={styles.footer}>
        <View style={styles.loadingDots}>
          <Animated.View style={[styles.dot, { opacity: fadeAnim }]} />
          <Animated.View style={[styles.dot, { opacity: fadeAnim }]} />
          <Animated.View style={[styles.dot, { opacity: fadeAnim }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing(3),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  logoText: {
    fontSize: 48,
  },
  appName: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing(1),
  },
  tagline: {
    fontSize: 16,
    color: colors.subtext,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 22,
  },
  footer: {
    position: 'absolute',
    bottom: spacing(8),
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  bubbleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bubble: {
    position: 'absolute',
    backgroundColor: colors.accent,
    opacity: 0.3,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});