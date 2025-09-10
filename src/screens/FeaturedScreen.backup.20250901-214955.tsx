import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radii, fonts } from '../theme/tokens';

// ---- Top chips (Spirits, Bars, Events, Games)
const chips: Array<{ key: 'Spirits'|'Bars'|'Events'|'Games'; label: string }> = [
  { key: 'Spirits', label: 'Spirits' },
  { key: 'Bars',    label: 'Bars'    },
  { key: 'Events',  label: 'Events'  },
  { key: 'Games',   label: 'Games'   },
];

// ---- Example content for the sections
const brandPicks = [
  {
    title: 'Whiskey Wonders',
    subtitle: 'Featured in Classic Cocktails',
    brand: 'Whiskey',
    img: 'https://images.unsplash.com/photo-1514362546876-684fc1f47f2q?auto=format&fit=crop&w=1200&q=60',
  },
  {
    title: 'Gin Gems',
    subtitle: 'Featured in Refreshing Mixes',
    brand: 'Gin',
    img: 'https://images.unsplash.com/photo-1561212468-b8234b29d8?auto=format&fit=crop&w=1200&q=60',
  },
];

const barPicks = [
  {
    title: 'Relaxed & Cozy',
    theme: 'Relaxed & Cozy',
    img: 'https://images.unsplash.com/photo-1543007630-9710e4a3c29a?auto=format&fit=crop&w=1200&q=60',
  },
  {
    title: 'Energetic & Social',
    theme: 'Energetic & Social',
    img: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=1200&q=60',
  },
];

const games = [
  {
    title: 'MixMaster Challenge',
    difficulty: 'Medium',
    img: 'https://images.unsplash.com/photo-1618221118493-9cfa1a0f3f4e?auto=format&fit=crop&w=880&q=60',
  },
  {
    title: 'Speedy Sips',
    difficulty: 'Easy',
    img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc84a?auto=format&fit=crop&w=880&q=60',
  },
];

const videos = [
  {
    title: 'Perfect Pour Techniques',
    duration: 'Watch Now · 2 min',
    img: 'https://images.unsplash.com/photo-1514362546898-4c5b9f0b1a2d?auto=format&fit=crop&w=1200&q=60',
  },
  {
    title: 'Garnish Like a Pro',
    duration: 'Watch Now · 3 min',
    img: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=60',
  },
];

