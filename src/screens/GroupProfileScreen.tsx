import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../theme/tokens';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useSocialData, Group, User } from '../hooks/useSocialData';

type GroupProfileRouteProp = RouteProp<RootStackParamList, 'GroupProfile'>;

interface TabOption {
  key: 'feed' | 'members' | 'about';
  label: string;
  icon: string;
}

const tabs: TabOption[] = [
  { key: 'feed', label: 'Feed', icon: 'newspaper-outline' },
  { key: 'members', label: 'Members', icon: 'people-outline' },
  { key: 'about', label: 'About', icon: 'information-circle-outline' },
];

export default function GroupProfileScreen() {
  const [activeTab, setActiveTab] = useState<'feed' | 'members' | 'about'>('feed');
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<GroupProfileRouteProp>();
  const { groupId } = route.params;
  const { socialData, toggleGroupMembership, isGroupMember } = useSocialData();

  // Find the group from discovered or joined groups
  const group = [...socialData.discoveredGroups, ...socialData.joinedGroups]
    .find(g => g.id === groupId) || socialData.discoveredGroups[0];
  
  const isMember = isGroupMember(group.id);

  useLayoutEffect(() => {
    nav.setOptions({
      title: group.name,
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { color: colors.text, fontWeight: '600' },
      headerShadowVisible: false,
      headerLeft: () => (
        <Pressable hitSlop={12} onPress={() => nav.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
      ),
    });
  }, [nav, group.name]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cocktails': return '#FF6B6B';
      case 'spirits': return '#4ECDC4';
      case 'bars': return '#45B7D1';
      case 'events': return '#96CEB4';
      case 'general': return '#FFEAA7';
      default: return colors.accent;
    }
  };

  const renderMemberItem = ({ item }: { item: User }) => (
    <Pressable 
      style={styles.memberItem}
      onPress={() => nav.navigate('UserProfile' as never, { userId: item.id, isOwnProfile: false } as never)}
    >
      <Image source={{ uri: item.avatar }} style={styles.memberAvatar} />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberUsername}>@{item.username}</Text>
        {item.isVerified && (
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={14} color={colors.accent} />
          </View>
        )}
      </View>
      <Text style={styles.memberStats}>
        {item.stats.followers.toLocaleString()} followers
      </Text>
    </Pressable>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'feed':
        return (
          <View style={styles.tabContent}>
            <View style={styles.feedPlaceholder}>
              <Ionicons name="newspaper-outline" size={48} color={colors.subtext} />
              <Text style={styles.placeholderTitle}>Group Feed</Text>
              <Text style={styles.placeholderDescription}>
                Posts and discussions from group members will appear here
              </Text>
            </View>
          </View>
        );
      case 'members':
        return (
          <FlatList
            data={socialData.suggestedUsers} // Mock members data
            renderItem={renderMemberItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.membersList}
            showsVerticalScrollIndicator={false}
          />
        );
      case 'about':
        return (
          <View style={styles.aboutContent}>
            <View style={styles.aboutSection}>
              <Text style={styles.aboutLabel}>Description</Text>
              <Text style={styles.aboutText}>{group.description}</Text>
            </View>
            
            <View style={styles.aboutSection}>
              <Text style={styles.aboutLabel}>Category</Text>
              <View style={styles.categoryContainer}>
                <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(group.category) + '20' }]}>
                  <Text style={[styles.categoryText, { color: getCategoryColor(group.category) }]}>
                    {group.category.charAt(0).toUpperCase() + group.category.slice(1)}
                  </Text>
                </View>
              </View>
            </View>

            {group.tags.length > 0 && (
              <View style={styles.aboutSection}>
                <Text style={styles.aboutLabel}>Tags</Text>
                <View style={styles.tagsContainer}>
                  {group.tags.map(tag => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.aboutSection}>
              <Text style={styles.aboutLabel}>Created</Text>
              <Text style={styles.aboutText}>
                {new Date(group.createdDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>

            <View style={styles.aboutSection}>
              <Text style={styles.aboutLabel}>Privacy</Text>
              <View style={styles.privacyContainer}>
                <Ionicons 
                  name={group.isPrivate ? "lock-closed" : "globe-outline"} 
                  size={16} 
                  color={colors.subtext} 
                />
                <Text style={styles.aboutText}>
                  {group.isPrivate ? 'Private Group' : 'Public Group'}
                </Text>
              </View>
            </View>

            <View style={styles.aboutSection}>
              <Text style={styles.aboutLabel}>Group Owner</Text>
              <Pressable 
                style={styles.ownerContainer}
                onPress={() => nav.navigate('UserProfile' as never, { userId: group.owner.id, isOwnProfile: false } as never)}
              >
                <Image source={{ uri: group.owner.avatar }} style={styles.ownerAvatar} />
                <View style={styles.ownerInfo}>
                  <Text style={styles.ownerName}>{group.owner.name}</Text>
                  <Text style={styles.ownerUsername}>@{group.owner.username}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.subtext} />
              </Pressable>
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
        {/* Group Header */}
        <View style={styles.groupHeader}>
          {/* Cover Image */}
          {group.coverImage && (
            <Image source={{ uri: group.coverImage }} style={styles.coverImage} />
          )}
          
          <View style={styles.groupInfo}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: group.avatar }} style={styles.groupAvatar} />
            </View>
            
            <Text style={styles.groupName}>{group.name}</Text>
            <Text style={styles.groupDescription}>{group.description}</Text>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{group.memberCount.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Members</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {group.isPrivate ? 'Private' : 'Public'}
                </Text>
                <Text style={styles.statLabel}>Privacy</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{group.category}</Text>
                <Text style={styles.statLabel}>Category</Text>
              </View>
            </View>

            {/* Action Button */}
            <Pressable 
              style={[styles.actionButton, isMember && styles.joinedButton]}
              onPress={() => toggleGroupMembership(group)}
            >
              <Text style={[styles.actionButtonText, isMember && styles.joinedButtonText]}>
                {isMember ? 'Joined' : 'Join Group'}
              </Text>
            </Pressable>
          </View>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  groupHeader: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  coverImage: {
    width: '100%',
    height: 120,
    backgroundColor: colors.card,
  },
  groupInfo: {
    alignItems: 'center',
    padding: spacing(4),
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing(2),
    marginTop: -30, // Overlap with cover image
  },
  groupAvatar: {
    width: 80,
    height: 80,
    borderRadius: radii.lg,
    backgroundColor: colors.card,
    borderWidth: 3,
    borderColor: colors.bg,
  },
  groupName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing(1),
  },
  groupDescription: {
    fontSize: 16,
    color: colors.subtext,
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
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: colors.subtext,
    marginTop: spacing(0.5),
  },
  actionButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing(3),
    paddingHorizontal: spacing(6),
    borderRadius: radii.md,
    width: '100%',
    alignItems: 'center',
  },
  joinedButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.accent,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  joinedButtonText: {
    color: colors.accent,
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
  feedPlaceholder: {
    alignItems: 'center',
    gap: spacing(2),
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  placeholderDescription: {
    fontSize: 16,
    color: colors.subtext,
    textAlign: 'center',
    lineHeight: 22,
  },
  membersList: {
    padding: spacing(3),
    gap: spacing(2),
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(3),
    borderWidth: 1,
    borderColor: colors.line,
    gap: spacing(3),
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.bg,
  },
  memberInfo: {
    flex: 1,
    position: 'relative',
  },
  memberName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  memberUsername: {
    fontSize: 14,
    color: colors.subtext,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  memberStats: {
    fontSize: 12,
    color: colors.subtext,
    fontWeight: '600',
  },
  aboutContent: {
    padding: spacing(3),
    gap: spacing(4),
  },
  aboutSection: {
    gap: spacing(2),
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
  categoryContainer: {
    flexDirection: 'row',
  },
  categoryBadge: {
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(1.5),
    borderRadius: radii.md,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(2),
  },
  tag: {
    backgroundColor: colors.accent + '20',
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(1),
    borderRadius: radii.md,
  },
  tagText: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '600',
  },
  privacyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(2),
  },
  ownerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(3),
    borderWidth: 1,
    borderColor: colors.line,
    gap: spacing(3),
  },
  ownerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.bg,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  ownerUsername: {
    fontSize: 14,
    color: colors.subtext,
  },
});