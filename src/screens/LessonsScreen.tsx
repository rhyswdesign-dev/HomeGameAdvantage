/**
 * Lessons Screen - Main learning hub
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/tokens';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LessonsScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Ionicons name="wine" size={24} color={colors.gold} />
            <Text style={styles.title}>Bartending School</Text>
          </View>
          <Text style={styles.subtitle}>Learn cocktail crafting with interactive lessons</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get Started</Text>
          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate('Welcome')}
          >
            <View style={styles.cardIcon}>
              <Ionicons name="navigate" size={24} color={colors.gold} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Start Your Journey</Text>
              <Text style={styles.cardDescription}>
                Take our 15-question survey to get personalized lesson recommendations
              </Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Lessons</Text>
          
          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate('LessonEngine', { 
              lessonId: 'lesson-glassware',
              isFirstLesson: false 
            })}
          >
            <View style={styles.cardIcon}>
              <Ionicons name="wine" size={24} color={colors.gold} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Glassware Basics</Text>
              <Text style={styles.cardDescription}>Learn about different cocktail glasses</Text>
            </View>
          </Pressable>

          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate('LessonEngine', { 
              lessonId: 'lesson-shake-stir',
              isFirstLesson: false 
            })}
          >
            <View style={styles.cardIcon}>
              <Ionicons name="restaurant" size={24} color={colors.gold} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Shake vs Stir</Text>
              <Text style={styles.cardDescription}>Master the fundamental techniques</Text>
            </View>
          </Pressable>

          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate('LessonEngine', { 
              lessonId: 'lesson-gin-basics',
              isFirstLesson: false 
            })}
          >
            <View style={styles.cardIcon}>
              <Ionicons name="leaf" size={24} color={colors.gold} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Gin Essentials</Text>
              <Text style={styles.cardDescription}>Explore the world of gin and botanicals</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresList}>
            <View style={styles.feature}>
              <Ionicons name="time" size={20} color={colors.gold} />
              <Text style={styles.featureText}>3-5 minute bite-sized lessons</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="navigate" size={20} color={colors.gold} />
              <Text style={styles.featureText}>Personalized learning path</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="medal" size={20} color={colors.gold} />
              <Text style={styles.featureText}>XP, streaks, and achievements</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="refresh" size={20} color={colors.gold} />
              <Text style={styles.featureText}>Spaced repetition for retention</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 20,
  },
  featuresList: {
    gap: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
});
