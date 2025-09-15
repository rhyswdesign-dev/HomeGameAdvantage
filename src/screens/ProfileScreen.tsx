import React, { useState, useLayoutEffect } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Alert, 
  Image, TouchableOpacity, TextInput, Modal, FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../theme/tokens';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useSavedItems } from '../hooks/useSavedItems';
import { useUser } from '../contexts/UserContext';

interface UserProfile {
  name: string;
  handle: string;
  bio: string;
  avatar?: string;
  email: string;
  joinDate: string;
  social: {
    followers: number;
    following: number;
  };
  stats: {
    xp: number;
    favoriteBars: number;
    favoriteSpirits: number;
    savedEvents: number;
    communitiesJoined: number;
  };
  badges: Array<{
    id: string;
    name: string;
    description: string;
    fullDescription: string;
    icon: string;
    earned: boolean;
    category: 'lessons' | 'challenges' | 'recipes' | 'community';
  }>;
  competitions: Array<{
    id: string;
    name: string;
    description: string;
    sponsor: string;
    place: number;
    date: string;
    icon: string;
    prize: string;
  }>;
}

const mockProfile: UserProfile = {
  name: "Isaac Mckenzie",
  handle: "@isaac.mck",
  bio: "Whiskey enthusiast exploring the world of premium spirits. Love discovering hidden speakeasies and craft cocktails.",
  email: "isaac.mckenzie@example.com",
  joinDate: "March 2024",
  social: {
    followers: 0,
    following: 0,
  },
  stats: {
    xp: 2450,
    favoriteBars: 8,
    favoriteSpirits: 15,
    savedEvents: 4,
    communitiesJoined: 3,
  },
  badges: [
    {
      id: "1",
      name: "Spirit Master",
      description: "Completed 10 spirit lessons",
      fullDescription: "You've successfully completed 10 comprehensive spirit education lessons, mastering the fundamentals of whiskey, gin, vodka, rum, and tequila.",
      icon: "trophy",
      earned: true,
      category: "lessons"
    },
    {
      id: "2", 
      name: "Challenge Champion",
      description: "Won 5 bartending challenges",
      fullDescription: "Emerged victorious in 5 competitive bartending challenges, demonstrating exceptional skill and technique under pressure.",
      icon: "medal",
      earned: true,
      category: "challenges"
    },
    {
      id: "3",
      name: "Cocktail Expert",
      description: "Mastered 25 cocktail recipes",
      fullDescription: "Successfully mastered and perfected 25 classic and modern cocktail recipes, showcasing your mixology expertise.",
      icon: "glass-cocktail",
      earned: true,
      category: "recipes"
    },
    {
      id: "4",
      name: "Community Favorite",
      description: "Recipe featured and voted by community",
      fullDescription: "Your original cocktail recipe was featured on the platform and received over 100 votes from the community.",
      icon: "heart",
      earned: true,
      category: "community"
    },
    {
      id: "5",
      name: "Master Mixologist",
      description: "Completed advanced mixology course",
      fullDescription: "Completed the comprehensive Master Mixology certification course with distinction.",
      icon: "school",
      earned: true,
      category: "lessons"
    },
    {
      id: "6",
      name: "Speed Demon",
      description: "Won speed bartending challenge",
      fullDescription: "Set a new record in the speed bartending challenge, serving 5 perfect cocktails in under 3 minutes.",
      icon: "speedometer",
      earned: true,
      category: "challenges"
    },
    {
      id: "7",
      name: "Garnish Guru",
      description: "Mastered garnish techniques",
      fullDescription: "Demonstrated mastery of 15 different garnish techniques, from basic twists to complex fruit sculptures.",
      icon: "leaf",
      earned: false,
      category: "lessons"
    },
    {
      id: "8",
      name: "Community Leader",
      description: "Top contributor in 3 communities",
      fullDescription: "Recognized as a top contributor in 3 different bartending communities, sharing knowledge and helping others.",
      icon: "star",
      earned: false,
      category: "community"
    },
  ],
  competitions: [
    {
      id: "1",
      name: "Spring Mixology Championship",
      description: "A comprehensive bartending competition testing speed, creativity, and technique across multiple rounds.",
      sponsor: "Jameson Whiskey",
      place: 1,
      date: "March 2024",
      icon: "trophy",
      prize: "$5,000 + Jameson Ambassador Program",
    },
    {
      id: "2", 
      name: "Whiskey Tasting Challenge",
      description: "Blind tasting competition identifying 20 different whiskeys from around the world.",
      sponsor: "The Macallan",
      place: 2,
      date: "February 2024",
      icon: "medal",
      prize: "$2,000 + Whiskey Collection",
    },
    {
      id: "3",
      name: "Cocktail Creation Contest",
      description: "Original cocktail recipe competition judged by industry professionals and community votes.",
      sponsor: "Hendrick's Gin",
      place: 2,
      date: "January 2024", 
      icon: "medal",
      prize: "$2,500 + Featured Recipe",
    },
    {
      id: "4",
      name: "MixedMindsStudios Garnish Competition",
      description: "Creative garnish competition showcasing innovative presentation techniques and artistic flair.",
      sponsor: "MixedMindsStudios",
      place: 1,
      date: "July 2024",
      icon: "trophy",
      prize: "$3,000 + Garnish Kit + Feature",
    },
  ],
};

