import React, { useLayoutEffect, useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { colors, spacing, radii, fonts } from '../theme/tokens';
import { Ionicons } from '@expo/vector-icons';
import PillButton from '../components/PillButton';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useSavedItems } from '../hooks/useSavedItems';

const chips: Array<{ key: string; label: string }> = [
  { key: 'Home', label: 'Home' },
  { key: 'Spirits', label: 'Spirits' },
  { key: 'NonAlcoholic', label: 'Non-Alcoholic' },
  { key: 'Bars',    label: 'Bars'    },
  { key: 'Events',  label: 'Events'  },
  { key: 'Games',   label: 'Games'   },
  { key: 'Vault',   label: 'Vault'   },
];

export default function EventsScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [active, setActive] = useState<string>('Events');
  const { toggleSavedEvent, isEventSaved } = useSavedItems();

  const goto = (key: string) => {
    setActive(key);
    try { 
      if (key === 'Home') {
        nav.navigate('Main', { screen: 'Featured' });
      } else if (key === 'NonAlcoholic') {
        nav.navigate('NonAlcoholic' as never);
      } else if (key) {
        nav.navigate(key as never);
      }
    } catch {}
  };

  useLayoutEffect(() => {
    nav.setOptions({
      title: 'Events',
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { color: colors.text, fontWeight: '900' },
      headerShadowVisible: false,
      headerLeft: () => null,
    });
  }, [nav]);
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing(8) }}>
      {/* Navigation Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingTop: spacing(2), paddingBottom: spacing(1) }} contentContainerStyle={{ flexDirection: 'row', paddingHorizontal: spacing(2), gap: spacing(1) }}>
        {chips.map(c => {
          const isActive = active === c.key;
          return (
            <PillButton
              key={c.key}
              title={c.label}
              onPress={() => goto(c.key)}
              style={!isActive ? { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.line } : undefined}
              textStyle={!isActive ? { color: colors.text } : undefined}
            />
          )
        })}
      </ScrollView>
      
      <View style={styles.section}>
        <Text style={styles.title}>Upcoming Events</Text>
        
        <View style={styles.eventCard}>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa6?auto=format&fit=crop&w=1100&q=60' }} 
              style={styles.eventImage}
            />
            <Pressable 
              style={styles.saveButton} 
              onPress={() => toggleSavedEvent({
                id: 'garnish-competition',
                name: 'Garnish of the Month Competition',
                subtitle: 'Powered by Legacy',
                image: 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa6?auto=format&fit=crop&w=1100&q=60'
              })}
              hitSlop={12}
            >
              <Ionicons 
                name={isEventSaved('garnish-competition') ? "bookmark" : "bookmark-outline"} 
                size={20} 
                color={isEventSaved('garnish-competition') ? colors.accent : colors.text} 
              />
            </Pressable>
          </View>
          <View style={styles.eventContent}>
            <Text style={styles.eventTitle}>Garnish of the Month Competition</Text>
            <Text style={styles.eventSubtitle}>Powered by Legacy</Text>
            <Text style={styles.eventDescription}>
              Submit your most creative garnish design for a chance to win exclusive prizes and recognition.
            </Text>
            <Pressable style={styles.learnMoreButton} onPress={() => nav.navigate('GarnishCompetition' as never)}>
              <Text style={styles.learnMoreText}>Learn More</Text>
            </Pressable>
          </View>
        </View>

        <View style={[styles.eventCard, { marginTop: spacing(2) }]}>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1528465424850-54d22f092599?auto=format&fit=crop&w=1100&q=60' }} 
              style={styles.eventImage}
            />
            <Pressable 
              style={styles.saveButton} 
              onPress={() => toggleSavedEvent({
                id: 'cocktail-submission',
                name: 'Cocktail Submission Competition',
                subtitle: 'Powered by Untitled Champagne Lounge',
                image: 'https://images.unsplash.com/photo-1528465424850-54d22f092599?auto=format&fit=crop&w=1100&q=60'
              })}
              hitSlop={12}
            >
              <Ionicons 
                name={isEventSaved('cocktail-submission') ? "bookmark" : "bookmark-outline"} 
                size={20} 
                color={isEventSaved('cocktail-submission') ? colors.accent : colors.text} 
              />
            </Pressable>
          </View>
          <View style={styles.eventContent}>
            <Text style={styles.eventTitle}>Cocktail Submission Competition</Text>
            <Text style={styles.eventSubtitle}>Powered by Untitled Champagne Lounge</Text>
            <Text style={styles.eventDescription}>
              Create and submit your original cocktail recipe for expert judging and amazing rewards.
            </Text>
            <Pressable style={styles.learnMoreButton} onPress={() => nav.navigate('CocktailSubmission' as never)}>
              <Text style={styles.learnMoreText}>Learn More</Text>
            </Pressable>
          </View>
        </View>

        <View style={[styles.eventCard, { marginTop: spacing(2) }]}>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1574671928146-5c89a22b2e85?auto=format&fit=crop&w=1100&q=60' }} 
              style={styles.eventImage}
            />
            <Pressable 
              style={styles.saveButton} 
              onPress={() => toggleSavedEvent({
                id: 'mixology-masterclass',
                name: 'Mixology Master Class',
                subtitle: 'Powered by MixedMindStudios',
                image: 'https://images.unsplash.com/photo-1574671928146-5c89a22b2e85?auto=format&fit=crop&w=1100&q=60'
              })}
              hitSlop={12}
            >
              <Ionicons 
                name={isEventSaved('mixology-masterclass') ? "bookmark" : "bookmark-outline"} 
                size={20} 
                color={isEventSaved('mixology-masterclass') ? colors.accent : colors.text} 
              />
            </Pressable>
          </View>
          <View style={styles.eventContent}>
            <Text style={styles.eventTitle}>Mixology Master Class</Text>
            <Text style={styles.eventSubtitle}>Powered by MixedMindStudios</Text>
            <Text style={styles.eventDescription}>
              Join expert mixologists for hands-on training in premium cocktail techniques and presentation.
            </Text>
            <Pressable style={styles.learnMoreButton} onPress={() => nav.navigate('MixologyMasterClass' as never)}>
              <Text style={styles.learnMoreText}>Register</Text>
            </Pressable>
          </View>
        </View>

        <View style={[styles.eventCard, { marginTop: spacing(2) }]}>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=1100&q=60' }} 
              style={styles.eventImage}
            />
            <Pressable 
              style={styles.saveButton} 
              onPress={() => toggleSavedEvent({
                id: 'whiskey-tasting',
                name: 'Whiskey Tasting & Education',
                subtitle: 'Powered by Highland Heritage Whiskey',
                image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=1100&q=60'
              })}
              hitSlop={12}
            >
              <Ionicons 
                name={isEventSaved('whiskey-tasting') ? "bookmark" : "bookmark-outline"} 
                size={20} 
                color={isEventSaved('whiskey-tasting') ? colors.accent : colors.text} 
              />
            </Pressable>
          </View>
          <View style={styles.eventContent}>
            <Text style={styles.eventTitle}>Whiskey Tasting & Education</Text>
            <Text style={styles.eventSubtitle}>Powered by Highland Heritage Whiskey</Text>
            <Text style={styles.eventDescription}>
              Explore the rich heritage of premium whiskey with guided tastings and expert knowledge sessions.
            </Text>
            <Pressable style={styles.learnMoreButton} onPress={() => nav.navigate('Events' as never)}>
              <Text style={styles.learnMoreText}>Learn More</Text>
            </Pressable>
          </View>
        </View>

        <View style={[styles.eventCard, { marginTop: spacing(2) }]}>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1574671928146-5c89a22b2e85?auto=format&fit=crop&w=1100&q=60' }} 
              style={styles.eventImage}
            />
            <Pressable 
              style={styles.saveButton} 
              onPress={() => toggleSavedEvent({
                id: 'vip-bar-experience',
                name: 'Exclusive VIP Bar Experience',
                subtitle: 'Powered by Ocean View Lounge',
                image: 'https://images.unsplash.com/photo-1574671928146-5c89a22b2e85?auto=format&fit=crop&w=1100&q=60'
              })}
              hitSlop={12}
            >
              <Ionicons 
                name={isEventSaved('vip-bar-experience') ? "bookmark" : "bookmark-outline"} 
                size={20} 
                color={isEventSaved('vip-bar-experience') ? colors.accent : colors.text} 
              />
            </Pressable>
          </View>
          <View style={styles.eventContent}>
            <Text style={styles.eventTitle}>Exclusive VIP Bar Experience</Text>
            <Text style={styles.eventSubtitle}>Powered by Ocean View Lounge</Text>
            <Text style={styles.eventDescription}>
              Experience an exclusive evening of premium cocktails, live music, and networking in our VIP lounge setting.
            </Text>
            <Pressable style={styles.learnMoreButton} onPress={() => nav.navigate('Events' as never)}>
              <Text style={styles.learnMoreText}>Learn More</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  section: {
    padding: spacing(2),
  },
  title: {
    color: colors.text,
    fontSize: fonts.h1,
    fontWeight: '800',
    marginBottom: spacing(2),
  },
  eventCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(2),
    shadowColor: colors.shadow,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: 200,
    borderRadius: radii.md,
    marginBottom: spacing(2),
  },
  saveButton: {
    position: 'absolute',
    top: spacing(1),
    right: spacing(1),
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventContent: {
    gap: spacing(1),
  },
  eventTitle: {
    color: colors.text,
    fontSize: fonts.h2,
    fontWeight: '800',
  },
  eventSubtitle: {
    color: colors.subtext,
    fontSize: fonts.body,
    fontWeight: '600',
  },
  eventDescription: {
    color: colors.muted,
    fontSize: fonts.body,
    lineHeight: 24,
    marginBottom: spacing(2),
  },
  learnMoreButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
    borderRadius: radii.md,
    alignSelf: 'flex-start',
  },
  learnMoreText: {
    color: colors.accentText,
    fontWeight: '600',
    fontSize: fonts.body,
  },
});