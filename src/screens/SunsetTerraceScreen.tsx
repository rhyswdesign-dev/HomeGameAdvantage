import React, { useState, useLayoutEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Pressable,
  Share,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, textStyles, layouts } from '../theme/tokens';
import { useSavedItems } from '../hooks/useSavedItems';

import Card from '../components/ui/Card';
import PillButton from '../components/PillButton';
import Section from '../components/ui/Section';
import Icon from '../components/ui/Icon';
import { BAR_IMAGES } from '../data/barImages';

const { width } = Dimensions.get('window');

const SunsetTerraceScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [isStoryExpanded, setIsStoryExpanded] = useState(false);
  const { toggleSavedBar, isBarSaved } = useSavedItems();

  const barId = 'sunset-terrace';
  const isSaved = isBarSaved(barId);

  const bar = {
    name: 'Sunset Terrace',
    hero: {
      image: BAR_IMAGES.the_ruby_parlour,
      location: 'King Street West'
    },
    quickInfo: {
      music: 'Ambient Jazz Every Evening',
      vibe: 'Rooftop Views',
      menu: 'Sunset Cocktails & Light Fare',
      popularNights: 'Friday & Saturday',
      happyHour: 'Tuesday - Thursday 5-7 PM'
    },
    location: {
      address: '555 King Street West, 25th Floor',
      city: 'Toronto, ON M5V 1M1',
      phone: '(416) 555-SUNSET'
    }
  };

  const signatureDrinks = [
    { image: 'https://images.unsplash.com/photo-1541976076758-347942db1978?q=80&w=1200&auto=format&fit=crop', name: 'Golden Hour', tagline: 'Gin & Elderflower', price: '$16' },
    { image: 'https://images.unsplash.com/photo-1541542684-4c7b4916e66e?q=80&w=1200&auto=format&fit=crop', name: 'Sunset Spritz', tagline: 'Aperol & Prosecco', price: '$14' },
    { image: 'https://images.unsplash.com/photo-1497534547324-0ebb3f052e88?q=80&w=1200&auto=format&fit=crop', name: 'Terrace Mule', tagline: 'Vodka & Ginger', price: '$15' },
    { image: 'https://images.unsplash.com/photo-1560785496-3c9d27877182?q=80&w=1200&auto=format&fit=crop', name: 'City Light', tagline: 'Whiskey & Honey', price: '$17' },
  ];

  const events = [
    { title: 'Sunset Sessions', dateISO: '2024-03-19', time: '6:00 PM', city: 'Toronto' },
    { title: 'Rooftop Jazz Night', dateISO: '2024-03-26', time: '7:00 PM', city: 'Toronto' },
  ];

  const story = {
    short: 'Experience breathtaking sunset views from our rooftop terrace. With panoramic city vistas and expertly crafted cocktails, Sunset Terrace offers the perfect backdrop for romantic evenings and special celebrations.',
    long: 'Experience breathtaking sunset views from our rooftop terrace. With panoramic city vistas and expertly crafted cocktails, Sunset Terrace offers the perfect backdrop for romantic evenings and special celebrations. Located 25 floors above the bustling city, our terrace creates an oasis where the sky meets exceptional mixology, transforming every visit into an unforgettable experience.'
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out Sunset Terrace! Rooftop Views - Experience breathtaking sunset views and panoramic city vistas.`,
        title: `Sunset Terrace - Premium Bar Experience`,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share at this time');
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 14 }}>
          <Pressable hitSlop={10} onPress={() => toggleSavedBar({
            id: barId,
            name: 'Sunset Terrace',
            subtitle: 'Rooftop Views',
            image: bar.hero.image
          })}>
            <Ionicons
              name={isSaved ? "bookmark" : "bookmark-outline"}
              size={20}
              color={isSaved ? colors.gold : colors.text}
            />
          </Pressable>
          <Pressable hitSlop={10} onPress={handleShare}>
            <Ionicons name="share-outline" size={20} color={colors.text} />
          </Pressable>
        </View>
      ),
    });
  }, [navigation, isSaved]);

  const renderEvent = ({ item }: { item: any }) => (
    <View style={styles.eventRow}>
      <Icon name="calendar" size={24} color={colors.accent} />
      <View style={styles.eventContent}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventDate}>
          {new Date(item.dateISO).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })}
          {item.time && ` • ${item.time}`}
          {item.city && ` • ${item.city}`}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <ImageBackground
          source={{ uri: typeof bar.hero.image === 'string' ? bar.hero.image : bar.hero.image }}
          style={styles.hero}
          accessibilityLabel="Bar hero image"
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.heroGradient}
          >
            <Text style={styles.heroTitle}>{bar.name}</Text>
            {bar.hero.location && (
              <Text style={styles.heroSubtitle}>{bar.hero.location}</Text>
            )}
          </LinearGradient>
        </ImageBackground>

        {/* Quick Info */}
        <Section title="At a Glance">
          <View style={styles.sectionContent}>
            {bar.quickInfo.music && (
              <View style={styles.quickInfoRow}>
                <Text style={styles.quickInfoLabel}>Music:</Text>
                <Text style={styles.quickInfoValue}>{bar.quickInfo.music}</Text>
              </View>
            )}
            {bar.quickInfo.vibe && (
              <View style={styles.quickInfoRow}>
                <Text style={styles.quickInfoLabel}>Vibe:</Text>
                <Text style={styles.quickInfoValue}>{bar.quickInfo.vibe}</Text>
              </View>
            )}
            {bar.quickInfo.menu && (
              <View style={styles.quickInfoRow}>
                <Text style={styles.quickInfoLabel}>Menu:</Text>
                <Text style={styles.quickInfoValue}>{bar.quickInfo.menu}</Text>
              </View>
            )}
            {bar.quickInfo.popularNights && (
              <View style={styles.quickInfoRow}>
                <Text style={styles.quickInfoLabel}>Popular Nights:</Text>
                <Text style={styles.quickInfoValue}>{bar.quickInfo.popularNights}</Text>
              </View>
            )}
            {bar.quickInfo.happyHour && (
              <View style={styles.quickInfoRow}>
                <Text style={styles.quickInfoLabel}>Happy Hour:</Text>
                <Text style={styles.quickInfoValue}>{bar.quickInfo.happyHour}</Text>
              </View>
            )}
          </View>
        </Section>

        {/* Signature Drinks */}
        <Section title="Signature Drinks">
          <ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
            {signatureDrinks.map((item, index) => (
              <Card
                key={`drink-${index}`}
                imageTop={item.image}
                style={styles.drinkCard}
              >
                <Text style={styles.drinkName}>{item.name}</Text>
                {item.tagline && <Text style={styles.drinkTagline}>{item.tagline}</Text>}
                {item.price && <Text style={styles.drinkPrice}>{item.price}</Text>}
              </Card>
            ))}
          </ScrollView>
        </Section>

        {/* Events */}
        <Section title="Upcoming Events">
          <View style={styles.sectionContent}>
            {events.map((event, index) => (
              <View key={`event-${index}`}>
                {renderEvent({ item: event })}
              </View>
            ))}
          </View>
        </Section>

        {/* Story */}
        <Section title="Our Story">
          <View style={styles.sectionContent}>
            <Text style={styles.storyText}>
              {isStoryExpanded && story.long
                ? story.long
                : story.short}
            </Text>
            {story.long && (
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

        {/* Bottom spacing for sticky bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Sticky Bottom CTA Bar */}
      <SafeAreaView style={styles.stickyBar}>
        <View style={styles.ctaContainer}>
          <PillButton
            title="Reserve Terrace"
            onPress={() => {}}
            variant="primary"
            style={styles.ctaButton}
          />
          <PillButton
            title="360° Views"
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

  // Content
  sectionContent: {
    paddingHorizontal: 16,
  },

  // Quick Info
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
});

export default SunsetTerraceScreen;