interface TabOption {
  key: 'posts' | 'recipes' | 'achievements' | 'about';
  label: string;
  icon: string;
}

const tabs: TabOption[] = [
  { key: 'posts', label: 'Posts', icon: 'grid-outline' },
  { key: 'recipes', label: 'Recipes', icon: 'restaurant-outline' },
  { key: 'achievements', label: 'Awards', icon: 'trophy-outline' },
  { key: 'about', label: 'About', icon: 'information-circle-outline' },
];

export default function ProfileScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const { savedItems } = useSavedItems();
  const { user } = useUser();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'recipes' | 'achievements' | 'about'>('posts');

  useLayoutEffect(() => {
    nav.setOptions({
      title: 'Profile',
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { color: colors.text, fontWeight: '900' },
      headerShadowVisible: false,
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={styles.xpBalance}>
            <MaterialCommunityIcons name="star" size={18} color={colors.gold} />
            <Text style={styles.xpBalanceText}>{user.xp} XP</Text>
          </View>
          <TouchableOpacity 
            onPress={() => nav.navigate('Settings' as any)}
            style={styles.headerButton}
            activeOpacity={0.7}
          >
            <Ionicons name="settings-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [nav]);

  const currentProfile = profile;

  const handleEditProfile = () => {
    nav.navigate('EditProfile');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.emptyStateText}>Posts coming soon</Text>
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
          <View style={styles.tabContentScroll}>
            {/* Badges Section */}
            <View style={styles.achievementsSection}>
              <Text style={styles.achievementsSectionTitle}>Badges</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.badgesScroll}
              >
                {currentProfile.badges.filter(badge => badge.earned).map((badge) => (
                  <TouchableOpacity 
                    key={badge.id} 
                    style={styles.badgeCard}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons 
                      name={badge.icon as any} 
                      size={32} 
                      color={colors.accent} 
                    />
                    <Text style={styles.badgeName}>{badge.name}</Text>
                    <Text style={styles.badgeDescription}>{badge.fullDescription}</Text>
                    <View style={styles.badgeCategory}>
                      <Text style={styles.badgeCategoryText}>{badge.category.toUpperCase()}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Competitions */}
            <View style={styles.achievementsSection}>
              <Text style={styles.achievementsSectionTitle}>Competitions</Text>
              <View style={styles.competitionsContainer}>
                {currentProfile.competitions.map((competition) => (
                  <TouchableOpacity key={competition.id} style={styles.competitionCard} activeOpacity={0.8}>
                    <View style={styles.competitionHeader}>
                      <View style={styles.competitionLeft}>
                        <MaterialCommunityIcons 
                          name={competition.icon as any} 
                          size={28} 
                          color={competition.place === 1 ? '#FFD700' : competition.place === 2 ? '#C0C0C0' : '#CD7F32'} 
                        />
                        <View style={styles.competitionInfo}>
                          <Text style={styles.competitionName}>{competition.name}</Text>
                          <Text style={styles.competitionSponsor}>Sponsored by {competition.sponsor}</Text>
                          <Text style={styles.competitionDate}>{competition.date}</Text>
                        </View>
                      </View>
                      <View style={[
                        styles.competitionPlace,
                        competition.place === 1 && styles.competitionPlaceGold,
                        competition.place === 2 && styles.competitionPlaceSilver,
                        competition.place === 3 && styles.competitionPlaceBronze,
                      ]}>
                        <Text style={[
                          styles.competitionPlaceText,
                          competition.place <= 3 && styles.competitionPlaceTextMedal
                        ]}>
                          {competition.place === 1 ? '1ST' : competition.place === 2 ? '2ND' : '3RD'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.competitionDescription}>{competition.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );
      case 'about':
        return (
          <View style={styles.tabContentScroll}>
            {/* Bio */}
            <View style={styles.aboutSection}>
              <Text style={styles.aboutLabel}>Bio</Text>
              <Text style={styles.bioText}>
                {currentProfile.bio || 'No bio added yet.'}
              </Text>
            </View>

            {/* Basic Info */}
            <View style={styles.aboutSection}>
              <Text style={styles.aboutLabel}>Account Information</Text>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Ionicons name="mail-outline" size={18} color={colors.subtext} />
                  <Text style={styles.infoText}>{currentProfile.email}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="calendar-outline" size={18} color={colors.subtext} />
                  <Text style={styles.infoText}>Joined {currentProfile.joinDate}</Text>
                </View>
              </View>
            </View>

            {/* Activity Stats */}
            <View style={styles.aboutSection}>
              <Text style={styles.aboutLabel}>Your Activity</Text>
              <View style={styles.achievementsGrid}>
                <TouchableOpacity style={styles.achievementCard} activeOpacity={0.7}
                  onPress={() => nav.navigate('SavedItems', { category: 'bars' })}>
                  <MaterialCommunityIcons name="heart" size={32} color={colors.accent} />
                  <Text style={styles.achievementValue}>{savedItems.savedBars.length}</Text>
                  <Text style={styles.achievementLabel}>Favorite Bars</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.achievementCard} activeOpacity={0.7}
                  onPress={() => nav.navigate('SavedItems', { category: 'spirits' })}>
                  <MaterialCommunityIcons name="glass-cocktail" size={32} color={colors.accent} />
                  <Text style={styles.achievementValue}>{savedItems.savedSpirits.length}</Text>
                  <Text style={styles.achievementLabel}>Favorite Spirits</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.achievementCard} activeOpacity={0.7}
                  onPress={() => nav.navigate('SavedItems', { category: 'events' })}>
                  <MaterialCommunityIcons name="bookmark" size={32} color={colors.accent} />
                  <Text style={styles.achievementValue}>{savedItems.savedEvents.length}</Text>
                  <Text style={styles.achievementLabel}>Saved Events</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.achievementCard} activeOpacity={0.7}
                  onPress={() => nav.navigate('SavedItems', { category: 'communities' })}>
                  <MaterialCommunityIcons name="account-group" size={32} color={colors.accent} />
                  <Text style={styles.achievementValue}>{savedItems.followedCommunities.length}</Text>
                  <Text style={styles.achievementLabel}>Communities</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.achievementCard} activeOpacity={0.7}
                  onPress={() => nav.navigate('SavedItems', { category: 'cocktails' })}>
                  <MaterialCommunityIcons name="glass-mug-variant" size={32} color={colors.accent} />
                  <Text style={styles.achievementValue}>{savedItems.savedCocktails.length}</Text>
                  <Text style={styles.achievementLabel}>Saved Cocktails</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            {currentProfile.avatar ? (
              <Image source={{ uri: currentProfile.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color={colors.subtext} />
              </View>
            )}
          </View>

          {/* Profile Info */}
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{currentProfile.name}</Text>
            <Text style={styles.handle}>{currentProfile.handle}</Text>

            {/* Social Stats */}
            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialItem} activeOpacity={0.7}>
                <Text style={styles.socialText}>Following {currentProfile.social.following}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialItem} activeOpacity={0.7}>
                <Text style={styles.socialText}>Followers {currentProfile.social.followers}</Text>
              </TouchableOpacity>
            </View>

            {/* Edit Profile Button */}
            <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
              <Text style={styles.editProfileButtonText}>Edit Profile</Text>
            </TouchableOpacity>
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
      
      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setEditModalVisible(false)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity 
              onPress={handleEditProfile}
              style={styles.modalButton}
            >
              <Text style={[styles.modalButtonText, { color: colors.accent }]}>Edit</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalSectionTitle}>Profile Settings</Text>
            <Text style={styles.modalSectionSubtitle}>Edit your profile information, reorder badges, and more</Text>
            
            <View style={styles.editOption}>
              <Ionicons name="person-outline" size={24} color={colors.accent} />
              <View style={styles.editOptionContent}>
                <Text style={styles.editOptionTitle}>Basic Information</Text>
                <Text style={styles.editOptionDesc}>Update name, bio, and profile picture</Text>
              </View>
            </View>
            
            <View style={styles.editOption}>
              <Ionicons name="trophy-outline" size={24} color={colors.accent} />
              <View style={styles.editOptionContent}>
                <Text style={styles.editOptionTitle}>Badge Display Order</Text>
                <Text style={styles.editOptionDesc}>Reorder how badges appear on your profile</Text>
              </View>
            </View>
            
            <View style={styles.editOption}>
              <Ionicons name="settings-outline" size={24} color={colors.accent} />
              <View style={styles.editOptionContent}>
                <Text style={styles.editOptionTitle}>Privacy Settings</Text>
                <Text style={styles.editOptionDesc}>Control who can see your profile information</Text>
              </View>
            </View>
          </ScrollView>
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
  scrollContent: {
    paddingBottom: spacing(6),
  },
  headerButton: {
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
  },
  headerButtonText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '600',
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: spacing(3),
    paddingTop: spacing(3),
    paddingBottom: spacing(4),
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing(3),
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.card,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.line,
  },
  avatarEditOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.bg,
  },
  profileInfo: {
    alignItems: 'center',
    width: '100%',
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  handle: {
    fontSize: 16,
    color: colors.accent,
    fontWeight: '600',
    marginBottom: spacing(2),
  },
  nameInput: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
    marginBottom: spacing(1),
    textAlign: 'center',
    minWidth: 200,
  },
  handleInput: {
    fontSize: 16,
    color: colors.accent,
    fontWeight: '600',
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
    marginBottom: spacing(2),
    textAlign: 'center',
    minWidth: 150,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(3),
    borderWidth: 1,
    borderColor: colors.line,
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
    fontSize: 12,
    color: colors.subtext,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.line,
    marginHorizontal: spacing(3),
  },
  section: {
    paddingHorizontal: spacing(3),
    marginBottom: spacing(4),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(2),
  },
  bioText: {
    fontSize: 16,
    color: colors.subtext,
    lineHeight: 24,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(2.5),
    borderWidth: 1,
    borderColor: colors.line,
  },
  bioInput: {
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing(2.5),
    minHeight: 100,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(2.5),
    borderWidth: 1,
    borderColor: colors.line,
    gap: spacing(2),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(2),
  },
  infoText: {
    fontSize: 16,
    color: colors.subtext,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(2),
  },
  achievementCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(2.5),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.line,
  },
  achievementValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing(1),
  },
  achievementLabel: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: spacing(0.5),
    textAlign: 'center',
  },
  actionsSection: {
    paddingHorizontal: spacing(3),
    gap: spacing(1),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(2.5),
    borderWidth: 1,
    borderColor: colors.line,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: spacing(2),
  },
  signOutButton: {
    marginTop: spacing(2),
  },
  saveContainer: {
    paddingHorizontal: spacing(3),
    marginTop: spacing(4),
  },
  saveButton: {
    backgroundColor: colors.accent,
    borderRadius: radii.lg,
    paddingVertical: spacing(2.5),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.goldText,
  },
  socialContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(4),
    marginTop: spacing(1),
  },
  socialItem: {
    alignItems: 'center',
  },
  socialText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  badgesScroll: {
    gap: spacing(2),
    paddingHorizontal: spacing(2),
  },
  badgeCard: {
    width: 200,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(2.5),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.line,
    minHeight: 180,
  },
  badgeName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing(1),
    textAlign: 'center',
  },
  badgeDescription: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: spacing(1),
    textAlign: 'center',
    lineHeight: 16,
    flex: 1,
  },
  badgeCategory: {
    backgroundColor: colors.accent,
    borderRadius: radii.sm,
    paddingHorizontal: spacing(1),
    paddingVertical: spacing(0.5),
    marginTop: spacing(1),
  },
  badgeCategoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.white,
  },
  competitionsContainer: {
    gap: spacing(1),
  },
  competitionCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(2.5),
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: spacing(2),
  },
  competitionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing(2),
  },
  competitionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing(2),
  },
  competitionInfo: {
    flex: 1,
  },
  competitionName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  competitionSponsor: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
    marginBottom: spacing(0.5),
  },
  competitionDate: {
    fontSize: 12,
    color: colors.subtext,
  },
  competitionDescription: {
    fontSize: 14,
    color: colors.subtext,
    lineHeight: 20,
    marginBottom: spacing(2),
  },
  competitionPlace: {
    borderRadius: radii.sm,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
    backgroundColor: colors.accent,
  },
  competitionPlaceGold: {
    backgroundColor: '#FFD700',
  },
  competitionPlaceSilver: {
    backgroundColor: '#C0C0C0',
  },
  competitionPlaceBronze: {
    backgroundColor: '#CD7F32',
  },
  competitionPlaceText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.white,
  },
  competitionPlaceTextMedal: {
    color: '#000',
  },
  competitionPrize: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1),
    backgroundColor: colors.bg,
    borderRadius: radii.sm,
    padding: spacing(1.5),
  },
  competitionPrizeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
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
  modalButton: {
    paddingVertical: spacing(1),
    paddingHorizontal: spacing(2),
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: spacing(3),
    paddingTop: spacing(3),
  },
  modalSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(1),
  },
  modalSectionSubtitle: {
    fontSize: 14,
    color: colors.subtext,
    marginBottom: spacing(3),
  },
  editOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(2.5),
    marginBottom: spacing(2),
    borderWidth: 1,
    borderColor: colors.line,
    gap: spacing(2),
  },
  editOptionContent: {
    flex: 1,
  },
  editOptionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  editOptionDesc: {
    fontSize: 12,
    color: colors.subtext,
  },
  xpBalance: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
    borderRadius: radii.md,
    gap: spacing(0.5),
    marginRight: spacing(1),
  },
  xpBalanceText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  tab: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing(2),
    gap: spacing(0.5),
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.subtext,
    textAlign: 'center',
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
  tabContentScroll: {
    paddingBottom: spacing(6),
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.subtext,
    textAlign: 'center',
  },
  achievementsSection: {
    paddingHorizontal: spacing(3),
    marginBottom: spacing(4),
  },
  achievementsSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(2),
  },
  aboutSection: {
    paddingHorizontal: spacing(3),
    marginBottom: spacing(4),
  },
  aboutLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(2),
  },
  editProfileButton: {
    backgroundColor: colors.card,
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(4),
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    marginTop: spacing(2),
  },
  editProfileButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});