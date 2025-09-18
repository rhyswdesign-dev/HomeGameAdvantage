import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  Dimensions,
  FlatList,
  ListRenderItem,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing, radii } from '../theme/tokens';
import SectionHeader from '../components/SectionHeader';
import PillButton from '../components/PillButton';
import { useSavedItems } from '../hooks/useSavedItems';
import { SearchableItem, FilterOptions } from '../services/searchService';
import SearchModal from '../components/SearchModal';
import FilterDrawer from '../components/FilterDrawer';
import CreateRecipeModal from '../components/CreateRecipeModal';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { BARS as REAL_BARS } from '../data/bars';

type Nav = NativeStackNavigationProp<RootStackParamList>;
const { width } = Dimensions.get('window');
const GUTTER = 12;
const GOLD = '#C9A15A'; // spotlight color

/* ------------------------- DATA ------------------------- */

const COLLAGE = [
  'https://images.unsplash.com/photo-1542144582-1ba00456b5e9?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1529180184529-78f99adb8e28?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1520013576832-3f7b51f0f1b9?q=80&w=1600&auto=format&fit=crop',
];

// Bar of the Month: 3-image carousel
const BOM = {
  name: 'Untitled Champagne Lounge',
  subtitle: 'Bar of the Month',
  id: 'untitled_champagne_lounge',
  images: [
    'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=1600&auto=format&fit=crop',
  ],
};

type Bar = { name: string; subtitle: string; image: string; id?: string };

const FEATURED_PICKS: (Bar & { badge?: 'GOLD' | 'NEW' })[] = [
  { 
    id: 'untitled_champagne_lounge',
    name: 'Untitled Champagne Lounge', 
    subtitle: 'Financial District', 
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1600&auto=format&fit=crop',
    badge: 'GOLD'
  },
];

