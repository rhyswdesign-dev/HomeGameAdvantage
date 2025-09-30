/**
 * NOTIFICATION SERVICE
 * Comprehensive push notification and in-app notification system
 * Handles scheduling, delivery, and user preferences
 */

import React from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { useUser } from '../store/useUser';

// Notification types for the app
export type NotificationType =
  | 'lesson_reminder'
  | 'vault_item_available'
  | 'xp_milestone'
  | 'streak_reminder'
  | 'social_follow'
  | 'social_like'
  | 'event_reminder'
  | 'daily_challenge'
  | 'hearts_refilled';

// Notification data interface
export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  timestamp: number;
  read: boolean;
  actionUrl?: string; // Deep link to specific screen
}

// Notification preferences
export interface NotificationPreferences {
  enabled: boolean;
  lessons: boolean;
  vault: boolean;
  social: boolean;
  events: boolean;
  marketing: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string; // HH:MM format
  };
}

// Storage keys
const STORAGE_KEYS = {
  PREFERENCES: 'notification_preferences',
  IN_APP_NOTIFICATIONS: 'in_app_notifications',
  PUSH_TOKEN: 'push_token',
} as const;

// Default preferences
const DEFAULT_PREFERENCES: NotificationPreferences = {
  enabled: true,
  lessons: true,
  vault: true,
  social: true,
  events: true,
  marketing: false,
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
  },
};

/**
 * Main notification service class
 */
class NotificationService {
  private static instance: NotificationService;
  private inAppNotifications: AppNotification[] = [];
  private preferences: NotificationPreferences = DEFAULT_PREFERENCES;
  private pushToken: string | null = null;
  private initialized = false;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Initialize the notification service
   */
  public async initialize(): Promise<boolean> {
    try {
      console.log('🔔 Initializing notification service...');

      // Configure notification behavior
      Notifications.setNotificationHandler({
        handleNotification: async (notification) => {
          // Check if we're in quiet hours
          const inQuietHours = await this.isInQuietHours();

          return {
            shouldShowAlert: !inQuietHours,
            shouldPlaySound: !inQuietHours,
            shouldSetBadge: true,
          };
        },
      });

      // Load preferences and notifications
      await this.loadPreferences();
      await this.loadInAppNotifications();

      // Register for push notifications
      if (this.preferences.enabled) {
        await this.registerForPushNotifications();
      }

      // Set up notification listeners
      this.setupNotificationListeners();

      this.initialized = true;
      console.log('✅ Notification service initialized');
      return true;

    } catch (error) {
      console.error('❌ Failed to initialize notification service:', error);
      return false;
    }
  }

