import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../theme/tokens';

interface LeaderboardUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  xp: number;
  rank: number;
  isFollowed: boolean;
  streak: number;
  badges: number;
}

const mockUsers: LeaderboardUser[] = [
  {
    id: '1',
    username: '@mixmaster_alex',
    displayName: 'Alex Martinez',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    xp: 4850,
    rank: 1,
    isFollowed: false,
    streak: 28,
    badges: 12,
  },
  {
    id: '2',
    username: '@cocktail_queen',
    displayName: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2ddc5ce?w=150&h=150&fit=crop&crop=face',
    xp: 4720,
    rank: 2,
    isFollowed: true,
    streak: 21,
    badges: 10,
  },
  {
    id: '3',
    username: '@spirit_sage',
    displayName: 'Marcus Johnson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    xp: 4650,
    rank: 3,
    isFollowed: false,
    streak: 15,
    badges: 11,
  },
  {
    id: '4',
    username: '@bartender_bob',
    displayName: 'Robert Kim',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    xp: 3890,
    rank: 4,
    isFollowed: true,
    streak: 42,
    badges: 8,
  },
  {
    id: '5',
    username: '@mixology_maya',
    displayName: 'Maya Patel',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    xp: 3650,
    rank: 5,
    isFollowed: false,
    streak: 7,
    badges: 9,
  },
  {
    id: 'current',
    username: '@you',
    displayName: 'You',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    xp: 950,
    rank: 47,
    isFollowed: false,
    streak: 3,
    badges: 4,
  },
];

type TabType = 'global' | 'friends' | 'weekly';

export default function LeaderboardScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('global');
  const [users, setUsers] = useState(mockUsers);

  const handleFollow = (userId: string) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId
          ? { ...user, isFollowed: !user.isFollowed }
          : user
      )
    );
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return colors.gold;
      case 2: return '#C0C0C0'; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return colors.text;
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return 'trophy';
      case 2: return 'medal';
      case 3: return 'medal';
      default: return null;
    }
  };

  const getFilteredUsers = () => {
    switch (activeTab) {
      case 'friends':
        return users.filter(user => user.isFollowed || user.id === 'current');
      case 'weekly':
        // For demo purposes, same data with different ordering
        return [...users].sort((a, b) => b.streak - a.streak);
      case 'global':
      default:
        return users;
    }
  };

  const renderUserRow = (user: LeaderboardUser, index: number) => {
    const isCurrentUser = user.id === 'current';
    const rankIcon = getRankIcon(user.rank);

    return (
      <View
        key={user.id}
        style={[
          styles.userRow,
          isCurrentUser && styles.currentUserRow,
          index === 0 && styles.firstPlace,
        ]}
      >
        <View style={styles.rankContainer}>
          {rankIcon ? (
            <MaterialCommunityIcons
              name={rankIcon}
              size={24}
              color={getRankColor(user.rank)}
            />
          ) : (
            <Text style={[styles.rankText, { color: getRankColor(user.rank) }]}>
              #{user.rank}
            </Text>
          )}
        </View>

        <Image source={{ uri: user.avatar }} style={styles.avatar} />

        <View style={styles.userInfo}>
          <Text style={[styles.displayName, isCurrentUser && styles.currentUserText]}>
            {user.displayName}
          </Text>
          <Text style={styles.username}>{user.username}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="star" size={14} color={colors.gold} />
              <Text style={styles.statText}>{user.xp} XP</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="fire" size={14} color="#FF5722" />
              <Text style={styles.statText}>{user.streak} day streak</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="shield-star" size={14} color={colors.accent} />
              <Text style={styles.statText}>{user.badges} badges</Text>
            </View>
          </View>
        </View>

        {!isCurrentUser && (
          <Pressable
            style={[
              styles.followButton,
              user.isFollowed && styles.followingButton,
            ]}
            onPress={() => handleFollow(user.id)}
          >
            <Text style={[
              styles.followButtonText,
              user.isFollowed && styles.followingButtonText,
            ]}>
              {user.isFollowed ? 'Following' : 'Follow'}
            </Text>
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <Text style={styles.headerSubtitle}>Compete with the community</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {[
          { key: 'global' as TabType, label: 'Global' },
          { key: 'friends' as TabType, label: 'Friends' },
          { key: 'weekly' as TabType, label: 'Weekly' },
        ].map((tab) => (
          <Pressable
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Leaderboard List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.leaderboardList}>
          {getFilteredUsers().map((user, index) => renderUserRow(user, index))}
        </View>

        {/* Current User Position (if not in top visible) */}
        {activeTab === 'global' && (
          <View style={styles.currentUserSection}>
            <View style={styles.divider} />
            <Text style={styles.currentUserLabel}>Your Position</Text>
            {renderUserRow(users.find(u => u.id === 'current')!, -1)}
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
    color: colors.subtext,
    marginTop: spacing(0.5),
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
    gap: spacing(1),
  },
  tab: {
    flex: 1,
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(3),
    borderRadius: radii.md,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.accent,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.subtext,
  },
  activeTabText: {
    color: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing(4),
  },
  leaderboardList: {
    paddingHorizontal: spacing(3),
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(3),
    marginBottom: spacing(2),
    borderWidth: 1,
    borderColor: colors.line,
  },
  currentUserRow: {
    borderColor: colors.accent,
    borderWidth: 2,
    backgroundColor: colors.accent + '10',
  },
  firstPlace: {
    borderColor: colors.gold,
    borderWidth: 2,
    backgroundColor: colors.gold + '10',
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: spacing(2),
  },
  rankText: {
    fontSize: 18,
    fontWeight: '800',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: spacing(3),
    backgroundColor: colors.bg,
  },
  userInfo: {
    flex: 1,
  },
  displayName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(0.25),
  },
  currentUserText: {
    color: colors.accent,
  },
  username: {
    fontSize: 13,
    color: colors.subtext,
    marginBottom: spacing(1),
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing(2),
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(0.25),
  },
  statText: {
    fontSize: 12,
    color: colors.subtext,
    fontWeight: '500',
  },
  followButton: {
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingHorizontal: spacing(2.5),
    paddingVertical: spacing(1.5),
  },
  followingButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  followingButtonText: {
    color: colors.text,
  },
  currentUserSection: {
    marginTop: spacing(3),
    paddingHorizontal: spacing(3),
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
    marginVertical: spacing(2),
  },
  currentUserLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(2),
    textAlign: 'center',
  },
});