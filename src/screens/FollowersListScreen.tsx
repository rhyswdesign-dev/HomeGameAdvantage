import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../theme/tokens';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useSocialData, User } from '../hooks/useSocialData';

type FollowersListRouteProp = RouteProp<RootStackParamList, 'FollowersList'>;

export default function FollowersListScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<FollowersListRouteProp>();
  const { userId, type } = route.params;
  const { socialData, toggleFollow, isFollowing } = useSocialData();

  const isFollowersTab = type === 'followers';
  const title = isFollowersTab ? 'Followers' : 'Following';
  
  // For demo purposes, we'll show the same suggested users list
  // In a real app, this would be fetched based on userId and type
  const users = socialData.suggestedUsers;

  useLayoutEffect(() => {
    nav.setOptions({
      title,
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { color: colors.text, fontWeight: '700' },
      headerShadowVisible: false,
    });
  }, [nav, title]);

  const renderUserItem = ({ item }: { item: User }) => {
    const isUserFollowing = isFollowing(item.id);

    return (
      <Pressable 
        style={styles.userItem}
        onPress={() => nav.navigate('UserProfile' as never, { userId: item.id, isOwnProfile: false } as never)}
      >
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            {item.isVerified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={16} color={colors.accent} />
              </View>
            )}
          </View>
          
          <View style={styles.userDetails}>
            <Text style={styles.displayName}>{item.name}</Text>
            <Text style={styles.username}>@{item.username}</Text>
            {item.bio && (
              <Text style={styles.bio} numberOfLines={2}>
                {item.bio}
              </Text>
            )}
            <Text style={styles.stats}>
              {item.stats.followers.toLocaleString()} followers • {item.stats.posts} posts
            </Text>
          </View>
        </View>

        <Pressable 
          style={[styles.followButton, isUserFollowing && styles.followingButton]}
          onPress={() => toggleFollow(item)}
          hitSlop={8}
        >
          <Text style={[styles.followButtonText, isUserFollowing && styles.followingButtonText]}>
            {isUserFollowing ? 'Following' : 'Follow'}
          </Text>
        </Pressable>
      </Pressable>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons 
        name={isFollowersTab ? "people-outline" : "person-add-outline"} 
        size={64} 
        color={colors.subtext} 
      />
      <Text style={styles.emptyTitle}>
        {isFollowersTab ? 'No followers yet' : 'Not following anyone yet'}
      </Text>
      <Text style={styles.emptyDescription}>
        {isFollowersTab 
          ? 'When people follow this user, they\'ll appear here'
          : 'When this user follows people, they\'ll appear here'
        }
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  listContent: {
    padding: spacing(2),
    gap: spacing(1),
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(3),
    borderWidth: 1,
    borderColor: colors.line,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing(3),
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.bg,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.bg,
    borderRadius: 10,
    padding: 1,
  },
  userDetails: {
    flex: 1,
    gap: spacing(0.5),
  },
  displayName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  username: {
    fontSize: 14,
    color: colors.subtext,
  },
  bio: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 18,
    marginTop: spacing(0.5),
  },
  stats: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: spacing(0.5),
  },
  followButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(1.5),
    borderRadius: radii.md,
    minWidth: 80,
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing(8),
    paddingHorizontal: spacing(4),
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing(3),
    marginBottom: spacing(2),
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: colors.subtext,
    textAlign: 'center',
    lineHeight: 24,
  },
});