/**
 * Lesson Summary Screen - Luxury celebration experience
 */

import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Animated, 
  Dimensions,
  StatusBar,
  Platform 
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { colors, spacing, radii } from '../../theme/tokens';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

type LessonSummaryScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'LessonSummary'>;
  route: RouteProp<RootStackParamList, 'LessonSummary'>;
};

const { width, height } = Dimensions.get('window');

export default function LessonSummaryScreen({ navigation, route }: LessonSummaryScreenProps) {
  const { 
    xpAwarded, 
    correctCount, 
    totalCount, 
    masteryDelta,
    moduleId,
    lessonId,
    isFirstLesson 
  } = route.params;

  const accuracy = Math.round((correctCount / totalCount) * 100);
  
  // Enhanced animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const accuracyScaleAnim = useRef(new Animated.Value(0)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;
  const celebrationAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content', true);

    // Create celebration pulse animation
    const createPulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => createPulse());
    };

    // Create rotation animation for celebration
    const createRotation = () => {
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      }).start(() => {
        rotateAnim.setValue(0);
        createRotation();
      });
    };

    // Orchestrated entrance animation
    const sequence = Animated.sequence([
      // Initial fade and slide
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Accuracy card dramatic entrance
      Animated.spring(accuracyScaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      // Stats cards stagger in
      Animated.timing(statsAnim, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
      // Celebration elements
      Animated.timing(celebrationAnim, {
        toValue: 1,
        duration: 1000,
        delay: 300,
        useNativeDriver: true,
      }),
    ]);

    sequence.start(() => {
      createPulse();
      createRotation();
    });
  }, []);

  const handleContinue = () => {
    if (isFirstLesson) {
      // After first lesson, go to main app with lesson system unlocked
      navigation.navigate('Main');
    } else {
      // Continue to next lesson or module overview
      navigation.navigate('Main');
    }
  };

  const getPerformanceMessage = () => {
    if (accuracy >= 90) return "Master mixologist level!";
    if (accuracy >= 80) return "Expertly crafted!";
    if (accuracy >= 70) return "Well mixed!";
    return "Keep practicing your technique!";
  };

  const getPerformanceColor = () => {
    if (accuracy >= 90) return '#4CAF50';
    if (accuracy >= 80) return '#8BC34A';
    if (accuracy >= 70) return '#FF9800';
    return '#FF5722';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Luxury gradient background */}
      <LinearGradient
        colors={[colors.bg, '#1A0F0B', colors.card]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Celebration particles */}
      <Animated.View 
        style={[
          styles.celebrationParticles,
          {
            opacity: celebrationAnim,
            transform: [{
              rotate: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            }],
          },
        ]}
      >
        {[...Array(8)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.particle,
              {
                transform: [
                  { rotate: `${i * 45}deg` },
                  { translateX: 60 },
                ],
              },
            ]}
          />
        ))}
      </Animated.View>

      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Animated.View 
          style={[
            styles.header,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <View style={styles.celebrationIcon}>
            <Ionicons name="wine" size={48} color={colors.gold} />
          </View>
          <Text style={styles.title}>Lesson Complete!</Text>
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitle}>Perfectly mixed!</Text>
            <Ionicons name="wine" size={20} color={colors.gold} />
          </View>
        </Animated.View>

        <View style={styles.results}>
          <Animated.View 
            style={[
              styles.accuracyCard,
              {
                transform: [{ scale: accuracyScaleAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={[
                'rgba(215, 161, 94, 0.1)',
                'rgba(228, 147, 62, 0.05)',
              ]}
              style={styles.accuracyGradient}
            >
              <View style={styles.accuracyContent}>
                <Text style={[styles.accuracyNumber, { color: getPerformanceColor() }]}>
                  {accuracy}%
                </Text>
                <Text style={styles.accuracyLabel}>Accuracy</Text>
                <Text style={[styles.performanceMessage, { color: getPerformanceColor() }]}>
                  {getPerformanceMessage()}
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>

          <Animated.View 
            style={[
              styles.statsGrid,
              {
                opacity: statsAnim,
                transform: [{
                  translateY: statsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                }],
              },
            ]}
          >
            {[
              { value: correctCount, label: 'Correct', color: colors.success },
              { value: totalCount - correctCount, label: 'Incorrect', color: colors.error },
              { value: `+${xpAwarded}`, label: 'XP Earned', color: colors.gold },
            ].map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']}
                  style={styles.statGradient}
                >
                  <Text style={[styles.statNumber, { color: stat.color }]}>
                    {stat.value}
                  </Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </LinearGradient>
              </View>
            ))}
          </Animated.View>
        </View>

        {isFirstLesson && (
          <Animated.View 
            style={[
              styles.welcomeCard,
              {
                opacity: celebrationAnim,
                transform: [{
                  scale: celebrationAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  }),
                }],
              },
            ]}
          >
            <LinearGradient
              colors={['rgba(76, 175, 80, 0.15)', 'rgba(76, 175, 80, 0.05)']}
              style={styles.welcomeGradient}
            >
              <View style={styles.welcomeTitleContainer}>
                <Ionicons name="school" size={24} color={colors.success} />
                <Text style={styles.welcomeTitle}>Welcome to Bartending School!</Text>
              </View>
              <Text style={styles.welcomeText}>
                You've completed your first lesson! Your personalized learning path is now ready. 
                Keep practicing to unlock premium spirits and earn exclusive badges.
              </Text>
            </LinearGradient>
          </Animated.View>
        )}

        <Animated.View 
          style={[
            styles.nextSteps,
            {
              opacity: celebrationAnim,
              transform: [{
                translateY: celebrationAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              }],
            },
          ]}
        >
          <Text style={styles.nextStepsTitle}>Continue Your Journey</Text>
          {[
            { icon: 'library', text: 'Unlock advanced techniques and premium spirits' },
            { icon: 'flame', text: 'Maintain your streak for exclusive rewards' },
            { icon: 'medal', text: 'Master mixology and earn prestigious badges' },
          ].map((step, index) => (
            <View key={index} style={styles.nextStepItem}>
              <View style={styles.nextStepIconContainer}>
                <Ionicons name={step.icon as any} size={20} color={colors.gold} />
              </View>
              <Text style={styles.nextStepText}>{step.text}</Text>
            </View>
          ))}
        </Animated.View>
      </Animated.View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.continueButton,
            pressed && styles.continueButtonPressed,
          ]}
          onPress={handleContinue}
        >
          <LinearGradient
            colors={[colors.gold, colors.accent]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.continueButtonText}>
              {isFirstLesson ? 'Begin Your Journey' : 'Continue Learning'}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  celebrationParticles: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 120,
    height: 120,
    marginLeft: -60,
    marginTop: -60,
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gold,
    opacity: 0.6,
  },
  content: {
    flex: 1,
    padding: spacing(3),
    paddingTop: Platform.OS === 'ios' ? spacing(8) : spacing(6),
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing(4),
  },
  celebrationIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(215, 161, 94, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing(2),
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
    marginBottom: spacing(1),
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 20,
    color: colors.subtext,
    textAlign: 'center',
    fontWeight: '600',
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1),
    justifyContent: 'center',
  },
  results: {
    marginBottom: spacing(4),
  },
  accuracyCard: {
    borderRadius: radii.xl,
    marginBottom: spacing(3),
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  accuracyGradient: {
    padding: spacing(4),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(215, 161, 94, 0.2)',
    borderRadius: radii.xl,
  },
  accuracyContent: {
    alignItems: 'center',
  },
  accuracyNumber: {
    fontSize: 56,
    fontWeight: '900',
    marginBottom: spacing(1),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  accuracyLabel: {
    fontSize: 18,
    color: colors.subtext,
    marginBottom: spacing(1),
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  performanceMessage: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing(2),
  },
  statCard: {
    flex: 1,
    borderRadius: radii.lg,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  statGradient: {
    padding: spacing(2.5),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: radii.lg,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: spacing(0.5),
  },
  statLabel: {
    fontSize: 12,
    color: colors.subtext,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  welcomeCard: {
    borderRadius: radii.lg,
    marginBottom: spacing(3),
    overflow: 'hidden',
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  welcomeGradient: {
    padding: spacing(3),
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.2)',
    borderRadius: radii.lg,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.success,
    textAlign: 'center',
  },
  welcomeTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1),
    justifyContent: 'center',
    marginBottom: spacing(2),
  },
  welcomeText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: '500',
  },
  nextSteps: {
    marginBottom: spacing(3),
  },
  nextStepsTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing(3),
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  nextStepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing(2),
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: radii.lg,
    padding: spacing(2),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  nextStepIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(215, 161, 94, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing(2),
  },
  nextStepText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    fontWeight: '500',
  },
  actions: {
    padding: spacing(3),
    paddingTop: 0,
  },
  continueButton: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  continueButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  buttonGradient: {
    padding: spacing(3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    color: colors.goldText,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});