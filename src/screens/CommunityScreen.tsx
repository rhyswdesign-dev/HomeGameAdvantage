import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
  ImageBackground,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../theme/tokens';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useSocialData } from '../hooks/useSocialData';
import { useUser } from '../contexts/UserContext';
import { useSavedItems } from '../hooks/useSavedItems';
import { usePosts } from '../contexts/PostsContext';
import { SearchableItem, FilterOptions } from '../services/searchService';
import SearchModal from '../components/SearchModal';
import FilterDrawer from '../components/FilterDrawer';
import CreateRecipeModal from '../components/CreateRecipeModal';
import CreateContentModal from '../components/CreateContentModal';
import CreatePostModal from '../components/CreatePostModal';
import SectionHeader from '../components/SectionHeader';

interface TabOption {
  key: 'feed' | 'challenges' | 'groups' | 'games';
  label: string;
  icon: string;
}

const communityTabs: TabOption[] = [
  { key: 'feed', label: 'Feed', icon: 'newspaper-outline' },
  { key: 'challenges', label: 'Challenges', icon: 'trophy-outline' },
  { key: 'groups', label: 'Groups', icon: 'people-outline' },
  { key: 'games', label: 'Games', icon: 'game-controller-outline' },
];

const featuredPosts = [
  {
    id: 'post-1',
    author: {
      name: 'Sarah Chen',
      username: 'cocktail_sarah',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b359?auto=format&fit=crop&w=400&q=60',
      isVerified: true,
    },
    content: 'Just perfected my take on the classic Aviation cocktail! The key is using crème de violette sparingly - it should complement, not overpower. What\'s your favorite gin-based cocktail? 🍸✨',
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=600&q=60',
    likes: 147,
    comments: 23,
    timestamp: '2 hours ago',
    type: 'recipe',
    topComments: [
      { user: '@gin_master', text: 'Love this! Have you tried adding a dash of orange bitters?' },
      { user: '@mixology_mike', text: 'Beautiful presentation 🔥' }
    ]
  },
  {
    id: 'post-2',
    author: {
      name: 'Marcus Thompson',
      username: 'spirit_seeker',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=60',
      isVerified: false,
    },
    content: 'Amazing whiskey tasting at The Vault tonight! Tried a 25-year Macallan that absolutely blew my mind. The complexity was incredible - notes of honey, dried fruits, and oak. Worth every penny! 🥃',
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=600&q=60',
    likes: 89,
    comments: 15,
    timestamp: '4 hours ago',
    type: 'review',
    topComments: [
      { user: '@whiskey_wizard', text: 'That sounds incredible! What was the price point?' },
      { user: '@vault_regular', text: 'The Vault has the best selection in the city 👌' }
    ]
  },
  {
    id: 'post-3',
    author: {
      name: 'Emma Rodriguez',
      username: 'tequila_queen',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=60',
      isVerified: true,
    },
    content: '🎉 Just won the Mixology Masters Challenge! My signature "Smoky Sunset" took first place. The secret? Mezcal, blood orange, chipotle honey, and a touch of lime. Recipe in comments! 🏆',
    image: 'https://images.unsplash.com/photo-1536533776747-1b4f1b2c7e3e?auto=format&fit=crop&w=600&q=60',
    likes: 234,
    comments: 45,
    timestamp: '6 hours ago',
    type: 'achievement',
    topComments: [
      { user: '@bartender_bob', text: 'Congratulations! That sounds amazing' },
      { user: '@contest_judge', text: 'Well deserved win! 🔥' }
    ]
  },
  {
    id: 'post-4',
    author: {
      name: 'James Wilson',
      username: 'craft_cocktail_jim',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=60',
      isVerified: false,
    },
    content: 'New bar alert! 🚨 Just discovered "The Hidden Garden" - an intimate speakeasy with house-made everything. Their clarified milk punch is otherworldly. Who wants to check it out this weekend?',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=60',
    likes: 67,
    comments: 18,
    timestamp: '1 day ago',
    type: 'discovery',
    topComments: [
      { user: '@weekend_warrior', text: 'I\'m in! Saturday works for me' },
      { user: '@hidden_gem_hunter', text: 'Adding to my list! Thanks for the rec' }
    ]
  },
  {
    id: 'post-5',
    author: {
      name: 'Olivia Park',
      username: 'sake_specialist',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=60',
      isVerified: true,
    },
    content: 'Hosting a sake tasting tomorrow at 7pm! We\'ll explore 6 different styles from junmai to daiginjo. Limited to 12 people. Comment below if you want in! 🍶✨ #SakeTasting #CommunityEvent',
    likes: 92,
    comments: 28,
    timestamp: '1 day ago',
    type: 'event',
    topComments: [
      { user: '@sake_newbie', text: 'Count me in! Perfect timing to learn' },
      { user: '@izakaya_lover', text: 'Will you pair with small plates?' }
    ]
  }
];

