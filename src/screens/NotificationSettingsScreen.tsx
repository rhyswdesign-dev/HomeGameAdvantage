/**
 * NOTIFICATION SETTINGS SCREEN
 * Comprehensive notification preferences management
 * Allows users to control all notification types and settings
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radii } from '../theme/tokens';
import { useNotifications, NotificationPreferences } from '../services/notificationService';

/**
 * Notification settings with comprehensive controls
 */
export default function NotificationSettingsScreen() {
  const navigation = useNavigation();
  const { preferences, updatePreferences, sendTestNotification } = useNotifications();

  const [localPreferences, setLocalPreferences] = useState<NotificationPreferences>(preferences);
  const [isSaving, setIsSaving] = useState(false);

  // Update local preferences when global preferences change
  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  // Set up navigation header
  useEffect(() => {
    navigation.setOptions({
      title: 'Notifications',
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { color: colors.text, fontWeight: '900' },
      headerRight: () => (
        <TouchableOpacity
          onPress={handleSavePreferences}
          disabled={isSaving}
          style={styles.saveButton}
        >
          <Text style={[styles.saveButtonText, isSaving && styles.saveButtonDisabled]}>
            {isSaving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, isSaving]);

  /**
   * Handle updating a preference
   */
  const handlePreferenceChange = (key: keyof NotificationPreferences, value: any) => {
    setLocalPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  /**
   * Handle updating quiet hours
   */
  const handleQuietHoursChange = (key: 'enabled' | 'start' | 'end', value: any) => {
    setLocalPreferences(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [key]: value,
      },
    }));
  };

  /**
   * Save preferences to service
   */
  const handleSavePreferences = async () => {
    try {
      setIsSaving(true);
      await updatePreferences(localPreferences);
      Alert.alert('Success', 'Your notification preferences have been saved.');
    } catch (error) {
      Alert.alert('Error', 'Failed to save preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Handle test notification
   */
  const handleTestNotification = async () => {
    if (!localPreferences.enabled) {
      Alert.alert(
        'Notifications Disabled',
        'Please enable notifications first to test them.'
      );
      return;
    }

    try {
      await sendTestNotification();
      Alert.alert(
        'Test Sent',
        'A test notification should appear shortly!'
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send test notification.');
    }
  };

  /**
   * Time picker helper (simplified for demo - you might want a proper time picker)
   */
  const showTimePicker = (current: string, onChange: (time: string) => void) => {
    // This is a simplified implementation
    // In a real app, you'd use a proper time picker component
    const hours = ['22:00', '23:00', '00:00', '01:00', '07:00', '08:00', '09:00'];

    Alert.alert(
      'Select Time',
      'Choose a time:',
      hours.map(hour => ({
        text: hour,
        onPress: () => onChange(hour),
      }))
    );
  };

  const notificationTypes = [
    {
      key: 'lessons' as keyof NotificationPreferences,
      title: 'Lesson Reminders',
      description: 'Get reminded when it\'s time for your next bartending lesson',
      icon: 'school-outline',
    },
    {
      key: 'vault' as keyof NotificationPreferences,
      title: 'Vault & XP Updates',
      description: 'Notifications about XP milestones, hearts refilled, and vault items',
      icon: 'trophy-outline',
    },
    {
      key: 'social' as keyof NotificationPreferences,
      title: 'Social Activity',
      description: 'Get notified when someone follows you or likes your content',
      icon: 'people-outline',
    },
    {
      key: 'events' as keyof NotificationPreferences,
      title: 'Events & Challenges',
      description: 'Reminders about upcoming events and daily challenges',
      icon: 'calendar-outline',
    },
    {
      key: 'marketing' as keyof NotificationPreferences,
      title: 'Promotions & Tips',
      description: 'Special offers, new features, and bartending tips',
      icon: 'gift-outline',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Master Toggle */}
        <View style={styles.section}>
          <View style={styles.masterToggleCard}>
            <View style={styles.masterToggleContent}>
              <Ionicons
                name={localPreferences.enabled ? "notifications" : "notifications-off"}
                size={32}
                color={localPreferences.enabled ? colors.accent : colors.subtext}
              />
              <View style={styles.masterToggleText}>
                <Text style={styles.masterToggleTitle}>Push Notifications</Text>
                <Text style={styles.masterToggleDescription}>
                  {localPreferences.enabled
                    ? 'Receive notifications on this device'
                    : 'All notifications are disabled'
                  }
                </Text>
              </View>
            </View>

            <Switch
              value={localPreferences.enabled}
              onValueChange={(value) => handlePreferenceChange('enabled', value)}
              trackColor={{ false: colors.line, true: colors.accent + '80' }}
              thumbColor={localPreferences.enabled ? colors.accent : colors.subtext}
              ios_backgroundColor={colors.line}
            />
          </View>
        </View>

        {/* Notification Types */}
        {localPreferences.enabled && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notification Types</Text>

            {notificationTypes.map((type) => (
              <View key={type.key} style={styles.preferenceItem}>
                <View style={styles.preferenceContent}>
                  <View style={styles.preferenceIcon}>
                    <Ionicons name={type.icon as any} size={24} color={colors.accent} />
                  </View>

                  <View style={styles.preferenceText}>
                    <Text style={styles.preferenceTitle}>{type.title}</Text>
                    <Text style={styles.preferenceDescription}>{type.description}</Text>
                  </View>
                </View>

                <Switch
                  value={localPreferences[type.key] as boolean}
                  onValueChange={(value) => handlePreferenceChange(type.key, value)}
                  trackColor={{ false: colors.line, true: colors.accent + '80' }}
                  thumbColor={localPreferences[type.key] ? colors.accent : colors.subtext}
                  ios_backgroundColor={colors.line}
                />
              </View>
            ))}
          </View>
        )}

        {/* Quiet Hours */}
        {localPreferences.enabled && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quiet Hours</Text>
            <Text style={styles.sectionDescription}>
              Don't send notifications during these hours
            </Text>

            <View style={styles.quietHoursCard}>
              <View style={styles.preferenceItem}>
                <View style={styles.preferenceContent}>
                  <View style={styles.preferenceIcon}>
                    <Ionicons name="moon-outline" size={24} color={colors.accent} />
                  </View>

                  <View style={styles.preferenceText}>
                    <Text style={styles.preferenceTitle}>Enable Quiet Hours</Text>
                    <Text style={styles.preferenceDescription}>
                      Silence notifications during specific times
                    </Text>
                  </View>
                </View>

                <Switch
                  value={localPreferences.quietHours.enabled}
                  onValueChange={(value) => handleQuietHoursChange('enabled', value)}
                  trackColor={{ false: colors.line, true: colors.accent + '80' }}
                  thumbColor={localPreferences.quietHours.enabled ? colors.accent : colors.subtext}
                  ios_backgroundColor={colors.line}
                />
              </View>

              {localPreferences.quietHours.enabled && (
                <View style={styles.timePickerContainer}>
                  <TouchableOpacity
                    style={styles.timePicker}
                    onPress={() => showTimePicker(
                      localPreferences.quietHours.start,
                      (time) => handleQuietHoursChange('start', time)
                    )}
                  >
                    <Text style={styles.timePickerLabel}>Start Time</Text>
                    <View style={styles.timePickerValue}>
                      <Text style={styles.timePickerText}>{localPreferences.quietHours.start}</Text>
                      <Ionicons name="chevron-forward" size={16} color={colors.subtext} />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.timePicker}
                    onPress={() => showTimePicker(
                      localPreferences.quietHours.end,
                      (time) => handleQuietHoursChange('end', time)
                    )}
                  >
                    <Text style={styles.timePickerLabel}>End Time</Text>
                    <View style={styles.timePickerValue}>
                      <Text style={styles.timePickerText}>{localPreferences.quietHours.end}</Text>
                      <Ionicons name="chevron-forward" size={16} color={colors.subtext} />
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Test Notifications */}
        {localPreferences.enabled && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Test</Text>

            <TouchableOpacity
              style={styles.testButton}
              onPress={handleTestNotification}
              activeOpacity={0.7}
            >
              <Ionicons name="send-outline" size={20} color={colors.accent} />
              <Text style={styles.testButtonText}>Send Test Notification</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Platform Info */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle-outline" size={20} color={colors.accent} />
            <Text style={styles.infoText}>
              {Platform.OS === 'ios'
                ? 'You can also manage notifications in iOS Settings > Home Game Advantage > Notifications'
                : 'You can also manage notifications in Android Settings > Apps > Home Game Advantage > Notifications'
              }
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing(2),
    paddingBottom: spacing(4),
  },

  // Header
  saveButton: {
    paddingVertical: spacing(0.5),
    paddingHorizontal: spacing(1),
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.accent,
  },
  saveButtonDisabled: {
    color: colors.subtext,
  },

  // Sections
  section: {
    marginBottom: spacing(3),
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.subtext,
    marginBottom: spacing(1.5),
    lineHeight: 20,
  },

  // Master Toggle
  masterToggleCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.line,
  },
  masterToggleContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  masterToggleText: {
    flex: 1,
    marginLeft: spacing(1.5),
  },
  masterToggleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(0.25),
  },
  masterToggleDescription: {
    fontSize: 14,
    color: colors.subtext,
    lineHeight: 18,
  },

  // Preference Items
  preferenceItem: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(1.5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing(1),
    borderWidth: 1,
    borderColor: colors.line,
  },
  preferenceContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferenceIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing(1.5),
  },
  preferenceText: {
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(0.25),
  },
  preferenceDescription: {
    fontSize: 13,
    color: colors.subtext,
    lineHeight: 18,
  },

  // Quiet Hours
  quietHoursCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(1.5),
    borderWidth: 1,
    borderColor: colors.line,
  },
  timePickerContainer: {
    marginTop: spacing(1.5),
    paddingTop: spacing(1.5),
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  timePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing(1.25),
    paddingHorizontal: spacing(1),
    backgroundColor: colors.bg,
    borderRadius: radii.md,
    marginBottom: spacing(1),
  },
  timePickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  timePickerValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timePickerText: {
    fontSize: 16,
    color: colors.accent,
    fontFamily: 'monospace',
    marginRight: spacing(0.5),
  },

  // Test Button
  testButton: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(1.5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.accent,
    gap: spacing(1),
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.accent,
  },

  // Info Card
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(1.5),
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: colors.line,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.subtext,
    lineHeight: 18,
    marginLeft: spacing(1),
  },
});