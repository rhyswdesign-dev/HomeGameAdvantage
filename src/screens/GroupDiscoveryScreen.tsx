import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../theme/tokens';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useSocialData, Group } from '../hooks/useSocialData';

const categories = [
  { key: 'all', label: 'All', icon: 'grid-outline' },
  { key: 'cocktails', label: 'Cocktails', icon: 'wine-outline' },
  { key: 'spirits', label: 'Spirits', icon: 'wine-outline' },
  { key: 'bars', label: 'Bars', icon: 'storefront-outline' },
  { key: 'events', label: 'Events', icon: 'calendar-outline' },
  { key: 'general', label: 'General', icon: 'people-outline' },
];

export default function GroupDiscoveryScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { socialData, toggleGroupMembership, isGroupMember } = useSocialData();

  useLayoutEffect(() => {
    nav.setOptions({
      title: 'Discover Groups',
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { color: colors.text, fontWeight: '700' },
      headerShadowVisible: false,
    });
  }, [nav]);

  const filteredGroups = socialData.discoveredGroups.filter(group => {
    const matchesCategory = selectedCategory === 'all' || group.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const renderCategoryChip = ({ item }: { item: typeof categories[0] }) => (
    <Pressable
      style={[styles.categoryChip, selectedCategory === item.key && styles.activeCategoryChip]}
      onPress={() => setSelectedCategory(item.key)}
    >
      <Ionicons 
        name={item.icon as any} 
        size={16} 
        color={selectedCategory === item.key ? colors.white : colors.text} 
      />
      <Text style={[styles.categoryChipText, selectedCategory === item.key && styles.activeCategoryChipText]}>
        {item.label}
      </Text>
    </Pressable>
  );

  const renderGroupCard = ({ item }: { item: Group }) => {
    const isMember = isGroupMember(item.id);

    return (
      <Pressable 
        style={styles.groupCard}
        onPress={() => nav.navigate('GroupProfile' as never, { groupId: item.id } as never)}
      >
        <View style={styles.groupHeader}>
          <Image source={{ uri: item.avatar }} style={styles.groupAvatar} />
          <View style={styles.groupInfo}>
            <View style={styles.groupTitleRow}>
              <Text style={styles.groupName} numberOfLines={1}>
                {item.name}
              </Text>
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) + '20' }]}>
                <Text style={[styles.categoryBadgeText, { color: getCategoryColor(item.category) }]}>
                  {item.category.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={styles.groupDescription} numberOfLines={2}>
              {item.description}
            </Text>
            <View style={styles.groupMeta}>
              <View style={styles.memberCount}>
                <Ionicons name="people" size={14} color={colors.subtext} />
                <Text style={styles.memberCountText}>
                  {item.memberCount.toLocaleString()} members
                </Text>
              </View>
              {item.isPrivate && (
                <View style={styles.privateIndicator}>
                  <Ionicons name="lock-closed" size={12} color={colors.subtext} />
                  <Text style={styles.privateText}>Private</Text>
                </View>
              )}
            </View>
            {item.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {item.tags.slice(0, 3).map(tag => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.groupActions}>
          <Pressable 
            style={[styles.joinButton, isMember && styles.joinedButton]}
            onPress={() => toggleGroupMembership(item)}
          >
            <Text style={[styles.joinButtonText, isMember && styles.joinedButtonText]}>
              {isMember ? 'Joined' : 'Join'}
            </Text>
          </Pressable>
        </View>
      </Pressable>
    );
  };

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

  return (
    <SafeAreaView style={styles.container}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.subtext} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search groups..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.subtext}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.subtext} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <FlatList
          data={categories}
          renderItem={renderCategoryChip}
          keyExtractor={item => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        />
      </View>

      {/* My Groups Section */}
      {socialData.joinedGroups.length > 0 && (
        <View style={styles.myGroupsSection}>
          <Text style={styles.sectionTitle}>My Groups</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.myGroupsList}>
              {socialData.joinedGroups.map(group => (
                <Pressable 
                  key={group.id}
                  style={styles.myGroupItem}
                  onPress={() => nav.navigate('GroupProfile' as never, { groupId: group.id } as never)}
                >
                  <Image source={{ uri: group.avatar }} style={styles.myGroupAvatar} />
                  <Text style={styles.myGroupName} numberOfLines={2}>
                    {group.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Groups List */}
      <View style={styles.groupsSection}>
        <Text style={styles.sectionTitle}>
          {selectedCategory === 'all' ? 'All Groups' : `${categories.find(c => c.key === selectedCategory)?.label} Groups`}
        </Text>
        <FlatList
          data={filteredGroups}
          renderItem={renderGroupCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.groupsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color={colors.subtext} />
              <Text style={styles.emptyTitle}>No groups found</Text>
              <Text style={styles.emptyDescription}>
                {searchQuery ? 'Try adjusting your search terms' : 'No groups in this category'}
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  searchContainer: {
    padding: spacing(3),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
    gap: spacing(2),
    borderWidth: 1,
    borderColor: colors.line,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  categoriesSection: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  categoriesContainer: {
    padding: spacing(3),
    gap: spacing(2),
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
    borderRadius: radii.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    gap: spacing(1),
  },
  activeCategoryChip: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  activeCategoryChipText: {
    color: colors.white,
  },
  myGroupsSection: {
    padding: spacing(3),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(3),
  },
  myGroupsList: {
    flexDirection: 'row',
    gap: spacing(3),
  },
  myGroupItem: {
    alignItems: 'center',
    width: 80,
  },
  myGroupAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.card,
    marginBottom: spacing(2),
  },
  myGroupName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 16,
  },
  groupsSection: {
    flex: 1,
    padding: spacing(3),
  },
  groupsList: {
    gap: spacing(3),
  },
  groupCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(3),
    borderWidth: 1,
    borderColor: colors.line,
  },
  groupHeader: {
    flexDirection: 'row',
    gap: spacing(3),
    marginBottom: spacing(3),
  },
  groupAvatar: {
    width: 60,
    height: 60,
    borderRadius: radii.md,
    backgroundColor: colors.bg,
  },
  groupInfo: {
    flex: 1,
    gap: spacing(1),
  },
  groupTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing(2),
  },
  groupName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(0.5),
    borderRadius: radii.sm,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  groupDescription: {
    fontSize: 14,
    color: colors.subtext,
    lineHeight: 20,
  },
  groupMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(3),
  },
  memberCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1),
  },
  memberCountText: {
    fontSize: 12,
    color: colors.subtext,
    fontWeight: '600',
  },
  privateIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1),
  },
  privateText: {
    fontSize: 12,
    color: colors.subtext,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: spacing(1),
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.accent + '20',
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(0.5),
    borderRadius: radii.sm,
  },
  tagText: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
  },
  groupActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  joinButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing(4),
    paddingVertical: spacing(2),
    borderRadius: radii.md,
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing(8),
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing(3),
    marginBottom: spacing(2),
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.subtext,
    textAlign: 'center',
  },
});