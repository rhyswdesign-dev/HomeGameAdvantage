/**
 * FeaturedBarScreen - Tier-based Bar Detail Screen
 * 
 * Renders three visual tiers (Bronze, Silver, Gold) with different section limits:
 * 
 * BRONZE: hero, 1 drink, short story, 1 social, sticky CTAs
 * SILVER: hero, 2-3 drinks, challenge, up to 2 events, short story, up to 2 social, sticky CTAs  
 * GOLD: hero, up to 6 drinks, challenge, up to 4 events, team, rewards, social grid, long story, sticky CTAs
 * 
 * Navigation Examples:
 * navigation.navigate('FeaturedBar', { barId: 'bar_oasis', tier: 'bronze' });
 * navigation.navigate('FeaturedBar', { barId: 'bar_oasis', tier: 'silver' });
 * navigation.navigate('FeaturedBar', { barId: 'bar_oasis', tier: 'gold' });
 * 
 * Figma References:
 * Gold: https://www.figma.com/proto/1odUghCiAofqxytb9IjBdh/Untitled?node-id=786-352&t=GkTHuwXvfgJDFFAO-1
 * Silver: https://www.figma.com/design/1odUghCiAofqxytb9IjBdh/Untitled?node-id=809-1291&t=xQfIj28ARTZnYPz8-1  
 * Bronze: https://www.figma.com/proto/1odUghCiAofqxytb9IjBdh/Untitled?node-id=809-1468&t=D3r4s6Icug5W5CfD-1
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Pressable,
  Share,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, textStyles, layouts } from '../theme/tokens';
import { useSavedItems } from '../hooks/useSavedItems';

import { BarTier, BarContent } from '../types/bar';
import { BAR_TIERS } from '../config/barTiers';
import { getBar } from '../data/bars';
import { resolveTier } from '../utils/inferBarTier';
import Card from '../components/ui/Card';
import PillButton from '../components/ui/PillButton';
import Section from '../components/ui/Section';
import Avatar from '../components/ui/Avatar';
import Icon from '../components/ui/Icon';
import BarVibesSection from '../components/bar/BarVibesSection';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  FeaturedBar: { barId: string; tier?: BarTier };
};

type FeaturedBarRouteProp = RouteProp<RootStackParamList, 'FeaturedBar'>;

const FeaturedBarScreen: React.FC = () => {
  const route = useRoute<FeaturedBarRouteProp>();
  const { barId, tier: paramTier } = route.params;
  const [isStoryExpanded, setIsStoryExpanded] = useState(false);
  const { toggleSavedBar, isBarSaved } = useSavedItems();
  
  const bar = getBar(barId);
  
  if (!bar) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Bar not found</Text>
      </View>
    );
  }

  const tier = resolveTier(paramTier, bar);
  const config = BAR_TIERS[tier];
  const isSaved = isBarSaved(barId);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${bar.name}! ${bar.tagline || bar.neighborhood || 'A premium bar experience'}.`,
        title: `${bar.name} - Premium Bar Experience`,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share at this time');
    }
  };

  // Use original untitled drinks if this is the untitled_champagne_lounge
  const originalUntitledDrinks = [
    { image: 'https://images.unsplash.com/photo-1541976076758-347942db1978?q=80&w=1200&auto=format&fit=crop', name: 'Casablanca', tagline: 'Whiskey & Cognac', price: '$18' },
    { image: 'https://images.unsplash.com/photo-1541542684-4c7b4916e66e?q=80&w=1200&auto=format&fit=crop', name: 'Oaxaca Sour', tagline: 'Tequila & Mezcal', price: '$19' },
    { image: 'https://images.unsplash.com/photo-1497534547324-0ebb3f052e88?q=80&w=1200&auto=format&fit=crop', name: 'Truffle Martini', tagline: 'Gin & Elderflower', price: '$16' },
  ];

  // Override story for untitled champagne lounge to match original
  const originalUntitledStory = {
    short: 'Tucked behind an unmarked doorway, Untitled Champagne Lounge pairs classic hospitality with a modern vinyl soundtrack. Low, amber lighting and a marble-rimmed bar set the pace for long conversations and quiet celebrations.',
    long: 'Tucked behind an unmarked doorway, Untitled Champagne Lounge pairs classic hospitality with a modern vinyl soundtrack. Low, amber lighting and a marble-rimmed bar set the pace for long conversations and quiet celebrations. The menu leans Champagne-forward, but the cocktail list is equally considered: elegant builds, precise technique, and spirits that speak for themselves.'
  };
  
  const limitedSignatureDrinks = bar.id === 'untitled_champagne_lounge' 
    ? originalUntitledDrinks 
    : (bar.signatureDrinks?.slice(0, config.maxDrinks) || []);
  const limitedEvents = bar.events?.slice(0, config.maxEvents) || [];
  // Show all 4 social posts for untitled champagne lounge, otherwise use tier limit
  const limitedSocial = bar.id === 'untitled_champagne_lounge' 
    ? (bar.social || []) 
    : (bar.social?.slice(0, config.maxSocial) || []);

  // Create content items for the main FlatList
  const createContentItems = () => {
    const items: any[] = [];
    
    // Hero section
    items.push({ type: 'hero', data: bar });
    
    // Quick Tags - Bronze only
    if (config.showQuickTags && bar.quickTags && bar.quickTags.length > 0) {
      items.push({ type: 'quickTags', data: bar.quickTags });
    }
    
    // Quick Info - Silver/Gold
    if (config.showQuickInfo && bar.quickInfo) {
      items.push({ type: 'quickInfo', data: bar.quickInfo });
    }
    
    // Signature Drinks
    if (limitedSignatureDrinks.length > 0) {
      items.push({ type: 'signatureDrinks', data: limitedSignatureDrinks });
    }
    
    // Challenge
    if (config.showChallenge && bar.challenge) {
      items.push({ type: 'challenge', data: bar.challenge });
    }
    
    // Events
    if (config.maxEvents > 0 && limitedEvents.length > 0) {
      items.push({ type: 'events', data: limitedEvents });
    }
    
    // Bar Vibes - Silver/Gold
    if ((tier === 'silver' || tier === 'gold') && bar.vibes) {
      items.push({ type: 'barVibes', data: bar.vibes });
    }
    
    // Social
    if (limitedSocial.length > 0) {
      items.push({ type: 'social', data: limitedSocial });
    }
    
    // Story
    const storyToUse = bar.id === 'untitled_champagne_lounge' ? originalUntitledStory : bar.story;
    if (storyToUse?.short) {
      items.push({ type: 'story', data: storyToUse });
    }
    
    return items;
  };

  const renderContentItem = ({ item }: { item: any }) => {
    switch (item.type) {
      case 'hero':
        return (
          <ImageBackground
            source={{ uri: item.data.hero.image }}
            style={styles.hero}
            accessibilityLabel="Bar hero image"
          >
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.heroGradient}
            >
              <Text style={styles.heroTitle}>{item.data.name}</Text>
              {item.data.hero.location && (
                <Text style={styles.heroSubtitle}>{item.data.hero.location}</Text>
              )}
            </LinearGradient>
          </ImageBackground>
        );
        
      case 'quickTags':
        return (
          <View style={styles.quickTagsContainer}>
            {item.data.map((tag: string, index: number) => (
              <View key={`tag-${tag}-${index}`} style={styles.quickTag}>
                <Text style={styles.quickTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        );
        
      case 'quickInfo':
        return (
          <Section title="At a Glance">
            <View style={styles.sectionContent}>
              {item.data.music && (
                <View style={styles.quickInfoRow}>
                  <Text style={styles.quickInfoLabel}>Music:</Text>
                  <Text style={styles.quickInfoValue}>{item.data.music}</Text>
                </View>
              )}
              {item.data.vibe && (
                <View style={styles.quickInfoRow}>
                  <Text style={styles.quickInfoLabel}>Vibe:</Text>
                  <Text style={styles.quickInfoValue}>{item.data.vibe}</Text>
                </View>
              )}
              {item.data.menu && (
                <View style={styles.quickInfoRow}>
                  <Text style={styles.quickInfoLabel}>Menu:</Text>
                  <Text style={styles.quickInfoValue}>{item.data.menu}</Text>
                </View>
              )}
              {item.data.popularNights && (
                <View style={styles.quickInfoRow}>
                  <Text style={styles.quickInfoLabel}>Popular Nights:</Text>
                  <Text style={styles.quickInfoValue}>{item.data.popularNights}</Text>
                </View>
              )}
              {item.data.happyHour && (
                <View style={styles.quickInfoRow}>
                  <Text style={styles.quickInfoLabel}>Happy Hour:</Text>
                  <Text style={styles.quickInfoValue}>{item.data.happyHour}</Text>
                </View>
              )}
            </View>
          </Section>
        );
        
      case 'signatureDrinks':
        return (
          <Section title="Signature Drinks">
            <FlatList
              data={item.data}
              renderItem={({ item: drink }) => (
                <Card imageTop={drink.image} style={styles.drinkCard}>
                  <Text style={styles.drinkName}>{drink.name}</Text>
                  {drink.tagline && <Text style={styles.drinkTagline}>{drink.tagline}</Text>}
                  {drink.price && <Text style={styles.drinkPrice}>{drink.price}</Text>}
                </Card>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(drink, index) => `drink-${index}`}
              contentContainerStyle={styles.horizontalList}
              nestedScrollEnabled
            />
          </Section>
        );
        
      case 'challenge':
        return (
          <Section title="Challenge">
            <Card 
              imageTop={item.data.image}
              style={styles.challengeCard}
              footer={
                <PillButton 
                  title="Learn More"
                  onPress={() => {}}
                  variant="filled"
                />
              }
            >
              <Text style={styles.challengeTitle}>{item.data.title}</Text>
              <Text style={styles.challengeCopy}>{item.data.copy}</Text>
            </Card>
          </Section>
        );
        
      case 'events':
        return (
          <Section title="Upcoming Events">
            <View style={styles.sectionContent}>
              {item.data.map((event: any, index: number) => (
                <View key={`event-${index}`} style={styles.eventRow}>
                  <Icon name="calendar" size={24} color={colors.accent} />
                  <View style={styles.eventContent}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventDate}>
                      {new Date(event.dateISO).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric'
                      })}
                      {event.time && ` • ${event.time}`}
                      {event.city && ` • ${event.city}`}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </Section>
        );
        
      case 'barVibes':
        return <BarVibesSection vibes={item.data} />;
        
      case 'social':
        return (
          <Section title="Social">
            <FlatList
              data={item.data}
              renderItem={({ item: socialPost }) => (
                <Card imageTop={socialPost.image} style={styles.socialCard}>
                  {socialPost.handle && <Text style={styles.socialHandle}>{socialPost.handle}</Text>}
                  {socialPost.caption && <Text style={styles.socialCaption}>{socialPost.caption}</Text>}
                </Card>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(socialPost, index) => `social-${index}`}
              contentContainerStyle={styles.horizontalList}
              nestedScrollEnabled
            />
          </Section>
        );
        
      case 'story':
        return (
          <Section title="Our Story">
            <View style={styles.sectionContent}>
              <Text style={styles.storyText}>
                {isStoryExpanded && item.data.long 
                  ? item.data.long 
                  : item.data.short}
              </Text>
              {item.data.long && (
                <TouchableOpacity 
                  onPress={() => setIsStoryExpanded(!isStoryExpanded)}
                  style={styles.readMoreButton}
                >
                  <Text style={styles.readMoreText}>
                    {isStoryExpanded ? 'Show Less' : 'Read More'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </Section>
        );
        
      default:
        return null;
    }
  };

  const contentItems = createContentItems();

  return (
    <View style={styles.container}>
      <FlatList
        data={contentItems}
        renderItem={renderContentItem}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        removeClippedSubviews
      />
      
      {/* Floating Action Buttons */}
      <View style={styles.floatingButtonContainer}>
        <Pressable 
          style={styles.floatingShareButton}
          onPress={handleShare}
        >
          <Ionicons 
            name="share-outline" 
            size={24} 
            color={colors.text} 
          />
        </Pressable>
        <Pressable 
          style={[styles.floatingSaveButton, { backgroundColor: isSaved ? colors.gold : colors.card }]}
          onPress={() => toggleSavedBar({
            id: barId,
            name: bar.name,
            subtitle: bar.tagline || bar.neighborhood || 'Premium Experience',
            image: bar.hero?.image || bar.signatureDrinks?.[0]?.image
          })}
        >
          <Ionicons 
            name={isSaved ? "bookmark" : "bookmark-outline"} 
            size={24} 
            color={isSaved ? colors.bg : colors.text} 
          />
        </Pressable>
      </View>
      
      {/* Sticky Bottom CTA Bar */}
      <SafeAreaView style={styles.stickyBar}>
        <View style={styles.ctaContainer}>
          <PillButton 
            title="Buy Now"
            onPress={() => {}}
            variant="filled"
            style={styles.ctaButton}
          />
          <PillButton 
            title="Find Near You"
            onPress={() => {}}
            variant="outline"
            style={styles.ctaButton}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg,
  },
  errorText: {
    fontSize: 18,
    color: colors.white,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 100, // Account for sticky bar
  },

  // Hero
  hero: {
    height: 320,
    justifyContent: 'flex-end',
  },
  heroGradient: {
    padding: 24,
    paddingBottom: 32,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.white,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.textMuted,
    fontWeight: '500',
  },

  // XP Banner
  xpBanner: {
    backgroundColor: colors.accent,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 12,
  },
  xpText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.goldText,
    textAlign: 'center',
  },

  // Content
  sectionContent: {
    paddingHorizontal: 16,
  },

  // Quick Tags - Bronze
  quickTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  quickTag: {
    backgroundColor: colors.chipBg,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  quickTagText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },

  // Quick Info - Silver/Gold
  quickInfoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  quickInfoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
    width: 120,
  },
  quickInfoValue: {
    fontSize: 14,
    color: colors.textMuted,
    flex: 1,
  },

  // Horizontal Lists
  horizontalList: {
    paddingHorizontal: 16,
    gap: 16,
  },

  // Featured Drinks
  drinkCard: {
    width: 200,
  },
  drinkName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
  },
  drinkTagline: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 8,
  },
  drinkPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accent,
  },

  // Challenge
  challengeCard: {
    marginHorizontal: 16,
  },
  challengeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 8,
  },
  challengeCopy: {
    fontSize: 16,
    color: colors.textMuted,
    lineHeight: 22,
  },

  // Events
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  eventContent: {
    flex: 1,
    marginLeft: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 2,
  },
  eventDate: {
    fontSize: 14,
    color: colors.textMuted,
  },

  // Social
  socialGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  socialColumn: {
    flex: 1,
    gap: 8,
  },
  socialCard: {
    width: 180,
  },
  socialHandle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
    marginBottom: 2,
  },
  socialCaption: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 16,
  },

  // Story
  storyText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textMuted,
    marginBottom: 12,
  },
  readMoreButton: {
    alignSelf: 'flex-start',
  },
  readMoreText: {
    fontSize: 16,
    color: colors.accent,
    fontWeight: '600',
  },

  // Sticky Bar
  stickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  ctaContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  ctaButton: {
    flex: 1,
  },
  bottomSpacing: {
    height: 24,
  },
  floatingSaveButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.line,
  },
  floatingButtonContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    flexDirection: 'column',
    gap: 12,
  },
  floatingShareButton: {
    backgroundColor: colors.card,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.line,
  },
});

export default FeaturedBarScreen;