const MOODS = [
  { title: 'Relaxed & Intimate', subtitle: 'Perfect for Date Night',
    image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1600&auto=format&fit=crop' },
  { title: 'Vibrant & Lively', subtitle: 'Great for Groups',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop' },
  { title: 'Speakeasy Vibes', subtitle: 'Low-key hideaways',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1600&auto=format&fit=crop' },
  { title: 'Rooftop Views', subtitle: 'Cityscapes & sunsets',
    image: 'https://images.unsplash.com/photo-1521335629791-ce4aec67dd53?q=80&w=1600&auto=format&fit=crop' },
  { title: 'Cozy Corners', subtitle: 'Warm wood & candles',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1600&auto=format&fit=crop' },
  { title: 'Craft Labs', subtitle: 'Experimental menus',
    image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop' },
];

const BARS: Bar[] = [
  { 
    id: 'untitled_champagne_lounge',
    name: 'Untitled Champagne Lounge', 
    subtitle: 'Financial District', 
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1600&auto=format&fit=crop' 
  },
  { 
    id: 'the_alchemist',
    name: 'The Alchemist', 
    subtitle: 'Distillery District', 
    image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=1600&auto=format&fit=crop' 
  },
  { 
    id: 'the_velvet_curtain',
    name: 'The Velvet Curtain', 
    subtitle: 'Yorkville', 
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1600&auto=format&fit=crop' 
  },
  { 
    id: 'the_gilded_lily',
    name: 'The Gilded Lily', 
    subtitle: 'King Street West', 
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1600&auto=format&fit=crop' 
  },
  { 
    id: 'the_iron_flask',
    name: 'The Iron Flask', 
    subtitle: 'Kensington Market', 
    image: 'https://images.unsplash.com/photo-1569546913823-29ce4acc0c9a?q=80&w=1600&auto=format&fit=crop' 
  },
  { 
    id: 'the_velvet_note',
    name: 'The Velvet Note', 
    subtitle: 'The Danforth', 
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1600&auto=format&fit=crop' 
  },
  { 
    id: 'the_wine_cellar',
    name: 'The Wine Cellar', 
    subtitle: 'Harbourfront', 
    image: 'https://images.unsplash.com/photo-1566147780353-6296ce0e127e?q=80&w=1600&auto=format&fit=crop' 
  },
  { 
    id: 'skyline_lounge',
    name: 'Skyline Lounge', 
    subtitle: 'CN Tower District', 
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1600&auto=format&fit=crop' 
  },
  { 
    id: 'the_hidden_flask',
    name: 'The Hidden Flask', 
    subtitle: 'Queen Street West', 
    image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=1600&auto=format&fit=crop' 
  },
  { 
    id: 'the_tiki_hut',
    name: 'The Tiki Hut', 
    subtitle: 'Beaches', 
    image: 'https://images.unsplash.com/photo-1544441892-794166f1e3be?q=80&w=1600&auto=format&fit=crop' 
  },
];

/* ------------------------- UI PIECES ------------------------- */

function LocationRow({
  location,
  onUseLocation,
  onChangeCity,
}: {
  location: string;
  onUseLocation: () => void;
  onChangeCity: () => void;
}) {
  return (
    <View style={{ paddingHorizontal: spacing(2), paddingTop: spacing(1) }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable onPress={onChangeCity} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="location-outline" size={16} color={colors.muted} />
          <Text style={{ color: colors.muted, marginLeft: 6 }}>{location}</Text>
        </Pressable>
        <Pressable onPress={onUseLocation}>
          <Text style={{ color: GOLD, fontWeight: '800' }}>Use my location</Text>
        </Pressable>
      </View>
    </View>
  );
}

function CollageGrid() {
  const cellW = (width - spacing(2) * 2 - GUTTER * 2) / 3;
  const cellH = Math.round(cellW * 0.75);
  return (
    <View style={{ paddingHorizontal: spacing(2), paddingTop: spacing(1.25), marginBottom: spacing(1) }}>
      <View style={{ flexDirection: 'row', marginBottom: GUTTER }}>
        {COLLAGE.slice(0, 3).map((uri, i) => (
          <Image key={uri + i} source={{ uri }} style={{ width: cellW, height: cellH, borderRadius: radii.md, marginRight: i < 2 ? GUTTER : 0 }} />
        ))}
      </View>
      <View style={{ flexDirection: 'row' }}>
        {COLLAGE.slice(3, 6).map((uri, i) => (
          <Image key={uri + i} source={{ uri }} style={{ width: cellW, height: cellH, borderRadius: radii.md, marginRight: i < 2 ? GUTTER : 0 }} />
        ))}
      </View>
    </View>
  );
}

// Bar of the Month: 3-image carousel with gold badge
function HeroCarousel({ onOpen }: { onOpen: () => void }) {
  const cardW = width - spacing(2) * 2;
  const cardH = Math.round(cardW * 0.56);
  const [page, setPage] = useState(0);
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const p = Math.round(e.nativeEvent.contentOffset.x / cardW);
    setPage(p);
  };
  return (
    <View style={{ marginHorizontal: spacing(2), borderRadius: radii.xl, overflow: 'hidden', backgroundColor: colors.card, marginBottom: spacing(1.5) }}>
      <ScrollView horizontal nestedScrollEnabled pagingEnabled showsHorizontalScrollIndicator={false} onScroll={onScroll} scrollEventThrottle={16}>
        {BOM.images.map((uri) => (
          <Pressable key={uri} onPress={onOpen} style={{ width: cardW, height: cardH }}>
            <Image source={{ uri }} style={{ width: '100%', height: '100%' }} />
          </Pressable>
        ))}
      </ScrollView>

      {/* gold label & dots */}
      <View style={{ position: 'absolute', top: 10, left: 10, backgroundColor: GOLD, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 }}>
        <Text style={{ color: '#120D07', fontWeight: '900' }}>BAR OF THE MONTH</Text>
      </View>
      <View style={{ position: 'absolute', bottom: 10, alignSelf: 'center', flexDirection: 'row' }}>
        {BOM.images.map((_, i) => (
          <View key={i} style={{ width: 8, height: 8, borderRadius: 999, marginHorizontal: 4, backgroundColor: i === page ? GOLD : 'rgba(255,255,255,0.5)' }} />
        ))}
      </View>

      <View style={{ padding: spacing(2) }}>
        <Text style={{ color: colors.text, fontSize: 28, fontWeight: '900' }}>{BOM.name}</Text>
        <Text style={{ color: colors.muted, fontSize: 18, marginTop: 4 }}>{BOM.subtitle}</Text>
      </View>
    </View>
  );
}

// Featured Bar Picks (horizontal)
function FeaturedPickCard({ item, onPress, onSave, isSaved }: { item: (Bar & { badge?: 'GOLD' | 'NEW' }); onPress: () => void; onSave: (item: any) => void; isSaved: boolean }) {
  const w = 170;
  const h = Math.round(w * 0.7);
  return (
    <Pressable onPress={onPress} style={{ width: w, marginRight: spacing(1.25) }}>
      <View style={{ position: 'relative' }}>
        <Image source={{ uri: item.image }} style={{ width: '100%', height: h, borderRadius: radii.lg }} />
        <Pressable 
          style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: 6 }} 
          onPress={() => onSave(item)}
        >
          <Ionicons 
            name={isSaved ? "bookmark" : "bookmark-outline"} 
            size={16} 
            color={isSaved ? GOLD : "white"} 
          />
        </Pressable>
        {item.badge ? (
          <View style={{ position: 'absolute', top: 8, left: 8, backgroundColor: item.badge === 'GOLD' ? GOLD : colors.gold, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 }}>
            <Text style={{ color: '#120D07', fontWeight: '900', fontSize: 12 }}>{item.badge}</Text>
          </View>
        ) : null}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
        <Text style={{ color: colors.text, fontWeight: '900' }}>{item.name}</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.accent} style={{ marginLeft: 4 }} />
      </View>
      <Text style={{ color: colors.muted }}>{item.subtitle}</Text>
    </Pressable>
  );
}

function MoodCard({ title, image, subtitle, onPress }: { title: string; image: string; subtitle?: string; onPress?: () => void }) {
  const w = Math.min(0.78 * width, 300);
  const h = Math.round(w * 0.66);
  return (
    <Pressable onPress={onPress} style={{ width: w, marginRight: spacing(1.25) }}>
      <Image source={{ uri: image }} style={{ width: '100%', height: h, borderRadius: radii.lg }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
        <Text style={{ color: colors.text, fontWeight: '900', fontSize: 18 }}>{title}</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.accent} style={{ marginLeft: 4 }} />
      </View>
      {subtitle ? <Text style={{ color: colors.muted }}>{subtitle}</Text> : null}
    </Pressable>
  );
}

function BarCard({ item, onPress, onSave, isSaved }: { item: Bar; onPress: () => void; onSave: (item: any) => void; isSaved: boolean }) {
  const cardW = Math.floor((width - spacing(2) * 2 - GUTTER) / 2);
  const imgH = Math.round(cardW * 0.78);
  return (
    <Pressable onPress={onPress} style={{ width: cardW, marginBottom: spacing(2) }}>
      <View style={{ position: 'relative' }}>
        <Image source={{ uri: item.image }} style={{ width: '100%', height: imgH, borderRadius: radii.xl }} />
        <Pressable 
          style={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: 8 }} 
          onPress={() => onSave(item)}
        >
          <Ionicons 
            name={isSaved ? "bookmark" : "bookmark-outline"} 
            size={18} 
            color={isSaved ? GOLD : "white"} 
          />
        </Pressable>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
        <Text style={{ color: colors.text, fontSize: 22, fontWeight: '900' }} numberOfLines={1}>
          {item.name}
        </Text>
        <Ionicons name="chevron-forward" size={16} color={colors.accent} style={{ marginLeft: 4 }} />
      </View>
      <Text style={{ color: colors.muted, fontSize: 16 }} numberOfLines={1}>
        {item.subtitle}
      </Text>
    </Pressable>
  );
}

/* ------------------------- SCREEN ------------------------- */

const chips: Array<{ key: string; label: string }> = [
  { key: 'Home', label: 'Home' },
  { key: 'Spirits', label: 'Spirits' },
  { key: 'NonAlcoholic', label: 'Non-Alcoholic' },
  { key: 'Bars',    label: 'Bars'    },
  { key: 'Events',  label: 'Events'  },
  { key: 'Games',   label: 'Games'   },
  { key: 'Vault',   label: 'Vault'   },
];

export default function BarsScreen() {
  const navigation = useNavigation<Nav>();
  const { savedItems, toggleSavedBar, isBarSaved } = useSavedItems();
  const [city, setCity] = useState('Toronto, ON');
  const [active, setActive] = React.useState<string>('Bars');

  // Modal states
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [createRecipeModalVisible, setCreateRecipeModalVisible] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<Partial<FilterOptions>>({});

  const handleSearch = (query: string) => {
    // Handle search - you could filter bars or navigate to search results
    console.log('Search query:', query);
    setSearchModalVisible(false);
  };

  const handleFilterApply = (filters: Partial<FilterOptions>) => {
    setCurrentFilters(filters);
    setFilterDrawerVisible(false);
    console.log('Applied filters:', filters);
    // Apply filters to bar results
  };

  const handleRecipeCreated = (recipeId: string) => {
    console.log('Recipe created:', recipeId);
    setCreateRecipeModalVisible(false);
    // Could navigate to the created recipe
  };

  const handleCompetitionEntryCreated = (entryId: string) => {
    console.log('Competition entry created:', entryId);
    // Could navigate to the entry or competitions section
  };

  const handleBarPress = (barId: string) => {
    // Map bar IDs to their individual screens
    const barScreenMap: Record<string, keyof RootStackParamList> = {
      'the_alchemist': 'TheAlchemist',
      'the_velvet_curtain': 'TheVelvetCurtain',
      'the_gilded_lily': 'TheGildedLily',
      'the_iron_flask': 'TheIronFlask',
      'the_velvet_note': 'TheVelvetNote',
      'skyline_lounge': 'SkylineLounge',
      'the_tiki_hut': 'TheTikiHut',
      'the_wine_cellar': 'TheWineCellar',
      'the_hidden_flask': 'TheHiddenFlask',
      'untitled_champagne_lounge': 'UntitledLounge',
    };

    const screenName = barScreenMap[barId];
    
    if (screenName) {
      navigation.navigate(screenName);
    } else {
      // Fallback to generic BarDetails for bars without individual screens
      const bar = REAL_BARS[barId];
      if (bar) {
        navigation.navigate('BarDetails', {
          name: bar.name,
          subtitle: bar.quickInfo?.vibe || bar.hero?.location || 'Bar',
          image: bar.hero.image,
          city: bar.location?.city,
          address: bar.location?.address
        });
      }
    }
  };

  const goto = (key: string) => {
    setActive(key);
    try { 
      if (key === 'Home') {
        navigation.navigate('Main', { screen: 'Featured' });
      } else if (key === 'NonAlcoholic') {
        navigation.navigate('NonAlcoholic' as never);
      } else if (key) {
        navigation.navigate(key as never);
      }
    } catch {}
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Bars',
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { color: colors.text, fontWeight: '900' },
      headerShadowVisible: false,
      headerLeft: () => null,
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <Pressable hitSlop={12} onPress={() => setSearchModalVisible(true)}>
            <Ionicons name="search" size={24} color={colors.text} />
          </Pressable>
          <Pressable hitSlop={12} onPress={() => setFilterDrawerVisible(true)}>
            <Ionicons name="funnel" size={24} color={colors.text} />
          </Pressable>
          <Pressable hitSlop={12} onPress={() => setCreateRecipeModalVisible(true)}>
            <Ionicons name="add-circle" size={24} color={colors.accent} />
          </Pressable>
        </View>
      ),
    });
  }, [navigation]);

  const renderItem: ListRenderItem<Bar> = ({ item }) => (
    <BarCard
      item={item}
      onPress={() => {
        if (item.id) {
          handleBarPress(item.id);
        } else {
          navigation.navigate('BarDetails', {
            name: item.name,
            subtitle: item.subtitle,
            image: item.image,
          });
        }
      }}
      onSave={(item) => toggleSavedBar({ 
        id: item.id || item.name, 
        name: item.name, 
        subtitle: item.subtitle, 
        image: item.image 
      })}
      isSaved={isBarSaved(item.id || item.name)}
    />
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="light" />
      <FlatList
        data={BARS}
        keyExtractor={(it, idx) => it.name + idx}
        renderItem={renderItem}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing(8) }}
        ListHeaderComponent={
          <View>
            {/* Navigation Chips */}
            <ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator={false} style={{ paddingTop: spacing(2), paddingBottom: spacing(1) }} contentContainerStyle={{ flexDirection: 'row', paddingHorizontal: spacing(2), gap: spacing(1) }}>
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

            {/* location row moved below navigation chips */}
            <LocationRow
              location={city}
              onUseLocation={() => {
                // You can wire this up with expo-location later
                // import * as Location from 'expo-location'
                // and reverse-geocode to a city name.
                setCity('Near me'); // placeholder
              }}
              onChangeCity={() => {
                // open a city picker later; for now, quick demo toggle
                setCity((c) => (c === 'Toronto, ON' ? 'Vancouver, BC' : 'Toronto, ON'));
              }}
            />

            {/* collage */}
            <CollageGrid />

            {/* bar of the month: 3-image carousel */}
            <HeroCarousel
              onOpen={() => handleBarPress(BOM.id)}
            />

            {/* Featured Bar Picks (with Velvet Curtain spotlight in gold) */}
            <SectionHeader title="Featured Bar Picks" />
            <ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator={false} style={{ paddingLeft: spacing(2), marginBottom: spacing(2) }}>
              {FEATURED_PICKS.map((b) => (
                <FeaturedPickCard
                  key={b.name}
                  item={b}
                  onPress={() => {
                    if (b.id) {
                      handleBarPress(b.id);
                    } else {
                      navigation.navigate('BarDetails', {
                        name: b.name,
                        subtitle: b.subtitle,
                        image: b.image,
                      });
                    }
                  }}
                  onSave={(item) => toggleSavedBar({ 
                    id: item.id || item.name, 
                    name: item.name, 
                    subtitle: item.subtitle, 
                    image: item.image 
                  })}
                  isSaved={isBarSaved(b.id || b.name)}
                />
              ))}
            </ScrollView>

            {/* Explore the Mood (expanded) */}
            <SectionHeader title="Explore the Mood" />
            <ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator={false} style={{ paddingLeft: spacing(2), marginBottom: spacing(2) }}>
              {MOODS.map((m) => (
                <MoodCard
                  key={m.title}
                  title={m.title}
                  subtitle={m.subtitle}
                  image={m.image}
                  onPress={() => navigation.navigate('BarTheme', { theme: m.title })}
                />
              ))}
            </ScrollView>

            <SectionHeader title="All" />
          </View>
        }
        columnWrapperStyle={{ paddingHorizontal: spacing(2), columnGap: GUTTER }}
      />

      {/* Modals */}
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
      
      <CreateRecipeModal
        visible={createRecipeModalVisible}
        onClose={() => setCreateRecipeModalVisible(false)}
        onSuccess={handleRecipeCreated}
      />
    </View>
  );
}
