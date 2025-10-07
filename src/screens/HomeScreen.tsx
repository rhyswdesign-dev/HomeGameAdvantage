// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { colors, spacing, radii } from '../theme/tokens';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>

      {/* Demo Button for Personalization System */}
      <TouchableOpacity
        style={styles.demoButton}
        onPress={() => navigation.navigate('PersonalizedHome')}
      >
        <Text style={styles.demoButtonEmoji}>🧠</Text>
        <Text style={styles.demoButtonTitle}>Personalization Demo</Text>
        <Text style={styles.demoButtonSubtitle}>
          See mood-based organization & real-time learning
        </Text>
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>What you'll see:</Text>
        <Text style={styles.infoItem}>✅ Mood categories personalized by preferences</Text>
        <Text style={styles.infoItem}>✅ Recipe recommendations with scoring</Text>
        <Text style={styles.infoItem}>✅ Real-time behavioral learning</Text>
        <Text style={styles.infoItem}>✅ Engagement tracking</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
    padding: spacing(3),
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(4),
  },
  demoButton: {
    backgroundColor: colors.gold,
    borderRadius: radii.lg,
    padding: spacing(3),
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  demoButtonEmoji: {
    fontSize: 48,
    marginBottom: spacing(1),
  },
  demoButtonTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.goldText,
    marginBottom: spacing(0.5),
  },
  demoButtonSubtitle: {
    fontSize: 14,
    color: colors.goldText,
    opacity: 0.9,
    textAlign: 'center',
  },
  infoBox: {
    marginTop: spacing(4),
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing(2.5),
    width: '100%',
    maxWidth: 320,
    borderWidth: 1,
    borderColor: colors.line,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(1.5),
  },
  infoItem: {
    fontSize: 14,
    color: colors.subtext,
    marginBottom: spacing(0.75),
    lineHeight: 20,
  },
});