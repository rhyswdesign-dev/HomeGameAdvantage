/**
 * Lessons Screen - Luxury bartending education experience
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors, fonts, spacing, radii } from '../theme/tokens';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import curriculumData from '../../curriculum-data.json';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

// New user experience - starting fresh
const mockUser = {
  name: 'Alex',
  level: 1,
  xp: 0,
  streak: 0,
  avatar: '🍸',
  membershipTier: 'Premium'
};

// Fresh start - no progress yet
const mockProgress = {
  'lesson-ch1-001': { completed: false, locked: false, progress: 0, rating: 0, mastery: null },
  'lesson-ch1-002': { completed: false, locked: true, progress: 0, rating: 0, mastery: null },
  'lesson-ch1-003': { completed: false, locked: true, progress: 0, rating: 0, mastery: null },
  'lesson-ch1-004': { completed: false, locked: true, progress: 0, rating: 0, mastery: null },
  'lesson-ch1-005': { completed: false, locked: true, progress: 0, rating: 0, mastery: null },
  'lesson-ch1-006': { completed: false, locked: true, progress: 0, rating: 0, mastery: null },
  'lesson-ch1-007': { completed: false, locked: true, progress: 0, rating: 0, mastery: null },
  'lesson-ch1-008': { completed: false, locked: true, progress: 0, rating: 0, mastery: null },
  'lesson-ch1-009': { completed: false, locked: true, progress: 0, rating: 0, mastery: null },
  'lesson-ch1-checkpoint': { completed: false, locked: true, progress: 0, rating: 0, mastery: null },
};

export default function LessonsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedModule, setSelectedModule] = useState('ch1-basics');
  
  const currentModule = curriculumData.modules.find(m => m.id === selectedModule);
  const moduleLessons = curriculumData.lessons.filter(l => l.moduleId === selectedModule);
  
  const getLessonProgress = (lessonId: string) => {
    return mockProgress[lessonId] || { completed: false, locked: true, progress: 0, rating: 0 };
  };

  const getLessonIcon = (lesson: any, progress: any) => {
    if (lesson.id.includes('checkpoint')) {
      return progress.completed ? 'trophy' : progress.locked ? 'lock-closed' : 'trophy-outline';
    }
    return progress.completed ? 'checkmark-circle' : progress.locked ? 'lock-closed' : 'play-circle';
  };

  const getLessonColors = (progress: any) => {
    if (progress.completed) return [colors.success, colors.successDark];
    if (progress.locked) return ['#4A5568', '#2D3748'];
    return [colors.accent, colors.accentDark];
  };

  // Fresh start learning journey
  const masterclassModules = [
    { 
      title: 'Foundations of Excellence', 
      icon: '🎯', 
      progress: 0,
      xpEarned: 0,
      difficulty: 'Essential',
      estimatedTime: '2 hours',
      completed: false,
      rating: 0,
      skills: ['Fundamentals', 'Precision', 'Technique']
    },
    { 
      title: 'Spirit Mastery', 
      icon: '🥃', 
      progress: 0,
      xpEarned: 0,
      difficulty: 'Intermediate',
      estimatedTime: '3 hours',
      completed: false,
      rating: 0,
      skills: ['Whiskey', 'Gin', 'Rum', 'Vodka']
    },
    { 
      title: 'Mixology Artistry', 
      icon: '🎨', 
      progress: 0,
      xpEarned: 0,
      difficulty: 'Advanced',
      estimatedTime: '4 hours',
      completed: false,
      rating: 0,
      skills: ['Creativity', 'Innovation', 'Presentation']
    },
    { 
      title: 'Professional Service', 
      icon: '⭐', 
      progress: 0,
      xpEarned: 0,
      difficulty: 'Expert',
      estimatedTime: '3 hours',
      completed: false,
      rating: 0,
      skills: ['Hospitality', 'Speed', 'Grace']
    }
  ];

  const renderMasterclassModule = (module: any, index: number) => (
    <Pressable key={index} style={styles.masterclassCard}>
      <LinearGradient
        colors={module.completed ? [colors.gold, '#E5B567'] : module.progress > 0 ? [colors.accent, colors.accentDark] : ['#3A2A1F', '#2A1F16']}
        style={styles.moduleGradient}
      >
        <View style={styles.moduleHeader}>
          <View style={styles.moduleIconContainer}>
            <Text style={styles.moduleIcon}>{module.icon}</Text>
          </View>
          <View style={styles.moduleInfo}>
            <Text style={styles.moduleTitle}>{module.title}</Text>
            <Text style={styles.moduleDifficulty}>{module.difficulty}</Text>
          </View>
          <View style={styles.moduleStats}>
            <Text style={styles.moduleTime}>{module.estimatedTime}</Text>
            {module.xpEarned > 0 && (
              <Text style={styles.moduleXP}>+{module.xpEarned} XP</Text>
            )}
          </View>
        </View>
        
        <View style={styles.moduleProgress}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${module.progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{module.progress}%</Text>
        </View>
        
        <View style={styles.moduleSkills}>
          {module.skills.map((skill: string, skillIndex: number) => (
            <View key={skillIndex} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </Pressable>
  );

  const renderLesson = (lesson: any, index: number) => {
    const progress = getLessonProgress(lesson.id);
    const isCheckpoint = lesson.id.includes('checkpoint');
    const lessonColors = getLessonColors(progress);
    const position = index % 2 === 0 ? 'left' : 'right';
    
    return (
      <View key={lesson.id} style={[
        styles.lessonContainer,
        position === 'right' && styles.lessonContainerRight
      ]}>
        <Pressable
          style={[
            styles.lessonButton,
            { opacity: progress.locked ? 0.6 : 1 }
          ]}
          onPress={() => {
            if (!progress.locked) {
              console.log('🔧 LessonsScreen: Navigating to lesson:', lesson.id, lesson.title);
              navigation.navigate('LessonEngine', {
                lessonId: lesson.id,
                isFirstLesson: false
              });
            }
          }}
          disabled={progress.locked}
        >
          <LinearGradient
            colors={lessonColors}
            style={[
              styles.lessonCircle,
              isCheckpoint && styles.checkpointCircle
            ]}
          >
            <Ionicons 
              name={getLessonIcon(lesson, progress)} 
              size={isCheckpoint ? 28 : 24} 
              color={progress.locked ? colors.muted : colors.white} 
            />
          </LinearGradient>
          
          {progress.progress > 0 && progress.progress < 1 && (
            <View style={styles.progressRing}>
              <View style={[
                styles.progressArc,
                { 
                  borderColor: colors.warning,
                  transform: [{ rotate: `${-90 + (progress.progress * 360)}deg` }]
                }
              ]} />
            </View>
          )}
        </Pressable>
        
        <Text style={[
          styles.lessonTitle,
          { color: progress.locked ? colors.muted : colors.text }
        ]}>
          {lesson.title}
        </Text>
        
        {/* Connection line to next lesson */}
        {index < moduleLessons.length - 1 && (
          <View style={[
            styles.connectionPath,
            position === 'left' ? styles.pathToRight : styles.pathToLeft
          ]} />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Premium Header */}
      <LinearGradient
        colors={['#2A1F16', '#1F1712']}
        style={styles.header}
      >
        <View style={styles.profileSection}>
          <LinearGradient
            colors={[colors.gold, '#E5B567']}
            style={styles.avatarGradient}
          >
            <Text style={styles.avatarEmoji}>{mockUser.avatar}</Text>
          </LinearGradient>
          
          <View style={styles.profileInfo}>
            <View style={styles.userTitleRow}>
              <Text style={styles.userName}>{mockUser.name}</Text>
              <View style={styles.premiumBadge}>
                <Ionicons name="diamond" size={12} color={colors.gold} />
                <Text style={styles.premiumText}>{mockUser.membershipTier}</Text>
              </View>
            </View>
            <Text style={styles.userLevel}>Beginner Level {mockUser.level}</Text>
            <View style={styles.userStatsRow}>
              <View style={styles.statItem}>
                <Ionicons name="flash" size={16} color={colors.warning} />
                <Text style={styles.statText}>{mockUser.xp} XP</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="flame" size={16} color={colors.muted} />
                <Text style={styles.statText}>No streak yet</Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Masterclass Modules */}
        <View style={styles.masterclassSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Masterclass Journey</Text>
            <Text style={styles.sectionSubtitle}>Premium curriculum designed by world-class bartenders</Text>
          </View>
          <View style={styles.modulesContainer}>
            {masterclassModules.map(renderMasterclassModule)}
          </View>
        </View>

        {/* Current Focus - Detailed Lessons */}
        <View style={styles.focusSection}>
          <View style={styles.focusHeader}>
            <Text style={styles.focusTitle}>Current Focus</Text>
            <Text style={styles.focusModule}>{currentModule?.title}</Text>
          </View>
          
          <View style={styles.lessonsGrid}>
            {moduleLessons.slice(0, 4).map((lesson, index) => {
              const progress = getLessonProgress(lesson.id);
              return (
                <Pressable
                  key={lesson.id}
                  style={[
                    styles.lessonCard,
                    progress.locked && styles.lessonCardLocked
                  ]}
                  onPress={() => {
                    if (!progress.locked) {
                      navigation.navigate('LessonEngine', {
                        lessonId: lesson.id,
                        isFirstLesson: false
                      });
                    }
                  }}
                  disabled={progress.locked}
                >
                  <LinearGradient
                    colors={progress.completed ? [colors.success, colors.successDark] : 
                           progress.progress > 0 ? [colors.accent, colors.accentDark] :
                           progress.locked ? ['#2A2A2A', '#1A1A1A'] : [colors.accent, colors.accentDark]}
                    style={styles.lessonGradient}
                  >
                    <View style={styles.lessonContent}>
                      <Text style={[styles.lessonTitle, progress.locked && styles.lessonTitleLocked]}>
                        {lesson.title}
                      </Text>
                      {progress.locked && (
                        <Ionicons 
                          name="lock-closed" 
                          size={16} 
                          color={colors.muted} 
                          style={styles.lockIcon}
                        />
                      )}
                      {progress.progress > 0 && progress.progress < 1 && (
                        <View style={styles.miniProgress}>
                          <View style={[styles.miniProgressFill, { width: `${progress.progress * 100}%` }]} />
                        </View>
                      )}
                      {progress.mastery && (
                        <Text style={styles.masteryLevel}>{progress.mastery}</Text>
                      )}
                    </View>
                  </LinearGradient>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Pro Tip of the Day */}
        <View style={styles.proTipSection}>
          <LinearGradient
            colors={['#2A1F16', '#3A2A1F']}
            style={styles.proTipCard}
          >
            <View style={styles.proTipHeader}>
              <LinearGradient
                colors={[colors.gold, '#E5B567']}
                style={styles.proTipIcon}
              >
                <Ionicons name="bulb" size={20} color={'#000'} />
              </LinearGradient>
              <Text style={styles.proTipTitle}>Pro Tip of the Day</Text>
            </View>
            <Text style={styles.proTipText}>
              "The key to a perfect Old Fashioned isn't the whiskey—it's the quality of your ice. Large, clear cubes melt slower and maintain the drink's integrity."
            </Text>
            <Text style={styles.proTipAuthor}>— James Beard Award Winner</Text>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  
  // Premium Header Styles
  header: {
    paddingTop: spacing(6),
    paddingHorizontal: spacing(3),
    paddingBottom: spacing(3),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(213, 161, 94, 0.2)',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(3),
  },
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.gold,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
  },
  avatarEmoji: {
    fontSize: 36,
  },
  profileInfo: {
    flex: 1,
  },
  userTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(2),
    marginBottom: spacing(0.5),
  },
  userName: {
    fontSize: fonts.h2,
    fontWeight: '800',
    color: colors.textLight,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(213, 161, 94, 0.15)',
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(0.5),
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(213, 161, 94, 0.3)',
    gap: spacing(0.5),
  },
  premiumText: {
    fontSize: fonts.micro,
    fontWeight: '700',
    color: colors.gold,
    textTransform: 'uppercase',
  },
  userLevel: {
    fontSize: fonts.body,
    fontWeight: '600',
    color: colors.subtext,
    marginBottom: spacing(1),
  },
  userStatsRow: {
    flexDirection: 'row',
    gap: spacing(3),
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(0.5),
  },
  statText: {
    fontSize: fonts.caption,
    fontWeight: '600',
    color: colors.subtle,
  },

  // Content Styles
  content: {
    flex: 1,
  },

  // Masterclass Section
  masterclassSection: {
    paddingTop: spacing(4),
    paddingHorizontal: spacing(3),
  },
  sectionHeader: {
    marginBottom: spacing(3),
  },
  sectionTitle: {
    fontSize: fonts.h1,
    fontWeight: '800',
    color: colors.textLight,
    marginBottom: spacing(0.5),
  },
  sectionSubtitle: {
    fontSize: fonts.body,
    color: colors.subtle,
    lineHeight: 22,
  },
  modulesContainer: {
    gap: spacing(2),
  },
  
  // Masterclass Card Styles
  masterclassCard: {
    borderRadius: radii.xl,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 12,
  },
  moduleGradient: {
    padding: spacing(3),
    borderRadius: radii.xl,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing(2),
  },
  moduleIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing(2),
  },
  moduleIcon: {
    fontSize: 28,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: fonts.h3,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing(0.25),
  },
  moduleDifficulty: {
    fontSize: fonts.caption,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
  },
  moduleStats: {
    alignItems: 'flex-end',
  },
  moduleTime: {
    fontSize: fonts.caption,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: spacing(0.25),
  },
  moduleXP: {
    fontSize: fonts.caption,
    fontWeight: '700',
    color: colors.warning,
  },
  
  // Progress Styles
  moduleProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing(2),
    gap: spacing(2),
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: 4,
  },
  progressText: {
    fontSize: fonts.caption,
    fontWeight: '700',
    color: colors.white,
    minWidth: 36,
    textAlign: 'right',
  },
  
  // Skills Tags
  moduleSkills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(1),
  },
  skillTag: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(0.5),
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  skillText: {
    fontSize: fonts.micro,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },

  // Current Focus Section
  focusSection: {
    padding: spacing(3),
    paddingTop: spacing(4),
  },
  focusHeader: {
    marginBottom: spacing(3),
  },
  focusTitle: {
    fontSize: fonts.h2,
    fontWeight: '700',
    color: colors.textLight,
    marginBottom: spacing(0.5),
  },
  focusModule: {
    fontSize: fonts.body,
    color: colors.subtle,
  },
  
  // Lessons Grid
  lessonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(2),
    justifyContent: 'space-between',
  },
  lessonCard: {
    width: (width - spacing(8)) / 2,
    borderRadius: radii.lg,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  lessonCardLocked: {
    opacity: 0.6,
  },
  lessonGradient: {
    padding: spacing(2.5),
    minHeight: 120,
    justifyContent: 'space-between',
  },
  lessonContent: {
    alignItems: 'center',
  },
  lockIcon: {
    marginTop: spacing(0.5),
  },
  lessonTitle: {
    fontSize: fonts.caption,
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
    marginTop: spacing(1),
    marginBottom: spacing(1),
    lineHeight: 16,
  },
  lessonTitleLocked: {
    color: colors.muted,
  },
  
  // Mini Progress
  miniProgress: {
    width: '80%',
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: spacing(0.5),
  },
  miniProgressFill: {
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: 2,
  },
  masteryLevel: {
    fontSize: fonts.micro,
    fontWeight: '700',
    color: colors.warning,
    textTransform: 'uppercase',
    marginTop: spacing(0.5),
  },

  // Pro Tip Section
  proTipSection: {
    padding: spacing(3),
    paddingTop: spacing(2),
    paddingBottom: spacing(6),
  },
  proTipCard: {
    borderRadius: radii.xl,
    padding: spacing(3),
    borderWidth: 1,
    borderColor: 'rgba(213, 161, 94, 0.2)',
    shadowColor: colors.gold,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
  },
  proTipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing(2),
    gap: spacing(2),
  },
  proTipIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  proTipTitle: {
    fontSize: fonts.h3,
    fontWeight: '700',
    color: colors.textLight,
  },
  proTipText: {
    fontSize: fonts.body,
    color: colors.text,
    lineHeight: 24,
    marginBottom: spacing(2),
    fontStyle: 'italic',
  },
  proTipAuthor: {
    fontSize: fonts.caption,
    color: colors.gold,
    fontWeight: '600',
    textAlign: 'right',
  },
});