const leaderboardData = [
  { id: '1', name: 'Alex Johnson', username: 'mixmaster_alex', xp: 15420, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=60', rank: 1, badge: '👑', streak: 47 },
  { id: '2', name: 'Sarah Chen', username: 'cocktail_sarah', xp: 14850, avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b359?auto=format&fit=crop&w=400&q=60', rank: 2, badge: '🥈', streak: 32 },
  { id: '3', name: 'Marcus Thompson', username: 'spirit_seeker', xp: 13920, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=60', rank: 3, badge: '🥉', streak: 28 },
  { id: '4', name: 'Emma Rodriguez', username: 'tequila_queen', xp: 13205, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=60', rank: 4, badge: '⭐', streak: 19 },
  { id: '5', name: 'James Wilson', username: 'craft_cocktail_jim', xp: 12480, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=60', rank: 5, badge: '🔥', streak: 15 },
  { id: '6', name: 'Olivia Park', username: 'sake_specialist', xp: 11890, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=60', rank: 6, badge: '🍶', streak: 22 },
  { id: '7', name: 'David Kim', username: 'whiskey_wanderer', xp: 11205, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=60', rank: 7, badge: '🥃', streak: 8 },
  { id: '8', name: 'Isabella Martinez', username: 'gin_genius', xp: 10750, avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=60', rank: 8, badge: '🌿', streak: 12 },
];

const activeChallenges = [
  {
    id: 'challenge-1',
    title: 'Master of Classics',
    description: 'Perfect 10 classic cocktails this month',
    progress: 7,
    total: 10,
    reward: '500 XP + Classic Master Badge',
    timeLeft: '12 days',
    participants: 1247,
    difficulty: 'Medium'
  },
  {
    id: 'challenge-2', 
    title: 'Around the World',
    description: 'Try spirits from 5 different countries',
    progress: 3,
    total: 5,
    reward: '750 XP + Globe Trotter Badge',
    timeLeft: '18 days',
    participants: 892,
    difficulty: 'Hard'
  },
  {
    id: 'challenge-3',
    title: 'Social Butterfly',
    description: 'Share 3 cocktail photos and get 50+ likes each',
    progress: 1,
    total: 3,
    reward: '300 XP + Influencer Badge',
    timeLeft: '25 days',
    participants: 2156,
    difficulty: 'Easy'
  }
];

// Games data matching the main GamesScreen
const hero = {
  title: "King's Cup",
  desc: 'A classic card game where players draw cards and perform actions based on the card drawn.',
  img: 'https://images.unsplash.com/photo-1604908554007-6f7f2b3f4d5d?q=80&w=1200&auto=format&fit=crop',
};

const classicGames = [
  { id: 'kings-cup', title: "King's Cup", subtitle: 'Easy · 4–10+ Players · USA',
    img: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?auto=format&fit=crop&w=880&q=60' },
  { id: 'flip-cup', title: 'Flip Cup', subtitle: 'Easy · 2–4 Players · USA',
    img: 'https://images.unsplash.com/photo-1527169402691-feff5539e52c?q=80&w=1000&auto=format&fit=crop' },
  { id: 'beer-pong', title: 'Beer Pong', subtitle: 'Medium · 2–4 Players · USA',
    img: 'https://images.unsplash.com/photo-1589554828260-7f34e0a75bb8?q=80&w=1000&auto=format&fit=crop' },
];

const culturalGames = [
  { id: 'soju-bomb', title: 'Soju Bomb', subtitle: 'Medium · 2+ Players · Korea',
    img: 'https://images.unsplash.com/photo-1621263764928-05f1f5dfb375?q=80&w=1000&auto=format&fit=crop' },
  { id: 'fuzzy-duck', title: 'Fuzzy Duck', subtitle: 'Hard · 2+ Players · UK',
    img: 'https://images.unsplash.com/photo-1563986768711-b3bde3dc821e?q=80&w=1000&auto=format&fit=crop' },
];

const appEnhanced = [
  { id: 'truth-or-dare', title: 'Truth or Dare', subtitle: '2–10 Players · Medium',
    img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop' },
  { id: 'most-likely-to', title: 'Most Likely To', subtitle: '2–10 Players · Easy',
    img: 'https://images.unsplash.com/photo-1612197527762-7d9bb1f57c4f?q=80&w=1000&auto=format&fit=crop' },
];

const partyGames = [
  { id: 'bartender-battle', title: 'Bartender Battle', subtitle: 'Hard · 2+ Players · Global',
    img: 'https://images.unsplash.com/photo-1543007630-9710e4a3e56a?q=80&w=1000&auto=format&fit=crop' },
  { id: 'dare-wheel', title: 'Dare Wheel', subtitle: 'Easy · 2+ Players · Global',
    img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000&auto=format&fit=crop' },
];

const featuredGroups = [
  {
    id: 'group-1',
    name: 'Mixology Masters',
    description: 'Advanced cocktail techniques and rare spirit discussions',
    memberCount: 15420,
    category: 'cocktails',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=60',
    isPrivate: false,
    activeMembers: 2847,
    recentActivity: '12 new posts today'
  },
  {
    id: 'group-2', 
    name: 'Whiskey Enthusiasts',
    description: 'From bourbon to scotch, exploring the world of whiskey',
    memberCount: 8932,
    category: 'spirits',
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=400&q=60',
    isPrivate: false,
    activeMembers: 1653,
    recentActivity: '8 new reviews today'
  },
  {
    id: 'group-3',
    name: 'Home Bartenders Unite',
    description: 'Tips, tricks, and equipment reviews for the home bar',
    memberCount: 12105,
    category: 'community',
    image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=400&q=60',
    isPrivate: false,
    activeMembers: 2234,
    recentActivity: '15 equipment discussions'
  },
  {
    id: 'group-4',
    name: 'Craft Cocktail Photographers',
    description: 'Beautiful cocktail photography and styling tips',
    memberCount: 6789,
    category: 'photography',
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=400&q=60',
    isPrivate: false,
    activeMembers: 1123,
    recentActivity: '23 photos shared today'
  },
  {
    id: 'group-5',
    name: 'Low-ABV & Mocktails',
    description: 'Delicious drinks for mindful consumption',
    memberCount: 4567,
    category: 'wellness',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=400&q=60',
    isPrivate: false,
    activeMembers: 892,
    recentActivity: '7 new recipes today'
  },
  {
    id: 'group-6',
    name: 'NYC Bar Crawlers',
    description: 'Exploring the best bars and speakeasies in New York City',
    memberCount: 3421,
    category: 'local',
    image: 'https://images.unsplash.com/photo-1543007630-9710e4a3e56a?auto=format&fit=crop&w=400&q=60',
    isPrivate: false,
    activeMembers: 567,
    recentActivity: 'Weekend meetup planned'
  }
];

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState<'feed' | 'challenges' | 'groups' | 'games'>('feed');
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { socialData } = useSocialData();
  const { toggleSavedCocktail, isCocktailSaved, toggleFollowedCommunity, isCommunityFollowed } = useSavedItems();
  const { userPosts, addPost } = usePosts();

  // Modal states
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [createContentModalVisible, setCreateContentModalVisible] = useState(false);
  const [createRecipeModalVisible, setCreateRecipeModalVisible] = useState(false);
  const [createPostModalVisible, setCreatePostModalVisible] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<Partial<FilterOptions>>({});

  const handleSearch = (query: string) => {
    // Handle search - could navigate to search results screen or filter current content
    console.log('Search query:', query);
    setSearchModalVisible(false);
  };

  const handleFilterApply = (filters: Partial<FilterOptions>) => {
    setCurrentFilters(filters);
    setFilterDrawerVisible(false);
    console.log('Applied filters:', filters);
    // Apply filters to community content
  };

  const handleRecipeCreated = (recipeId: string) => {
    console.log('Recipe created:', recipeId);
    setCreateRecipeModalVisible(false);
    // Could refresh community feed or navigate to recipe
  };

  const handlePostCreated = (postData: any) => {
    console.log('Post created:', postData);

    // Add the post to the posts context
    addPost({
      content: postData.content,
      image: postData.image,
      type: postData.type,
      author: {
        name: socialData.currentUser.name,
        username: socialData.currentUser.username,
        avatar: socialData.currentUser.avatar,
        isVerified: false,
      },
    });

    setCreatePostModalVisible(false);
  };

  const handleCompetitionEntryCreated = (entryId: string) => {
    console.log('Competition entry created:', entryId);
    // Could refresh challenges tab or navigate to entry
  };

  useLayoutEffect(() => {
    nav.setOptions({
      title: 'Community',
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { color: colors.text, fontWeight: '900' },
      headerShadowVisible: false,
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
          <Pressable hitSlop={12} onPress={() => setSearchModalVisible(true)}>
            <Ionicons name="search" size={24} color={colors.text} />
          </Pressable>
          <Pressable hitSlop={12} onPress={() => setFilterDrawerVisible(true)}>
            <Ionicons name="funnel" size={24} color={colors.text} />
          </Pressable>
          <Pressable hitSlop={12} onPress={() => setCreateContentModalVisible(true)}>
            <Ionicons name="add-circle" size={24} color={colors.accent} />
          </Pressable>
          <Pressable hitSlop={10} onPress={() => nav.navigate('Profile')}>
            <Image 
              source={{ uri: socialData.currentUser.avatar }} 
              style={{ width: 32, height: 32, borderRadius: 16 }}
            />
          </Pressable>
        </View>
      ),
    });
  }, [nav, socialData.currentUser.avatar]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'feed':
        // Combine user posts with featured posts, user posts first
        const allPosts = [...userPosts, ...featuredPosts];

        return (
          <View>
            <Text style={styles.sectionTitle}>Feed</Text>
            {allPosts.map(post => (
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
                  <Pressable style={styles.postMenu}>
                    <Ionicons name="ellipsis-horizontal" size={20} color={colors.subtext} />
                  </Pressable>
                </View>
                
                <Text style={styles.postContent}>{post.content}</Text>
                {post.image && <Image source={{ uri: post.image }} style={styles.postImage} />}
                
                <View style={styles.postActions}>
                  <Pressable style={styles.actionButton}>
                    <Ionicons name="heart-outline" size={20} color={colors.subtext} />
                    <Text style={styles.actionText}>{post.likes}</Text>
                  </Pressable>
                  <Pressable style={styles.actionButton}>
                    <Ionicons name="chatbubble-outline" size={20} color={colors.subtext} />
                    <Text style={styles.actionText}>{post.comments}</Text>
                  </Pressable>
                  <Pressable style={styles.actionButton}>
                    <Ionicons name="arrow-redo-outline" size={20} color={colors.subtext} />
                  </Pressable>
                  <Pressable 
                    style={styles.actionButton}
                    onPress={() => {
                      const postItem = {
                        id: post.id,
                        name: post.content.slice(0, 50) + (post.content.length > 50 ? '...' : ''),
                        subtitle: `By ${post.author.name}`,
                        image: post.image
                      };
                      toggleSavedCocktail(postItem);
                    }}
                  >
                    <Ionicons 
                      name={isCocktailSaved(post.id) ? "bookmark" : "bookmark-outline"} 
                      size={20} 
                      color={isCocktailSaved(post.id) ? colors.accent : colors.subtext} 
                    />
                  </Pressable>
                </View>

                {post.topComments && (
                  <View style={styles.topComments}>
                    {post.topComments.map((comment, index) => (
                      <View key={index} style={styles.comment}>
                        <Text style={styles.commentUser}>{comment.user}</Text>
                        <Text style={styles.commentText}>{comment.text}</Text>
                      </View>
                    ))}
                    <Pressable><Text style={styles.viewMoreComments}>View all {post.comments} comments</Text></Pressable>
                  </View>
                )}
              </View>
            ))}
          </View>
        );
      case 'challenges':
        return (
          <View>
            <Text style={styles.sectionTitle}>Active Challenges</Text>
            {activeChallenges.map(challenge => (
              <View key={challenge.id} style={styles.challengeCard}>
                <View style={styles.challengeHeader}>
                  <Text style={styles.challengeTitle}>{challenge.title}</Text>
                  <View style={[styles.difficultyBadge, 
                    challenge.difficulty === 'Easy' && styles.easyBadge,
                    challenge.difficulty === 'Medium' && styles.mediumBadge,
                    challenge.difficulty === 'Hard' && styles.hardBadge
                  ]}>
                    <Text style={styles.difficultyText}>{challenge.difficulty}</Text>
                  </View>
                </View>
                <Text style={styles.challengeDescription}>{challenge.description}</Text>
                
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${(challenge.progress / challenge.total) * 100}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{challenge.progress}/{challenge.total}</Text>
                </View>
                
                <View style={styles.challengeDetails}>
                  <Text style={styles.challengeReward}>🏆 {challenge.reward}</Text>
                  <Text style={styles.challengeTime}>⏰ {challenge.timeLeft} left</Text>
                  <Text style={styles.challengeParticipants}>👥 {challenge.participants.toLocaleString()} participating</Text>
                </View>
                
                <Pressable style={styles.joinChallengeButton}>
                  <Text style={styles.joinChallengeText}>Continue Challenge</Text>
                </Pressable>
              </View>
            ))}

            <Text style={[styles.sectionTitle, { marginTop: spacing(4) }]}>Leaderboard</Text>
            {leaderboardData.map(item => (
              <View key={item.id} style={styles.leaderboardItem}>
                <Text style={styles.rankNumber}>#{item.rank}</Text>
                <Image source={{ uri: item.avatar }} style={styles.leaderboardAvatar} />
                <View style={styles.leaderboardInfo}>
                  <View style={styles.leaderboardNameRow}>
                    <Text style={styles.leaderboardName}>{item.name}</Text>
                    <Text style={styles.badgeEmoji}>{item.badge}</Text>
                  </View>
                  <Text style={styles.leaderboardUsername}>@{item.username} • {item.streak} day streak</Text>
                </View>
                <Text style={styles.xpAmount}>{item.xp.toLocaleString()} XP</Text>
              </View>
            ))}
          </View>
        );
      case 'groups':
        return (
          <View>
            <Text style={styles.sectionTitle}>Discover Communities</Text>
            {featuredGroups.map(group => (
              <View key={group.id} style={styles.groupCard}>
                <Image source={{ uri: group.image }} style={styles.groupImage} />
                <View style={styles.groupInfo}>
                  <View style={styles.groupHeader}>
                    <Text style={styles.groupName}>{group.name}</Text>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{group.category}</Text>
                    </View>
                  </View>
                  <Text style={styles.groupDescription}>{group.description}</Text>
                  <View style={styles.groupStats}>
                    <Text style={styles.groupMembers}>👥 {group.memberCount.toLocaleString()} members</Text>
                    <Text style={styles.groupActive}>🟢 {group.activeMembers.toLocaleString()} active</Text>
                  </View>
                  <Text style={styles.groupActivity}>{group.recentActivity}</Text>
                  <Pressable 
                    style={[
                      styles.joinGroupButton,
                      isCommunityFollowed(group.id) && { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.accent }
                    ]}
                    onPress={() => {
                      const communityItem = {
                        id: group.id,
                        name: group.name,
                        subtitle: group.description,
                        image: group.image
                      };
                      toggleFollowedCommunity(communityItem);
                    }}
                  >
                    <Text style={[
                      styles.joinGroupText,
                      isCommunityFollowed(group.id) && { color: colors.accent }
                    ]}>
                      {isCommunityFollowed(group.id) ? 'Joined' : 'Join Community'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        );
      case 'games':
        return (
          <ScrollView style={styles.gamesContent} showsVerticalScrollIndicator={false}>
            {/* Hero Section */}
            <TouchableOpacity 
              style={styles.heroSection}
              onPress={() => nav.navigate('KingsCup')}
              activeOpacity={0.95}
            >
              <Image source={{ uri: hero.img }} style={styles.heroImage} />
              <View style={styles.heroOverlay} />
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>{hero.title}</Text>
                <Text style={styles.heroDesc}>{hero.desc}</Text>
                <View style={styles.heroTags}>
                  <View style={styles.heroTag}>
                    <Text style={styles.heroTagText}>Classic Games</Text>
                  </View>
                  <View style={styles.heroTag}>
                    <Text style={styles.heroTagText}>Cultural / International</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            {/* Classic Games */}
            <View style={styles.gamesSectionHeader}>
              <Text style={styles.gamesSectionTitle}>Classic Games</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gamesRow}>
              {classicGames.map(game => (
                <TouchableOpacity 
                  key={game.id} 
                  style={styles.gamesCard}
                  onPress={() => {
                    if (game.id === 'kings-cup') {
                      nav.navigate('KingsCup');
                    } else {
                      nav.navigate('GameDetails', { id: game.id });
                    }
                  }}
                  activeOpacity={0.9}
                >
                  <View style={styles.gamesCardImageContainer}>
                    <Image source={{ uri: game.img }} style={styles.gamesCardImage} />
                  </View>
                  <Text style={styles.gamesCardTitle}>{game.title}</Text>
                  <Text style={styles.gamesCardSubtitle}>{game.subtitle}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Cultural Games */}
            <View style={styles.gamesSectionHeader}>
              <Text style={styles.gamesSectionTitle}>Cultural Games</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gamesRow}>
              {culturalGames.map(game => (
                <TouchableOpacity 
                  key={game.id} 
                  style={styles.gamesCard}
                  onPress={() => nav.navigate('GameDetails', { id: game.id })}
                  activeOpacity={0.9}
                >
                  <View style={styles.gamesCardImageContainer}>
                    <Image source={{ uri: game.img }} style={styles.gamesCardImage} />
                  </View>
                  <Text style={styles.gamesCardTitle}>{game.title}</Text>
                  <Text style={styles.gamesCardSubtitle}>{game.subtitle}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Card-Based Games */}
            <View style={styles.gamesSectionHeader}>
              <Text style={styles.gamesSectionTitle}>Card-Based Games</Text>
            </View>
            <TouchableOpacity 
              style={styles.posterCard}
              onPress={() => nav.navigate('GameDetails', { id: 'cards-category' })}
              activeOpacity={0.9}
            >
              <ImageBackground 
                source={{ uri: 'https://images.unsplash.com/photo-1543007630-9710e4a3e56a?q=80&w=1200&auto=format&fit=crop' }} 
                style={styles.posterImage}
                imageStyle={{ borderRadius: 20 }}
              >
                <View style={styles.posterTint} />
                <View style={styles.posterPlay}>
                  <MaterialCommunityIcons name="cards" size={32} color={colors.white} />
                  <Text style={styles.posterText}>Explore</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>

            {/* App-Enhanced */}
            <View style={styles.gamesSectionHeader}>
              <Text style={styles.gamesSectionTitle}>App-Enhanced</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gamesRow}>
              {appEnhanced.map(game => (
                <TouchableOpacity 
                  key={game.id} 
                  style={styles.gamesCard}
                  onPress={() => nav.navigate('GameDetails', { id: game.id })}
                  activeOpacity={0.9}
                >
                  <View style={styles.gamesCardImageContainer}>
                    <Image source={{ uri: game.img }} style={styles.gamesCardImage} />
                  </View>
                  <Text style={styles.gamesCardTitle}>{game.title}</Text>
                  <Text style={styles.gamesCardSubtitle}>{game.subtitle}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Party Games */}
            <View style={styles.gamesSectionHeader}>
              <Text style={styles.gamesSectionTitle}>Party Games</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gamesRow}>
              {partyGames.map(game => (
                <TouchableOpacity 
                  key={game.id} 
                  style={styles.gamesCard}
                  onPress={() => nav.navigate('GameDetails', { id: game.id })}
                  activeOpacity={0.9}
                >
                  <View style={styles.gamesCardImageContainer}>
                    <Image source={{ uri: game.img }} style={styles.gamesCardImage} />
                  </View>
                  <Text style={styles.gamesCardTitle}>{game.title}</Text>
                  <Text style={styles.gamesCardSubtitle}>{game.subtitle}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </ScrollView>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScrollContent}>
          {communityTabs.map(tab => (
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
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
      </ScrollView>

      {/* Header Action Modals */}
      <SearchModal
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
      />

      <FilterDrawer
        visible={filterDrawerVisible}
        onClose={() => setFilterDrawerVisible(false)}
        onApply={handleFilterApply}
        currentFilters={currentFilters}
      />

      <CreateContentModal
        visible={createContentModalVisible}
        onClose={() => setCreateContentModalVisible(false)}
        onCreatePost={() => setCreatePostModalVisible(true)}
        onCreateRecipe={() => setCreateRecipeModalVisible(true)}
      />

      <CreatePostModal
        visible={createPostModalVisible}
        onClose={() => setCreatePostModalVisible(false)}
        onSuccess={handlePostCreated}
      />

      <CreateRecipeModal
        visible={createRecipeModalVisible}
        onClose={() => setCreateRecipeModalVisible(false)}
        onSuccess={handleRecipeCreated}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  tabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  tabScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    gap: 6,
  },
  activeTab: {
    backgroundColor: colors.accent + '20',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.subtext,
  },
  activeTabText: {
    color: colors.accent,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
  },
  postCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.line,
  },
  postMenu: {
    padding: 4,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  actionText: {
    fontSize: 14,
    color: colors.subtext,
    fontWeight: '600',
  },
  topComments: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  comment: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  commentText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  viewMoreComments: {
    fontSize: 14,
    color: colors.subtext,
    marginTop: 4,
  },
  challengeCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.line,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  easyBadge: {
    backgroundColor: '#4CAF50',
  },
  mediumBadge: {
    backgroundColor: '#FF9800',
  },
  hardBadge: {
    backgroundColor: '#F44336',
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  challengeDescription: {
    fontSize: 14,
    color: colors.subtext,
    marginBottom: 12,
    lineHeight: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.line,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    minWidth: 40,
  },
  challengeDetails: {
    marginBottom: 12,
  },
  challengeReward: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  challengeTime: {
    fontSize: 14,
    color: colors.subtext,
    marginBottom: 4,
  },
  challengeParticipants: {
    fontSize: 14,
    color: colors.subtext,
  },
  joinChallengeButton: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  joinChallengeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  leaderboardNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeEmoji: {
    fontSize: 16,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: colors.accent + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
    textTransform: 'capitalize',
  },
  groupStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  groupMembers: {
    fontSize: 14,
    color: colors.subtext,
  },
  groupActive: {
    fontSize: 14,
    color: colors.subtext,
  },
  groupActivity: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  joinGroupButton: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  joinGroupText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postAuthorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  authorUsername: {
    fontSize: 14,
    color: colors.subtext,
  },
  postContent: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.line,
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.accent,
    marginRight: 16,
    minWidth: 24,
  },
  leaderboardAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  leaderboardUsername: {
    fontSize: 14,
    color: colors.subtext,
  },
  xpAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.accent,
  },
  groupCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.line,
  },
  groupImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  groupInfo: {
    gap: 4,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  groupDescription: {
    fontSize: 14,
    color: colors.subtext,
    lineHeight: 20,
  },
  groupMemberCount: {
    fontSize: 12,
    color: colors.subtext,
  },
  gameCard: {
    width: 220,
    marginRight: 16,
  },
  gameImage: {
    width: 220,
    height: 140,
    borderRadius: 12,
    marginBottom: 8,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  gameDifficulty: {
    fontSize: 14,
    color: colors.subtext,
  },

  // Games tab styles matching GamesScreen - Enhanced
  heroSection: {
    margin: 20,
    backgroundColor: colors.card,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  heroImage: {
    height: 200,
    width: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  heroContent: {
    padding: 20,
  },
  heroTitle: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  heroDesc: {
    color: colors.subtext,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
    opacity: 0.9,
  },
  heroTags: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  heroTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent + '20',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.accent + '40',
  },
  heroTagText: {
    color: colors.accent,
    fontWeight: '700',
    letterSpacing: 0.3,
    fontSize: 13,
  },
  gamesContent: {
    paddingBottom: 40,
    paddingTop: 8,
  },
  gamesSectionHeader: {
    marginTop: 32,
    marginBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gamesSectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  randomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 18,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    gap: 8,
  },
  randomButtonText: {
    color: colors.white,
    fontWeight: '700',
    letterSpacing: 0.3,
    fontSize: 14,
  },
  gamesRow: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  gamesCard: {
    width: 200,
    marginRight: 16,
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  gamesCardImageContainer: {
    position: 'relative',
  },
  gamesCardImage: {
    height: 150,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 12,
  },
  gamesCardSaveButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gamesCardTitle: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 17,
    paddingHorizontal: 16,
    letterSpacing: -0.2,
  },
  gamesCardSubtitle: {
    color: colors.subtext,
    fontSize: 13,
    paddingHorizontal: 16,
    marginTop: 4,
    opacity: 0.8,
  },
  posterCard: {
    marginHorizontal: 20,
    marginBottom: 32,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  posterImage: {
    height: 240,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  posterTint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  posterPlay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 20,
  },
  posterText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 18,
    letterSpacing: -0.3,
  },
});