export default function FeaturedScreen() {
  const nav = useNavigation<any>();
  const [activeChip, setActiveChip] = React.useState<'Spirits'|'Bars'|'Events'|'Games'>('Spirits');

  const goto = (key: typeof activeChip) => {
    setActiveChip(key);
    // keep your screen names the same as your navigator
    nav.navigate(key as never);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing(4) }}>
      {/* Chips row */}
      <View style={styles.chipsRow}>
        {chips.map(c => {
          const active = activeChip === c.key;
          return (
            <TouchableOpacity
              key={c.key}
              onPress={() => goto(c.key)}
              style={[styles.chip, active && styles.chipActive]}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {c.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Featured Brand Picks */}
      <Section title="Featured Brand Picks">
        <HorizontalCards 
          cards={brandPicks} 
          onCardPress={(card) => nav.navigate('Brand', { brand: card.brand })}
        />
      </Section>

      {/* Featured Bar Picks */}
      <Section title="Featured Bar Picks">
        <HorizontalCards 
          cards={barPicks} 
          smallGap 
          onCardPress={(card) => nav.navigate('BarTheme', { theme: card.theme })}
        />
      </Section>

      {/* Upcoming Events (with gold button) */}
      <Section title="Upcoming Events">
        <View style={styles.eventRow}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa6?auto=format&fit=crop&w=1100&q=60' }} style={styles.eventImage}/>
          <View style={{ flex: 1 }}>
            <Text style={styles.eventTitle}>Live at The Alchemist This Weekend</Text>
            <Text style={styles.eventSubtitle}>Powered by Legacy</Text>

            <TouchableOpacity style={styles.goldBtn} activeOpacity={0.85}>
              <Text style={styles.goldBtnText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Section>

      {/* Featured Games */}
      <Section title="Featured Games">
        <View style={styles.grid2}>
          {games.map(g => (
            <View key={g.title} style={styles.gameCard}>
              <Image source={{ uri: g.img }} style={styles.gameImage} />
              <Text style={styles.cardTitle}>{g.title}</Text>
              <Text style={styles.cardSub}>{`Difficulty: ${g.difficulty}`}</Text>
            </View>
          ))}
        </View>
      </Section>

      {/* Masterclass */}
      <Section title="Masterclass Sign–Up">
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1514362546898-4c5b9f0b1a2d?auto=format&fit=crop&w=1200&q=60' }}
          style={styles.masterImage}
        />
      </Section>

      {/* Premium tools with gold CTA */}
      <SectionCard
        title="Premium Bar Tools"
        subtitle="Equip your home bar with professional-grade tools."
        cta="Challenge with This"
        onPress={() => {}}
      />

      {/* Bartending Hack Videos */}
      <Section title="Bartending Hack Videos">
        <View style={styles.grid2}>
          {videos.map(v => (
            <View key={v.title} style={styles.videoCard}>
              <Image source={{ uri: v.img }} style={styles.videoImage} />
              <Text style={styles.cardTitle}>{v.title}</Text>
              <Text style={styles.cardSub}>{v.duration}</Text>
            </View>
          ))}
        </View>
      </Section>

      {/* Bartender Spotlight */}
      <Section title="Bartender Spotlight">
        <View style={styles.profileRow}>
          <Image
            source={{ uri: 'https://images.unsplash.com/illustration-female-avatar.png?auto=format&fit=crop&w=300&q=60' }}
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>Ava Sterling</Text>
            <Text style={styles.profileLine}>London, UK ·</Text>
            <TouchableOpacity onPress={() => nav.navigate('UntitledLounge')} activeOpacity={0.8}>
              <Text style={[styles.profileLine, { textDecorationLine: 'underline' }]}>Favorite Bar: Untitled Champagne Lounge</Text>
            </TouchableOpacity>
            <Text style={styles.profileLine}>Calgary, AB</Text>
            <Text style={styles.profileLine}>Signature Drink: The Mélange à trois</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.goldBtn, { alignSelf: 'center', marginTop: spacing(2) }]} activeOpacity={0.85}>
          <Text style={styles.goldBtnText}>Follow</Text>
        </TouchableOpacity>
      </Section>
    </ScrollView>
  );
}

/* -------------------------- Small building blocks -------------------------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={{ marginTop: spacing(1) }}>{children}</View>
    </View>
  );
}

function HorizontalCards({ cards, smallGap, onCardPress }: { cards: Array<{title: string; subtitle?: string; img: string; brand?: string; theme?: string }>; smallGap?: boolean; onCardPress?: (card: any) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: smallGap ? spacing(1.5) : spacing(2) }}>
      {cards.map(c => (
        <TouchableOpacity key={c.title} style={styles.hCard} onPress={() => onCardPress?.(c)} activeOpacity={0.8}>
          <Image source={{ uri: c.img }} style={styles.hImage} />
          <Text style={styles.cardTitle}>{c.title}</Text>
          {c.subtitle ? <Text style={styles.cardSub}>{c.subtitle}</Text> : null}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

function SectionCard({
  title,
  subtitle,
  cta,
  onPress,
}: {
  title: string;
  subtitle: string;
  cta: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.toolCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSub}>{subtitle}</Text>
      </View>
      <TouchableOpacity onPress={onPress} style={styles.goldBtn} activeOpacity={0.85}>
        <Text style={styles.goldBtnText}>{cta}</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ----------------------------------- Styles -------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  /* chips */
  chipsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing(2),
    paddingTop: spacing(2),
    gap: spacing(1),
  },
  chip: {
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
    backgroundColor: colors.chipBg,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.chipBorder,
  },
  chipActive: {
    backgroundColor: colors.chipActive,
  },
  chipText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  chipTextActive: {
    color: colors.text,
  },

  /* sections */
  section: {
    paddingHorizontal: spacing(2),
    marginTop: spacing(2),
  },
  sectionTitle: {
    color: colors.text,
    fontSize: fonts.h2,
    fontWeight: '800',
  },

  /* horizontal card */
  hCard: {
    width: 260,
  },
  hImage: {
    width: 260,
    height: 160,
    borderRadius: radii.md,
    marginBottom: spacing(1),
  },
  cardTitle: { color: colors.text, fontWeight: '800', fontSize: fonts.h3 },
  cardSub:   { color: colors.muted, marginTop: 2 },

  /* event */
  eventRow: {
    flexDirection: 'row',
    gap: spacing(2),
    alignItems: 'center',
  },
  eventImage: {
    width: 120,
    height: 90,
    borderRadius: radii.md,
  },
  eventTitle: { color: colors.text, fontWeight: '800', fontSize: fonts.h3 },
  eventSubtitle: { color: colors.muted, marginTop: 2 },

  /* grid 2 (games, videos) */
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(2),
  },
  gameCard: {
    width: '47%',
  },
  gameImage: {
    width: '100%',
    height: 140,
    borderRadius: radii.lg,
    marginBottom: spacing(1),
  },

  videoCard: {
    width: '47%',
  },
  videoImage: {
    width: '100%',
    height: 140,
    borderRadius: radii.lg,
    marginBottom: spacing(1),
  },

  /* masterclass */
  masterImage: {
    width: '100%',
    height: 160,
    borderRadius: radii.lg,
  },

  /* tool promo / partner pick */
  toolCard: {
    marginHorizontal: spacing(2),
    marginTop: spacing(2),
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(2),
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(2),
    shadowColor: colors.shadow,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 3,
  },

  /* gold button (used for "Learn More", "Challenge with This", "Follow") */
  goldBtn: {
    backgroundColor: colors.gold,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1.25),
    borderRadius: radii.md,
  },
  goldBtnText: {
    color: colors.goldText,
    fontWeight: '800',
    fontSize: 15,
  },

  /* spotlight */
  profileRow: {
    flexDirection: 'row',
    gap: spacing(2),
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 14,
  },
  profileName: {
    color: colors.text,
    fontWeight: '800',
    fontSize: fonts.h3,
    marginBottom: 4,
  },
  profileLine: {
    color: colors.muted,
  },
});
