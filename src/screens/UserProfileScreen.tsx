import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
  FlatList,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../theme/tokens';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useSocialData, User, Post, Recipe, Achievement } from '../hooks/useSocialData';
import { usePosts } from '../contexts/PostsContext';

type UserProfileRouteProp = RouteProp<RootStackParamList, 'UserProfile'>;

interface TabOption {
  key: 'posts' | 'recipes' | 'achievements' | 'about';
  label: string;
  icon: string;
}

const tabs: TabOption[] = [
  { key: 'posts', label: 'Posts', icon: 'grid-outline' },
  { key: 'recipes', label: 'Recipes', icon: 'restaurant-outline' },
  { key: 'achievements', label: 'Achievements', icon: 'trophy-outline' },
  { key: 'about', label: 'About', icon: 'information-circle-outline' },
];

export default function UserProfileScreen() {
  const [activeTab, setActiveTab] = useState<'posts' | 'recipes' | 'achievements' | 'about'>('posts');
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<UserProfileRouteProp>();
  const { userId, isOwnProfile = false } = route.params;
  const { socialData, toggleFollow, isFollowing } = useSocialData();
  const { userPosts } = usePosts();

  // Get user data - if it's own profile, use current user, otherwise find from suggested users
  const user = isOwnProfile 
    ? socialData.currentUser 
    : socialData.suggestedUsers.find(u => u.id === userId) || socialData.currentUser;

  const isUserFollowing = isFollowing(user.id);

  // Generate QR code data with user's favorite spirits and recommendations
  const generateQRData = () => {
    const favoriteSpirits = ['Gin', 'Whiskey', 'Rum']; // Mock data - would come from user profile
    const recommendations = [
      'Try a classic Negroni',
      'Hendricks Gin would be perfect for your collection',
      'Consider adding a quality bourbon like Buffalo Trace'
    ];

    return {
      userId: user.id,
      username: user.username,
      favoriteSpirits,
      recommendations,
      profile: `https://app.homegameadvantage.com/profile/${user.id}`
    };
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'general': return colors.accent;
      case 'review': return '#FF6B35';
      case 'discovery': return '#8B5CF6';
      case 'achievement': return '#F59E0B';
      case 'event': return '#10B981';
      default: return colors.accent;
    }
  };

  const getPostTypeIcon = (type: string): any => {
    switch (type) {
      case 'general': return 'chatbubble';
      case 'review': return 'star';
      case 'discovery': return 'compass';
      case 'achievement': return 'trophy';
      case 'event': return 'calendar';
      default: return 'chatbubble';
    }
  };

  useLayoutEffect(() => {
    nav.setOptions({
      title: user.username,
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { color: colors.text, fontWeight: '600' },
      headerShadowVisible: false,
    });
  }, [nav, user.username]);

  const renderStatItem = (label: string, value: number) => (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value.toLocaleString()}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const renderAchievement = ({ item }: { item: Achievement }) => (
    <View style={styles.achievementCard}>
      <View style={[styles.achievementIcon, { 
        backgroundColor: item.unlockedDate ? colors.gold + '20' : colors.subtext + '20' 
      }]}>
        <Ionicons 
          name={item.icon as any} 
          size={24} 
          color={item.unlockedDate ? colors.gold : colors.subtext} 
        />
      </View>
      <View style={styles.achievementInfo}>
        <Text style={styles.achievementTitle}>{item.title}</Text>
        <Text style={styles.achievementDescription}>{item.description}</Text>
        {item.progress && !item.unlockedDate && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(item.progress.current / item.progress.total) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {item.progress.current}/{item.progress.total}
            </Text>
          </View>
        )}
        {item.unlockedDate && (
          <Text style={styles.unlockedDate}>
            Unlocked {new Date(item.unlockedDate).toLocaleDateString()}
          </Text>
        )}
      </View>
      <View style={[styles.rarityBadge, { 
        backgroundColor: 
          item.rarity === 'legendary' ? '#9C27B0' :
          item.rarity === 'rare' ? colors.gold :
          colors.accent
      }]}>
        <Text style={styles.rarityText}>{item.rarity.toUpperCase()}</Text>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        // Only show user posts for own profile
        const postsToShow = isOwnProfile ? userPosts : [];

        return (
          <View style={styles.tabContentScroll}>
            {postsToShow.length > 0 ? (
              <View style={styles.postsContainer}>
                {postsToShow.map(post => (
                  <View key={post.id} style={styles.postCard}>
                    <View style={styles.postHeader}>
                      <Image source={{ uri: post.author.avatar }} style={styles.postAvatar} />
                      <View style={styles.postAuthorInfo}>
                        <View style={styles.authorNameRow}>
                          <Text style={styles.authorName}>{post.author.name}</Text>
                          {post.author.isVerified && <Ionicons name="checkmark-circle" size={16} color={colors.accent} />}
                        </View>
                        <Text style={styles.authorUsername}>@{post.author.username} • {post.timestamp}</Text>
                      </View>
                      <View style={[styles.postTypeBadge, { backgroundColor: getPostTypeColor(post.type) + '20' }]}>
                        <Ionicons name={getPostTypeIcon(post.type)} size={14} color={getPostTypeColor(post.type)} />
                        <Text style={[styles.postTypeText, { color: getPostTypeColor(post.type) }]}>
                          {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.postContent}>{post.content}</Text>
                    {post.image && <Image source={{ uri: post.image }} style={styles.postImage} />}

                    <View style={styles.postActions}>
                      <View style={styles.actionButton}>
                        <Ionicons name="heart-outline" size={20} color={colors.subtext} />
                        <Text style={styles.actionText}>{post.likes}</Text>
                      </View>
                      <View style={styles.actionButton}>
                        <Ionicons name="chatbubble-outline" size={20} color={colors.subtext} />
                        <Text style={styles.actionText}>{post.comments}</Text>
                      </View>
                      <View style={styles.actionButton}>
                        <Ionicons name="arrow-redo-outline" size={20} color={colors.subtext} />
                      </View>
                      <View style={styles.actionButton}>
                        <Ionicons name="bookmark-outline" size={20} color={colors.subtext} />
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.tabContent}>
                <Ionicons name="document-text-outline" size={48} color={colors.subtext} />
                {isOwnProfile ? (
                  <>
                    <Text style={styles.emptyStateText}>No posts yet</Text>
                    <Text style={styles.emptyStateSubtext}>
                      Share your first post in the Community tab to see it here
                    </Text>
                  </>
                ) : (
                  <Text style={styles.emptyStateText}>No posts to show</Text>
                )}
              </View>
            )}
          </View>
        );
      case 'recipes':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.emptyStateText}>Recipes coming soon</Text>
          </View>
        );
      case 'achievements':
        return (
          <FlatList
            data={socialData.achievements}
            renderItem={renderAchievement}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.achievementsList}
            showsVerticalScrollIndicator={false}
          />
        );
      case 'about':
        return (
          <View style={styles.aboutContent}>
            <View style={styles.aboutSection}>
              <Text style={styles.aboutLabel}>Bio</Text>
              <Text style={styles.aboutText}>
                {user.bio || 'No bio available'}
              </Text>
            </View>
            {user.location && (
              <View style={styles.aboutSection}>
                <Text style={styles.aboutLabel}>Location</Text>
                <Text style={styles.aboutText}>{user.location}</Text>
              </View>
            )}
            <View style={styles.aboutSection}>
              <Text style={styles.aboutLabel}>Member Since</Text>
              <Text style={styles.aboutText}>
                {new Date(user.joinDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>

            {/* Achievements Section */}
            <View style={styles.aboutSection}>
              <Text style={styles.aboutLabel}>Achievements</Text>
              <View style={styles.achievementsGrid}>
                {socialData.achievements.map(achievement => (
                  <View key={achievement.id} style={styles.compactAchievementCard}>
                    <View style={[styles.compactAchievementIcon, { 
                      backgroundColor: achievement.unlockedDate ? colors.gold + '20' : colors.subtext + '20' 
                    }]}>
                      <Ionicons 
                        name={achievement.icon as any} 
                        size={20} 
                        color={achievement.unlockedDate ? colors.gold : colors.subtext} 
                      />
                    </View>
                    <View style={styles.compactAchievementInfo}>
                      <Text style={styles.compactAchievementTitle}>{achievement.title}</Text>
                      {achievement.progress && !achievement.unlockedDate && (
                        <View style={styles.compactProgressContainer}>
                          <View style={styles.compactProgressBar}>
                            <View 
                              style={[
                                styles.compactProgressFill, 
                                { width: `${(achievement.progress.current / achievement.progress.total) * 100}%` }
                              ]} 
                            />
                          </View>
                          <Text style={styles.compactProgressText}>
                            {achievement.progress.current}/{achievement.progress.total}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            {user.isVerified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={20} color={colors.accent} />
              </View>
            )}
          </View>
          
          <Text style={styles.displayName}>{user.name}</Text>
          <Text style={styles.username}>@{user.username}</Text>
          
          {user.bio && (
            <Text style={styles.bio}>{user.bio}</Text>
          )}

          {/* Stats */}
          <View style={styles.statsContainer}>
            {renderStatItem('Posts', user.stats.posts)}
            <Pressable 
              style={styles.statItem} 
              onPress={() => nav.navigate('FollowersList' as never, { userId: user.id, type: 'followers' } as never)}
            >
              <Text style={styles.statValue}>{user.stats.followers.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </Pressable>
            <Pressable 
              style={styles.statItem}
              onPress={() => nav.navigate('FollowersList' as never, { userId: user.id, type: 'following' } as never)}
            >
              <Text style={styles.statValue}>{user.stats.following.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </Pressable>
            {renderStatItem('Recipes', user.stats.recipes)}
          </View>

          {/* QR Code Section */}
          <View style={styles.qrSection}>
            <TouchableOpacity
              style={styles.qrButton}
              onPress={() => setQrModalVisible(true)}
            >
              <Ionicons name="qr-code" size={20} color={colors.accent} />
              <Text style={styles.qrButtonText}>Share Profile & Preferences</Text>
            </TouchableOpacity>
            <Text style={styles.qrSubtext}>Let friends see your spirit preferences</Text>
          </View>

          {/* Action Buttons */}
          {!isOwnProfile && (
            <View style={styles.actionButtons}>
              <Pressable 
                style={[styles.followButton, isUserFollowing && styles.followingButton]}
                onPress={() => toggleFollow(user)}
              >
                <Text style={[styles.followButtonText, isUserFollowing && styles.followingButtonText]}>
                  {isUserFollowing ? 'Following' : 'Follow'}
                </Text>
              </Pressable>
              <Pressable style={styles.messageButton}>
                <Ionicons name="mail-outline" size={18} color={colors.text} />
              </Pressable>
            </View>
          )}

          {isOwnProfile && (
            <Pressable style={styles.editProfileButton}>
              <Text style={styles.editProfileButtonText}>Edit Profile</Text>
            </Pressable>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map(tab => (
            <Pressable
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Ionicons 
                name={tab.icon as any} 
                size={18} 
                color={activeTab === tab.key ? colors.accent : colors.subtext} 
              />
              <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Tab Content */}
        {renderTabContent()}
      </ScrollView>

      {/* QR Code Modal */}
      <Modal
        visible={qrModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setQrModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setQrModalVisible(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Share Your Profile</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.modalContent}>
            {/* Mock QR Code */}
            <View style={styles.qrCodeContainer}>
              <View style={styles.qrCode}>
                <Text style={styles.qrCodeText}>QR</Text>
                <Text style={styles.qrCodeSubtext}>Code</Text>
              </View>
            </View>

            <Text style={styles.qrDescription}>
              Friends can scan this code to see your spirit preferences and get gift recommendations
            </Text>

            {/* User Info */}
            <View style={styles.userInfoCard}>
              <Image source={{ uri: user.avatar }} style={styles.modalAvatar} />
              <View style={styles.userInfoText}>
                <Text style={styles.modalUsername}>@{user.username}</Text>
                <Text style={styles.modalDisplayName}>{user.name}</Text>
              </View>
            </View>

            {/* Preferences Preview */}
            <View style={styles.preferencesCard}>
              <Text style={styles.preferencesTitle}>Spirit Preferences</Text>
              <View style={styles.preferencesGrid}>
                {generateQRData().favoriteSpirits.map((spirit, index) => (
                  <View key={index} style={styles.spiritTag}>
                    <Text style={styles.spiritTagText}>{spirit}</Text>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="share" size={20} color={colors.bg} />
              <Text style={styles.shareButtonText}>Share QR Code</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  profileHeader: {
    alignItems: 'center',
    padding: spacing(4),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing(2),
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.card,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: colors.bg,
    borderRadius: 12,
    padding: 2,
  },
  displayName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  username: {
    fontSize: 16,
    color: colors.subtext,
    marginBottom: spacing(2),
  },
  bio: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing(3),
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: spacing(3),
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: colors.subtext,
    marginTop: spacing(0.5),
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing(2),
    width: '100%',
  },
  followButton: {
    flex: 1,
    backgroundColor: colors.accent,
    paddingVertical: spacing(2),
    borderRadius: radii.md,
    alignItems: 'center',
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.accent,
  },
  followButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  followingButtonText: {
    color: colors.accent,
  },
  messageButton: {
    backgroundColor: colors.card,
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(3),
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editProfileButton: {
    backgroundColor: colors.card,
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(4),
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  editProfileButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing(3),
    gap: spacing(1),
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.subtext,
  },
  activeTabText: {
    color: colors.accent,
  },
  tabContent: {
    padding: spacing(4),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.subtext,
    textAlign: 'center',
  },
  achievementsList: {
    padding: spacing(3),
    gap: spacing(3),
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(3),
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    gap: spacing(3),
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  achievementDescription: {
    fontSize: 14,
    color: colors.subtext,
    lineHeight: 20,
  },
  progressContainer: {
    marginTop: spacing(2),
    gap: spacing(1),
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.line,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
  },
  progressText: {
    fontSize: 12,
    color: colors.subtext,
    fontWeight: '600',
  },
  unlockedDate: {
    fontSize: 12,
    color: colors.gold,
    fontWeight: '600',
    marginTop: spacing(1),
  },
  rarityBadge: {
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(0.5),
    borderRadius: radii.sm,
  },
  rarityText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.white,
  },
  aboutContent: {
    padding: spacing(3),
    gap: spacing(3),
  },
  aboutSection: {
    gap: spacing(1),
  },
  aboutLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  aboutText: {
    fontSize: 15,
    color: colors.subtext,
    lineHeight: 22,
  },
  achievementsGrid: {
    gap: spacing(2),
  },
  compactAchievementCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing(2),
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    gap: spacing(2),
  },
  compactAchievementIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactAchievementInfo: {
    flex: 1,
  },
  compactAchievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  compactProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(2),
  },
  compactProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.line,
    borderRadius: 2,
    overflow: 'hidden',
  },
  compactProgressFill: {
    height: '100%',
    backgroundColor: colors.accent,
  },
  compactProgressText: {
    fontSize: 11,
    color: colors.subtext,
    fontWeight: '600',
    minWidth: 30,
  },
  postsContainer: {
    paddingHorizontal: spacing(3),
    gap: spacing(2),
  },
  postCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(2.5),
    borderWidth: 1,
    borderColor: colors.line,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing(2),
  },
  postAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: spacing(1.5),
  },
  postAuthorInfo: {
    flex: 1,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(0.5),
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  authorUsername: {
    fontSize: 12,
    color: colors.subtext,
  },
  postTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing(1),
    paddingVertical: spacing(0.5),
    borderRadius: radii.sm,
    gap: spacing(0.5),
  },
  postTypeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  postContent: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: spacing(1.5),
  },
  postImage: {
    width: '100%',
    height: 150,
    borderRadius: radii.md,
    marginBottom: spacing(1.5),
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing(1.5),
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(0.5),
    flex: 1,
  },
  actionText: {
    fontSize: 12,
    color: colors.subtext,
    fontWeight: '600',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.subtext,
    textAlign: 'center',
    marginTop: spacing(1),
    opacity: 0.7,
  },
  tabContentScroll: {
    paddingBottom: spacing(6),
  },
  // QR Code styles
  qrSection: {
    alignItems: 'center',
    marginBottom: spacing(3),
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent + '20',
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.accent + '40',
    gap: spacing(1),
    marginBottom: spacing(1),
  },
  qrButtonText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  qrSubtext: {
    fontSize: 12,
    color: colors.subtext,
    textAlign: 'center',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  modalContent: {
    flex: 1,
    padding: spacing(3),
    alignItems: 'center',
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginBottom: spacing(3),
  },
  qrCode: {
    width: 200,
    height: 200,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing(2),
  },
  qrCodeText: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
  },
  qrCodeSubtext: {
    fontSize: 16,
    color: colors.subtext,
  },
  qrDescription: {
    fontSize: 14,
    color: colors.subtext,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing(4),
  },
  userInfoCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    padding: spacing(3),
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    width: '100%',
    marginBottom: spacing(3),
    alignItems: 'center',
    gap: spacing(2),
  },
  modalAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfoText: {
    flex: 1,
  },
  modalUsername: {
    fontSize: 14,
    color: colors.subtext,
    marginBottom: spacing(0.5),
  },
  modalDisplayName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  preferencesCard: {
    backgroundColor: colors.card,
    padding: spacing(3),
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    width: '100%',
    marginBottom: spacing(4),
  },
  preferencesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(2),
  },
  preferencesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(1.5),
  },
  spiritTag: {
    backgroundColor: colors.accent + '20',
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.accent + '40',
  },
  spiritTagText: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: spacing(4),
    paddingVertical: spacing(2.5),
    borderRadius: radii.md,
    gap: spacing(1),
  },
  shareButtonText: {
    color: colors.bg,
    fontSize: 16,
    fontWeight: '600',
  },
});