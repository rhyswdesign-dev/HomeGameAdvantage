import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../theme/tokens';

export default function XPTransactionScreen() {
  const navigation = useNavigation();
  const [xpAmount] = useState(150); // XP required for masterclass
  const [userXP] = useState(225); // Current user XP
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStakeXP = async () => {
    if (userXP < xpAmount) {
      Alert.alert('Insufficient XP', 'You need more XP to register for this masterclass.');
      return;
    }

    setIsProcessing(true);
    
    // Simulate transaction processing
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        'Registration Successful!', 
        'Your XP has been staked. You will receive a confirmation email with event details.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mixology Master Class</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.eventCard}>
          <Text style={styles.eventTitle}>Mixology Master Class</Text>
          <Text style={styles.eventDate}>March 15, 2025 • 7:00 PM</Text>
          <Text style={styles.eventDescription}>
            Join expert mixologists for hands-on training in premium cocktail techniques and presentation.
          </Text>
        </View>

        <View style={styles.xpSection}>
          <Text style={styles.sectionTitle}>XP Requirements</Text>
          
          <View style={styles.xpDetails}>
            <View style={styles.xpRow}>
              <Text style={styles.xpLabel}>Registration Stake:</Text>
              <Text style={styles.xpValue}>{xpAmount} XP</Text>
            </View>
            <View style={styles.xpRow}>
              <Text style={styles.xpLabel}>Your Current XP:</Text>
              <Text style={[styles.xpValue, { color: colors.accent }]}>{userXP} XP</Text>
            </View>
            <View style={styles.xpRow}>
              <Text style={styles.xpLabel}>After Registration:</Text>
              <Text style={styles.xpValue}>{userXP - xpAmount} XP</Text>
            </View>
          </View>

          <View style={styles.stakeInfo}>
            <Ionicons name="information-circle-outline" size={20} color={colors.accent} />
            <Text style={styles.infoText}>
              Your XP will be staked to secure your spot. You'll earn it back plus bonus XP upon completion.
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.stakeButton, { opacity: isProcessing ? 0.6 : 1 }]}
          onPress={handleStakeXP}
          disabled={isProcessing}
        >
          <Text style={styles.stakeButtonText}>
            {isProcessing ? 'Processing...' : `Stake ${xpAmount} XP & Register`}
          </Text>
          {!isProcessing && (
            <Ionicons name="chevron-forward" size={16} color={colors.text} style={{ marginLeft: 6 }} />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1.5),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginLeft: spacing(2),
  },
  content: {
    flex: 1,
    padding: spacing(2),
  },
  eventCard: {
    backgroundColor: colors.card,
    padding: spacing(2),
    borderRadius: radii.lg,
    marginBottom: spacing(3),
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing(1),
  },
  eventDate: {
    fontSize: 16,
    color: colors.accent,
    marginBottom: spacing(2),
  },
  eventDescription: {
    fontSize: 16,
    color: colors.subtext,
    lineHeight: 24,
  },
  xpSection: {
    backgroundColor: colors.card,
    padding: spacing(2),
    borderRadius: radii.lg,
    marginBottom: spacing(3),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(2),
  },
  xpDetails: {
    marginBottom: spacing(2),
  },
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing(1),
  },
  xpLabel: {
    fontSize: 16,
    color: colors.subtext,
  },
  xpValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  stakeInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing(1.5),
    backgroundColor: colors.chipBg,
    borderRadius: radii.md,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.subtext,
    marginLeft: spacing(1),
    lineHeight: 20,
  },
  stakeButton: {
    backgroundColor: colors.accent,
    padding: spacing(2),
    borderRadius: radii.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stakeButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
});