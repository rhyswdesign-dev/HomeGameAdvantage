import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../theme/tokens';
import { useSocialData, User, Group } from '../hooks/useSocialData';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

interface RecommenderProps {
  type: 'users' | 'groups' | 'mixed';
  title: string;
  subtitle?: string;
  onSeeAll?: () => void;
  maxItems?: number;
  style?: any;
}

export default function RecommenderComponent({
  type,
  title,
  subtitle,
  onSeeAll,
  maxItems = 5,
  style,
}: RecommenderProps) {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { socialData, toggleFollow, isFollowing, toggleGroupMembership, isGroupMember } = useSocialData();

  const getUserRecommendations = () => {
    return socialData.suggestedUsers.slice(0, maxItems);
  };

  const getGroupRecommendations = () => {
    return socialData.suggestedGroups.slice(0, maxItems);
  };

  const getMixedRecommendations = () => {
    const users = socialData.suggestedUsers.slice(0, Math.floor(maxItems / 2));
    const groups = socialData.suggestedGroups.slice(0, Math.ceil(maxItems / 2));
    
    // Interleave users and groups
    const mixed: Array<{ type: 'user'; data: User } | { type: 'group'; data: Group }> = [];
    const maxLength = Math.max(users.length, groups.length);
    
    for (let i = 0; i < maxLength; i++) {
      if (users[i]) mixed.push({ type: 'user', data: users[i] });
      if (groups[i]) mixed.push({ type: 'group', data: groups[i] });
    }
    
    return mixed.slice(0, maxItems);
  };

  const renderUserCard = (user: User, isCompact = false) => {
    const isUserFollowing = isFollowing(user.id);

    if (isCompact) {
      return (
        <Pressable
          key={user.id}
          style={styles.compactUserCard}
          onPress={() => nav.navigate('UserProfile' as never, { userId: user.id, isOwnProfile: false } as never)}
        >
          <View style={styles.compactUserInfo}>
            <Image source={{ uri: user.avatar }} style={styles.compactAvatar} />
            <View style={styles.compactUserDetails}>
              <Text style={styles.compactUserName} numberOfLines={1}>
                {user.name}
              </Text>
              <Text style={styles.compactUsername} numberOfLines={1}>
                @{user.username}
              </Text>
              <Text style={styles.compactStats}>
                {user.stats.followers.toLocaleString()} followers
              </Text>
            </View>
          </View>
          <Pressable 
            style={[styles.compactFollowButton, isUserFollowing && styles.compactFollowingButton]}
            onPress={() => toggleFollow(user)}
          >
            <Text style={[styles.compactFollowText, isUserFollowing && styles.compactFollowingText]}>
              {isUserFollowing ? 'Following' : 'Follow'}
            </Text>
          </Pressable>
        </Pressable>
      );
    }

    return (
      <Pressable
        key={user.id}
        style={styles.userCard}
        onPress={() => nav.navigate('UserProfile' as never, { userId: user.id, isOwnProfile: false } as never)}
      >
        <View style={styles.userCardContent}>
          <View style={styles.userAvatarContainer}>
            <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
            {user.isVerified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={16} color={colors.accent} />
              </View>
            )}
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userUsername}>@{user.username}</Text>
          {user.bio && (
            <Text style={styles.userBio} numberOfLines={2}>
              {user.bio}
            </Text>
          )}
          <Text style={styles.userStats}>
            {user.stats.followers.toLocaleString()} followers
          </Text>
        </View>
        <Pressable 
          style={[styles.followButton, isUserFollowing && styles.followingButton]}
          onPress={() => toggleFollow(user)}
        >
          <Text style={[styles.followButtonText, isUserFollowing && styles.followingButtonText]}>
            {isUserFollowing ? 'Following' : 'Follow'}
          </Text>
        </Pressable>
      </Pressable>
    );
  };

  const renderGroupCard = (group: Group, isCompact = false) => {
    const isMember = isGroupMember(group.id);

    if (isCompact) {
      return (
        <Pressable
          key={group.id}
          style={styles.compactGroupCard}
          onPress={() => nav.navigate('GroupProfile' as never, { groupId: group.id } as never)}
        >
          <View style={styles.compactGroupInfo}>
            <Image source={{ uri: group.avatar }} style={styles.compactGroupAvatar} />
            <View style={styles.compactGroupDetails}>
              <Text style={styles.compactGroupName} numberOfLines={1}>
                {group.name}
              </Text>
              <Text style={styles.compactGroupCategory}>
                {group.category}
              </Text>
              <Text style={styles.compactGroupStats}>
                {group.memberCount.toLocaleString()} members
              </Text>
            </View>
          </View>
          <Pressable 
            style={[styles.compactJoinButton, isMember && styles.compactJoinedButton]}
            onPress={() => toggleGroupMembership(group)}
          >
            <Text style={[styles.compactJoinText, isMember && styles.compactJoinedText]}>
              {isMember ? 'Joined' : 'Join'}
            </Text>
          </Pressable>
        </Pressable>
      );
    }

    return (
      <Pressable
        key={group.id}
        style={styles.groupCard}
        onPress={() => nav.navigate('GroupProfile' as never, { groupId: group.id } as never)}
      >
        <View style={styles.groupCardContent}>
          <Image source={{ uri: group.avatar }} style={styles.groupAvatar} />
          <Text style={styles.groupName}>{group.name}</Text>
          <Text style={styles.groupDescription} numberOfLines={2}>
            {group.description}
          </Text>
          <View style={styles.groupMeta}>
            <Text style={styles.groupCategory}>{group.category}</Text>
            <Text style={styles.groupMemberCount}>
              {group.memberCount.toLocaleString()} members
            </Text>
          </View>
        </View>
        <Pressable 
          style={[styles.joinButton, isMember && styles.joinedButton]}
          onPress={() => toggleGroupMembership(group)}
        >
          <Text style={[styles.joinButtonText, isMember && styles.joinedButtonText]}>
            {isMember ? 'Joined' : 'Join'}
          </Text>
        </Pressable>
      </Pressable>
    );
  };

  const renderMixedItem = ({ item }: { item: { type: 'user'; data: User } | { type: 'group'; data: Group } }) => {
    if (item.type === 'user') {
      return renderUserCard(item.data, true);
    } else {
      return renderGroupCard(item.data, true);
    }
  };

  if (type === 'users') {
    const users = getUserRecommendations();
    
    return (
      <View style={[styles.container, style]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          {onSeeAll && (
            <Pressable onPress={onSeeAll} style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.accent} />
            </Pressable>
          )}
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {users.map(user => renderUserCard(user))}
        </ScrollView>
      </View>
    );
  }

  if (type === 'groups') {
    const groups = getGroupRecommendations();
    
    return (
      <View style={[styles.container, style]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          {onSeeAll && (
            <Pressable onPress={onSeeAll} style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.accent} />
            </Pressable>
          )}
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {groups.map(group => renderGroupCard(group))}
        </ScrollView>
      </View>
    );
  }

  // Mixed type
  const mixedItems = getMixedRecommendations();
  
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {onSeeAll && (
          <Pressable onPress={onSeeAll} style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>See All</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.accent} />
          </Pressable>
        )}
      </View>
      
      <FlatList
        data={mixedItems}
        renderItem={renderMixedItem}
        keyExtractor={(item, index) => `${item.type}-${item.data.id}-${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.verticalList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing(3),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing(3),
    marginBottom: spacing(3),
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.subtext,
    marginTop: spacing(0.5),
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(0.5),
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  horizontalList: {
    paddingHorizontal: spacing(3),
    gap: spacing(3),
  },
  verticalList: {
    paddingHorizontal: spacing(3),
    gap: spacing(2),
  },
  
  // User Cards
  userCard: {
    width: 180,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(3),
    borderWidth: 1,
    borderColor: colors.line,
  },
  userCardContent: {
    alignItems: 'center',
    marginBottom: spacing(3),
  },
  userAvatarContainer: {
    position: 'relative',
    marginBottom: spacing(2),
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.bg,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.bg,
    borderRadius: 10,
    padding: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing(0.5),
  },
  userUsername: {
    fontSize: 14,
    color: colors.subtext,
    textAlign: 'center',
    marginBottom: spacing(1),
  },
  userBio: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: spacing(1),
  },
  userStats: {
    fontSize: 12,
    color: colors.subtext,
    textAlign: 'center',
  },
  followButton: {
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
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  followingButtonText: {
    color: colors.accent,
  },

  // Group Cards
  groupCard: {
    width: 200,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(3),
    borderWidth: 1,
    borderColor: colors.line,
  },
  groupCardContent: {
    alignItems: 'center',
    marginBottom: spacing(3),
  },
  groupAvatar: {
    width: 60,
    height: 60,
    borderRadius: radii.md,
    backgroundColor: colors.bg,
    marginBottom: spacing(2),
  },
  groupName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing(1),
  },
  groupDescription: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: spacing(2),
  },
  groupMeta: {
    alignItems: 'center',
    gap: spacing(0.5),
  },
  groupCategory: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  groupMemberCount: {
    fontSize: 12,
    color: colors.subtext,
  },
  joinButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing(2),
    borderRadius: radii.md,
    alignItems: 'center',
  },
  joinedButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.accent,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  joinedButtonText: {
    color: colors.accent,
  },

  // Compact Cards
  compactUserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(3),
    borderWidth: 1,
    borderColor: colors.line,
  },
  compactUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing(3),
  },
  compactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.bg,
  },
  compactUserDetails: {
    flex: 1,
  },
  compactUserName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  compactUsername: {
    fontSize: 14,
    color: colors.subtext,
  },
  compactStats: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: spacing(0.5),
  },
  compactFollowButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(1.5),
    borderRadius: radii.md,
  },
  compactFollowingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.accent,
  },
  compactFollowText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  compactFollowingText: {
    color: colors.accent,
  },

  compactGroupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(3),
    borderWidth: 1,
    borderColor: colors.line,
  },
  compactGroupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing(3),
  },
  compactGroupAvatar: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    backgroundColor: colors.bg,
  },
  compactGroupDetails: {
    flex: 1,
  },
  compactGroupName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  compactGroupCategory: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  compactGroupStats: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: spacing(0.5),
  },
  compactJoinButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(1.5),
    borderRadius: radii.md,
  },
  compactJoinedButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.accent,
  },
  compactJoinText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  compactJoinedText: {
    color: colors.accent,
  },
});