  /**
   * Register for push notifications
   */
  private async registerForPushNotifications(): Promise<string | null> {
    try {
      if (!Device.isDevice) {
        console.log('📱 Push notifications require a physical device');
        return null;
      }

      // Check existing permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Request permissions if not granted
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('❌ Permission not granted for push notifications');
        return null;
      }

      // Get push token
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: '395da84f-715d-334e-8d41-a16cd93fc83c', // Replace with your project ID
      });

      this.pushToken = token.data;
      await AsyncStorage.setItem(STORAGE_KEYS.PUSH_TOKEN, token.data);

      console.log('🎯 Push token obtained:', token.data);
      return token.data;

    } catch (error) {
      console.error('❌ Failed to register for push notifications:', error);
      return null;
    }
  }

  /**
   * Set up notification event listeners
   */
  private setupNotificationListeners() {
    // Handle notification received while app is in foreground
    Notifications.addNotificationReceivedListener((notification) => {
      console.log('📨 Notification received:', notification);
      this.handleIncomingNotification(notification);
    });

    // Handle notification response (user tapped notification)
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('👆 Notification tapped:', response);
      this.handleNotificationResponse(response);
    });
  }

  /**
   * Handle incoming notification while app is active
   */
  private async handleIncomingNotification(notification: Notifications.Notification) {
    const appNotification: AppNotification = {
      id: notification.request.identifier,
      type: (notification.request.content.data?.type as NotificationType) || 'lesson_reminder',
      title: notification.request.content.title || '',
      body: notification.request.content.body || '',
      data: notification.request.content.data,
      timestamp: Date.now(),
      read: false,
      actionUrl: notification.request.content.data?.actionUrl,
    };

    // Add to in-app notifications
    this.inAppNotifications.unshift(appNotification);
    await this.saveInAppNotifications();

    // Update badge count
    await this.updateBadgeCount();
  }

  /**
   * Handle notification tap/response
   */
  private handleNotificationResponse(response: Notifications.NotificationResponse) {
    const data = response.notification.request.content.data;

    if (data?.actionUrl) {
      // Handle deep link navigation
      console.log('🔗 Navigating to:', data.actionUrl);
      // You would integrate with your navigation service here
    }

    // Mark notification as read
    const notificationId = response.notification.request.identifier;
    this.markAsRead(notificationId);
  }

  /**
   * Schedule a lesson reminder notification
   */
  public async scheduleLessonReminder(lessonId: string, delayMinutes: number = 60) {
    if (!this.preferences.lessons || !this.preferences.enabled) {
      return;
    }

    const identifier = `lesson_reminder_${lessonId}_${Date.now()}`;

    await Notifications.scheduleNotificationAsync({
      identifier,
      content: {
        title: "🍸 Time for your bartending lesson!",
        body: "Your next lesson is ready. Let's keep learning!",
        data: {
          type: 'lesson_reminder',
          lessonId,
          actionUrl: `homegameadvantage://lessons/${lessonId}`,
        },
        sound: true,
      },
      trigger: {
        seconds: delayMinutes * 60,
      },
    });

    console.log(`⏰ Lesson reminder scheduled for ${delayMinutes} minutes`);
  }

  /**
   * Schedule hearts refilled notification
   */
  public async scheduleHeartsRefilled() {
    if (!this.preferences.vault || !this.preferences.enabled) {
      return;
    }

    const identifier = `hearts_refilled_${Date.now()}`;

    await Notifications.scheduleNotificationAsync({
      identifier,
      content: {
        title: "❤️ Your hearts have been refilled!",
        body: "You're ready to continue learning. Jump back in!",
        data: {
          type: 'hearts_refilled',
          actionUrl: 'homegameadvantage://lessons',
        },
        sound: true,
      },
      trigger: {
        seconds: 60, // 1 minute delay for immediate feedback
      },
    });

    console.log('💖 Hearts refilled notification scheduled');
  }

  /**
   * Schedule XP milestone celebration
   */
  public async scheduleXPMilestone(xp: number, level: number) {
    if (!this.preferences.vault || !this.preferences.enabled) {
      return;
    }

    const identifier = `xp_milestone_${xp}_${Date.now()}`;

    await Notifications.scheduleNotificationAsync({
      identifier,
      content: {
        title: `🎉 Level ${level} achieved!`,
        body: `Congratulations! You've earned ${xp} XP and reached a new level!`,
        data: {
          type: 'xp_milestone',
          xp,
          level,
          actionUrl: 'homegameadvantage://profile',
        },
        sound: true,
      },
      trigger: {
        seconds: 2, // Almost immediate for celebration
      },
    });

    console.log(`🎊 XP milestone notification scheduled for level ${level}`);
  }

  /**
   * Schedule daily streak reminder
   */
  public async scheduleStreakReminder() {
    if (!this.preferences.lessons || !this.preferences.enabled) {
      return;
    }

    // Cancel existing streak reminders
    await this.cancelNotificationsByType('streak_reminder');

    const identifier = `streak_reminder_${Date.now()}`;

    // Schedule for tomorrow at 7 PM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(19, 0, 0, 0);

    await Notifications.scheduleNotificationAsync({
      identifier,
      content: {
        title: "🔥 Don't break your streak!",
        body: "Complete a lesson today to keep your learning streak alive!",
        data: {
          type: 'streak_reminder',
          actionUrl: 'homegameadvantage://lessons',
        },
        sound: true,
      },
      trigger: {
        date: tomorrow,
      },
    });

    console.log('🔥 Streak reminder scheduled for tomorrow');
  }

  /**
   * Send immediate in-app notification
   */
  public async sendInAppNotification(
    type: NotificationType,
    title: string,
    body: string,
    data?: Record<string, any>
  ) {
    const notification: AppNotification = {
      id: `in_app_${Date.now()}`,
      type,
      title,
      body,
      data,
      timestamp: Date.now(),
      read: false,
    };

    this.inAppNotifications.unshift(notification);
    await this.saveInAppNotifications();
    await this.updateBadgeCount();

    console.log('📱 In-app notification sent:', title);
  }

  /**
   * Get all in-app notifications
   */
  public getInAppNotifications(): AppNotification[] {
    return this.inAppNotifications;
  }

  /**
   * Get unread notification count
   */
  public getUnreadCount(): number {
    return this.inAppNotifications.filter(n => !n.read).length;
  }

  /**
   * Mark notification as read
   */
  public async markAsRead(notificationId: string) {
    const notification = this.inAppNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      await this.saveInAppNotifications();
      await this.updateBadgeCount();
    }
  }

  /**
   * Mark all notifications as read
   */
  public async markAllAsRead() {
    this.inAppNotifications.forEach(n => n.read = true);
    await this.saveInAppNotifications();
    await this.updateBadgeCount();
  }

  /**
   * Clear old notifications (keep last 50)
   */
  public async clearOldNotifications() {
    this.inAppNotifications = this.inAppNotifications.slice(0, 50);
    await this.saveInAppNotifications();
  }

  /**
   * Cancel notifications by type
   */
  public async cancelNotificationsByType(type: NotificationType) {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();

    for (const notification of scheduledNotifications) {
      if (notification.content.data?.type === type) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
  }

  /**
   * Update app badge count
   */
  private async updateBadgeCount() {
    const unreadCount = this.getUnreadCount();
    await Notifications.setBadgeCountAsync(unreadCount);
  }

  /**
   * Check if current time is in quiet hours
   */
  private async isInQuietHours(): Promise<boolean> {
    if (!this.preferences.quietHours.enabled) {
      return false;
    }

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const { start, end } = this.preferences.quietHours;

    // Handle cases where quiet hours span midnight
    if (start > end) {
      return currentTime >= start || currentTime <= end;
    } else {
      return currentTime >= start && currentTime <= end;
    }
  }

  /**
   * Update notification preferences
   */
  public async updatePreferences(newPreferences: Partial<NotificationPreferences>) {
    this.preferences = { ...this.preferences, ...newPreferences };
    await AsyncStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(this.preferences));

    // Re-register if enabled status changed
    if (newPreferences.enabled !== undefined) {
      if (newPreferences.enabled) {
        await this.registerForPushNotifications();
      } else {
        // Cancel all scheduled notifications
        await Notifications.cancelAllScheduledNotificationsAsync();
      }
    }

    console.log('🔧 Notification preferences updated');
  }

  /**
   * Get current preferences
   */
  public getPreferences(): NotificationPreferences {
    return this.preferences;
  }

  /**
   * Load preferences from storage
   */
  private async loadPreferences() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (stored) {
        this.preferences = { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load notification preferences:', error);
    }
  }

  /**
   * Load in-app notifications from storage
   */
  private async loadInAppNotifications() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.IN_APP_NOTIFICATIONS);
      if (stored) {
        this.inAppNotifications = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load in-app notifications:', error);
    }
  }

  /**
   * Save in-app notifications to storage
   */
  private async saveInAppNotifications() {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.IN_APP_NOTIFICATIONS,
        JSON.stringify(this.inAppNotifications)
      );
    } catch (error) {
      console.error('Failed to save in-app notifications:', error);
    }
  }

  /**
   * Get push token for backend integration
   */
  public getPushToken(): string | null {
    return this.pushToken;
  }

  /**
   * Test notification (for development)
   */
  public async sendTestNotification() {
    if (__DEV__) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🧪 Test Notification",
          body: "This is a test notification from your bartending app!",
          data: { type: 'test' },
          sound: true,
        },
        trigger: { seconds: 2 },
      });
    }
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();

/**
 * React hook for notification management
 */
export function useNotifications() {
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [notifications, setNotifications] = React.useState<AppNotification[]>([]);
  const [preferences, setPreferences] = React.useState<NotificationPreferences>(
    notificationService.getPreferences()
  );

  // Update state when notifications change
  React.useEffect(() => {
    const updateState = () => {
      setUnreadCount(notificationService.getUnreadCount());
      setNotifications(notificationService.getInAppNotifications());
      setPreferences(notificationService.getPreferences());
    };

    // Initial update
    updateState();

    // Set up interval to check for updates
    const interval = setInterval(updateState, 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    notifications,
    unreadCount,
    preferences,
    markAsRead: notificationService.markAsRead.bind(notificationService),
    markAllAsRead: notificationService.markAllAsRead.bind(notificationService),
    updatePreferences: notificationService.updatePreferences.bind(notificationService),
    sendTestNotification: notificationService.sendTestNotification.bind(notificationService),
  };
}

export default notificationService;