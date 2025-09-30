import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radii } from '../theme/tokens';
import { useNotifications, AppNotification, NotificationType } from '../services/notificationService';

interface Notification {
  id: string;
  type: 'unlock' | 'follow' | 'event' | 'achievement' | 'reward';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  image?: string;
  actionData?: any;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'unlock',
    title: 'New Content Unlocked!',
    message: 'You\'ve unlocked the Professional Bar Tools Kit with your XP!',
    timestamp: '2 hours ago',
    isRead: false,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=100&q=60',
  },
  {
    id: '2',
    type: 'follow',
    title: '@cocktail_queen followed you',
    message: 'Sarah Chen is now following your mixology journey',
    timestamp: '4 hours ago',
    isRead: false,
    image: 'https://images.unsplash.com/photo-1494790108755-2616b2ddc5ce?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: '3',
    type: 'event',
    title: 'Competition Reminder',
    message: 'Garnish Competition submissions close in 24 hours!',
    timestamp: '6 hours ago',
    isRead: true,
    image: 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa6?auto=format&fit=crop&w=100&q=60',
  },
  {
    id: '4',
    type: 'achievement',
    title: 'Achievement Unlocked!',
    message: 'You\'ve earned the "Streak Master" badge for 7 consecutive days',
    timestamp: '1 day ago',
    isRead: true,
    image: undefined,
  },
  {
    id: '5',
    type: 'reward',
    title: '250 XP Earned!',
    message: 'Completed "Advanced Gin Techniques" masterclass',
    timestamp: '2 days ago',
    isRead: true,
    image: undefined,
  },
  {
    id: '6',
    type: 'follow',
    title: '@mixmaster_alex followed you',
    message: 'Alex Martinez is now following your mixology journey',
    timestamp: '3 days ago',
    isRead: true,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: '7',
    type: 'event',
    title: 'New Event Available',
    message: 'Hendricks Botanical Workshop registration is now open',
    timestamp: '1 week ago',
    isRead: true,
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=100&q=60',
  },
];

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const { notifications: realNotifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  // Combine real notifications with mock data for demo (remove mock data in production)
  const [allNotifications, setAllNotifications] = useState<(Notification | AppNotification)[]>([]);

  useEffect(() => {
    // Combine real notifications with mock data for demo purposes
    const combinedNotifications = [
      ...realNotifications.map(notif => ({
        ...notif,
        type: notif.type as any, // Type mapping
        isRead: notif.read,
        timestamp: formatTimestamp(notif.timestamp),
      })),
      ...mockNotifications,
    ];
    setAllNotifications(combinedNotifications);
  }, [realNotifications]);

  // Set up navigation header with settings button
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('NotificationSettings' as never)}
          style={{ marginRight: 16 }}
        >
          <Ionicons name="settings-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const formatTimestamp = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const handleMarkAsRead = (notificationId: string) => {
    // Handle both real notifications and mock notifications
    const notification = allNotifications.find(n => n.id === notificationId);
    if (notification && 'read' in notification) {
      // Real notification
      markAsRead(notificationId);
    } else {
      // Mock notification - update local state
      setAllNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId
            ? { ...notif, isRead: true }
            : notif
        )
      );
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead(); // Handle real notifications
    // Handle mock notifications
    setAllNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'unlock':
      case 'vault_item_available': return 'lock-open';
      case 'follow':
      case 'social_follow': return 'person-add';
      case 'event':
      case 'event_reminder': return 'calendar';
      case 'achievement':
      case 'xp_milestone': return 'trophy';
      case 'reward': return 'star';
      case 'lesson_reminder': return 'book-outline';
      case 'streak_reminder': return 'flame-outline';
      case 'hearts_refilled': return 'heart';
      case 'daily_challenge': return 'ribbon-outline';
      default: return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'unlock': return colors.gold;
      case 'follow': return colors.accent;
      case 'event': return '#FF9800';
      case 'achievement': return colors.gold;
      case 'reward': return '#9C27B0';
      default: return colors.subtext;
    }
  };

  const renderNotification = (notification: Notification) => (
    <Pressable
      key={notification.id}
      style={[
        styles.notificationCard,
        !notification.isRead && styles.unreadCard,
      ]}
      onPress={() => handleMarkAsRead(notification.id)}
    >
      <View style={styles.notificationContent}>
        <View style={styles.iconContainer}>
          {notification.image ? (
            <Image source={{ uri: notification.image }} style={styles.notificationImage} />
          ) : (
            <View style={[
              styles.iconCircle,
              { backgroundColor: getNotificationColor(notification.type) + '20' }
            ]}>
              <Ionicons
                name={getNotificationIcon(notification.type) as any}
                size={20}
                color={getNotificationColor(notification.type)}
              />
            </View>
          )}
          {!notification.isRead && <View style={styles.unreadDot} />}
        </View>

        <View style={styles.textContent}>
          <Text style={[
            styles.notificationTitle,
            !notification.isRead && styles.unreadTitle
          ]}>
            {notification.title}
          </Text>
          <Text style={styles.notificationMessage}>
            {notification.message}
          </Text>
          <Text style={styles.timestamp}>
            {notification.timestamp}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  const totalUnreadCount = allNotifications.filter(n => !n.isRead).length;

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          {totalUnreadCount > 0 && (
            <Text style={styles.headerSubtitle}>
              {totalUnreadCount} unread notification{totalUnreadCount !== 1 ? 's' : ''}
            </Text>
          )}
        </View>
        {totalUnreadCount > 0 && (
          <Pressable style={styles.markAllButton} onPress={handleMarkAllAsRead}>
            <Text style={styles.markAllButtonText}>Mark all read</Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {allNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="bell-off"
              size={64}
              color={colors.subtext}
            />
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptyMessage}>
              We'll notify you about unlocks, follows, and event reminders
            </Text>
          </View>
        ) : (
          <View style={styles.notificationsList}>
            {allNotifications.map(renderNotification)}
          </View>
        )}
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.accent,
    marginTop: spacing(0.5),
    fontWeight: '600',
  },
  markAllButton: {
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
    borderRadius: radii.md,
    backgroundColor: colors.accent + '20',
  },
  markAllButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing(4),
  },
  notificationsList: {
    paddingHorizontal: spacing(3),
    paddingTop: spacing(2),
  },
  notificationCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    marginBottom: spacing(2),
    borderWidth: 1,
    borderColor: colors.line,
  },
  unreadCard: {
    borderColor: colors.accent,
    backgroundColor: colors.accent + '05',
  },
  notificationContent: {
    flexDirection: 'row',
    padding: spacing(3),
    alignItems: 'flex-start',
  },
  iconContainer: {
    position: 'relative',
    marginRight: spacing(3),
  },
  notificationImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.bg,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.card,
  },
  textContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  unreadTitle: {
    fontWeight: '700',
    color: colors.text,
  },
  notificationMessage: {
    fontSize: 14,
    color: colors.subtext,
    lineHeight: 20,
    marginBottom: spacing(1),
  },
  timestamp: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing(4),
    paddingVertical: spacing(8),
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing(3),
    marginBottom: spacing(2),
  },
  emptyMessage: {
    fontSize: 16,
    color: colors.subtext,
    textAlign: 'center',
    lineHeight: 24,
  },
});