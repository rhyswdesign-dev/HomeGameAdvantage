import React, { useLayoutEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Modal,
} from 'react-native';
import { colors, spacing, radii } from '../theme/tokens';
import { Ionicons } from '@expo/vector-icons';
import SectionHeader from '../components/SectionHeader';
import PillButton from '../components/ui/PillButton';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { getRandomizedBrandsByCategory } from '../data/brands';
import { useSavedItems } from '../hooks/useSavedItems';


const chips: Array<{ key: string; label: string }> = [
  { key: 'Home', label: 'Home' },
  { key: 'Spirits', label: 'Spirits' },
  { key: 'NonAlcoholic', label: 'Non-Alcoholic' },
  { key: 'Bars', label: 'Bars' },
  { key: 'Events', label: 'Events' },
  { key: 'Games', label: 'Games' },
  { key: 'Vault', label: 'Vault' },
];

export default function SpiritsScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [active, setActive] = useState<string>('Spirits');
  const [selectedSpirit, setSelectedSpirit] = useState<any>(null);
  const { toggleSavedSpirit, isSpiritSaved } = useSavedItems();

  const goto = (key: string) => {
    setActive(key);
    try {
      if (key === 'Home') {
        nav.goBack();
      } else if (key === 'Spirits') {
        // Already on spirits screen, do nothing
        return;
      } else if (key === 'Bars') {
        nav.navigate('Bars');
      } else if (key === 'Events') {
        nav.navigate('Events');
      } else if (key === 'Games') {
        nav.navigate('Games');
      } else if (key === 'NonAlcoholic') {
        nav.navigate('NonAlcoholic' as never);
      } else if (key === 'Vault') {
        nav.navigate('Vault' as never);
      }
    } catch (error) {
      console.log('Navigation error:', error);
    }
  };

  const onExploreBrand = (brand: any) => {
    // Show cocktail recipes modal first, then navigate if user wants more details
    setSelectedSpirit(brand);
  };


  useLayoutEffect(() => {
    nav.setOptions({
      title: 'Spirits',
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { color: colors.text, fontWeight: '900' },
      headerShadowVisible: false,
      headerLeft: () => (
        <Pressable hitSlop={12} onPress={() => nav.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
      ),
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 14 }}>
          <Pressable hitSlop={10} onPress={() => {}}>
            <Ionicons name="search-outline" size={20} color={colors.text} />
          </Pressable>
          <Pressable hitSlop={10} onPress={() => {}}>
            <Ionicons name="funnel-outline" size={20} color={colors.text} />
          </Pressable>
          <Pressable hitSlop={10} onPress={() => {}}>
            <Ionicons name="ellipsis-horizontal" size={20} color={colors.text} />
          </Pressable>
        </View>
      ),
    });
  }, [nav]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing(8) }}>
      {/* Navigation Chips - Horizontal and Scrollable */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.chipsContainer} 
        contentContainerStyle={styles.chipsRow}
      >
        {chips.map((c) => {
          const isActive = active === c.key;
          return (
            <PillButton
              key={c.key}
              title={c.label}
              onPress={() => goto(c.key)}
              style={!isActive ? { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.line } : undefined}
              textStyle={!isActive ? { color: colors.text } : undefined}
            />
          );
        })}
      </ScrollView>

      {/* Whiskey Brands */}
      <SectionHeader title="Whiskey" />
      {getRandomizedBrandsByCategory('Whiskey').map((brand) => (
        <View key={brand.id} style={styles.card}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: brand.hero?.image || '' }} style={styles.hero} />
            <Pressable 
              style={styles.saveButton} 
              onPress={() => toggleSavedSpirit({
                id: brand.id,
                name: brand.name,
                subtitle: brand.category || brand.region,
                image: brand.hero?.image || brand.image
              })}
              hitSlop={12}
            >
              <Ionicons 
                name={isSpiritSaved(brand.id) ? "bookmark" : "bookmark-outline"} 
                size={20} 
                color={isSpiritSaved(brand.id) ? colors.accent : colors.text} 
              />
            </Pressable>
          </View>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing(0.5) }}>
                <Text style={styles.h2}>{brand.name || 'Unknown Brand'}</Text>
                <View style={[
                  styles.tierBadge,
                  brand.tier === 'gold' && styles.goldBadge,
                  brand.tier === 'silver' && styles.silverBadge,
                  brand.tier === 'bronze' && styles.bronzeBadge
                ].filter(Boolean)}>
                  <Text style={[
                    styles.tierText,
                    brand.tier === 'gold' && styles.goldText,
                    brand.tier === 'silver' && styles.silverText,
                    brand.tier === 'bronze' && styles.bronzeText
                  ].filter(Boolean)}>{brand.tier.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.kicker}>
                {brand.hero?.tagline || `${brand.quickInfo?.style || ''} • ${brand.quickInfo?.origin || ''}`}
              </Text>
            </View>
            <PillButton
              title="Explore"
              onPress={() => onExploreBrand(brand)}
              style={styles.pillRight}
            />
          </View>
        </View>
      ))}

      {/* Gin Brands */}
      <SectionHeader title="Gin" />
      {getRandomizedBrandsByCategory('Gin').map((brand) => (
        <View key={brand.id} style={styles.card}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: brand.hero?.image || '' }} style={styles.hero} />
            <Pressable 
              style={styles.saveButton} 
              onPress={() => toggleSavedSpirit({
                id: brand.id,
                name: brand.name,
                subtitle: brand.category || brand.region,
                image: brand.hero?.image || brand.image
              })}
              hitSlop={12}
            >
              <Ionicons 
                name={isSpiritSaved(brand.id) ? "bookmark" : "bookmark-outline"} 
                size={20} 
                color={isSpiritSaved(brand.id) ? colors.accent : colors.text} 
              />
            </Pressable>
          </View>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing(0.5) }}>
                <Text style={styles.h2}>{brand.name || 'Unknown Brand'}</Text>
                <View style={[
                  styles.tierBadge,
                  brand.tier === 'gold' && styles.goldBadge,
                  brand.tier === 'silver' && styles.silverBadge,
                  brand.tier === 'bronze' && styles.bronzeBadge
                ].filter(Boolean)}>
                  <Text style={[
                    styles.tierText,
                    brand.tier === 'gold' && styles.goldText,
                    brand.tier === 'silver' && styles.silverText,
                    brand.tier === 'bronze' && styles.bronzeText
                  ].filter(Boolean)}>{brand.tier.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.kicker}>
                {brand.hero?.tagline || `${brand.quickInfo?.style || ''} • ${brand.quickInfo?.origin || ''}`}
              </Text>
            </View>
            <PillButton
              title="Explore"
              onPress={() => onExploreBrand(brand)}
              style={styles.pillRight}
            />
          </View>
        </View>
      ))}

      {/* Vodka Brands */}
      <SectionHeader title="Vodka" />
      {getRandomizedBrandsByCategory('Vodka').map((brand) => (
        <View key={brand.id} style={styles.card}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: brand.hero?.image || '' }} style={styles.hero} />
            <Pressable 
              style={styles.saveButton} 
              onPress={() => toggleSavedSpirit({
                id: brand.id,
                name: brand.name,
                subtitle: brand.category || brand.region,
                image: brand.hero?.image || brand.image
              })}
              hitSlop={12}
            >
              <Ionicons 
                name={isSpiritSaved(brand.id) ? "bookmark" : "bookmark-outline"} 
                size={20} 
                color={isSpiritSaved(brand.id) ? colors.accent : colors.text} 
              />
            </Pressable>
          </View>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing(0.5) }}>
                <Text style={styles.h2}>{brand.name || 'Unknown Brand'}</Text>
                <View style={[
                  styles.tierBadge,
                  brand.tier === 'gold' && styles.goldBadge,
                  brand.tier === 'silver' && styles.silverBadge,
                  brand.tier === 'bronze' && styles.bronzeBadge
                ].filter(Boolean)}>
                  <Text style={[
                    styles.tierText,
                    brand.tier === 'gold' && styles.goldText,
                    brand.tier === 'silver' && styles.silverText,
                    brand.tier === 'bronze' && styles.bronzeText
                  ].filter(Boolean)}>{brand.tier.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.kicker}>
                {brand.hero?.tagline || `${brand.quickInfo?.style || ''} • ${brand.quickInfo?.origin || ''}`}
              </Text>
            </View>
            <PillButton
              title="Explore"
              onPress={() => onExploreBrand(brand)}
              style={styles.pillRight}
            />
          </View>
        </View>
      ))}

      {/* Tequila Brands */}
      <SectionHeader title="Tequila" />
      {getRandomizedBrandsByCategory('Tequila').map((brand) => (
        <View key={brand.id} style={styles.card}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: brand.hero?.image || '' }} style={styles.hero} />
            <Pressable 
              style={styles.saveButton} 
              onPress={() => toggleSavedSpirit({
                id: brand.id,
                name: brand.name,
                subtitle: brand.category || brand.region,
                image: brand.hero?.image || brand.image
              })}
              hitSlop={12}
            >
              <Ionicons 
                name={isSpiritSaved(brand.id) ? "bookmark" : "bookmark-outline"} 
                size={20} 
                color={isSpiritSaved(brand.id) ? colors.accent : colors.text} 
              />
            </Pressable>
          </View>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing(0.5) }}>
                <Text style={styles.h2}>{brand.name || 'Unknown Brand'}</Text>
                <View style={[
                  styles.tierBadge,
                  brand.tier === 'gold' && styles.goldBadge,
                  brand.tier === 'silver' && styles.silverBadge,
                  brand.tier === 'bronze' && styles.bronzeBadge
                ].filter(Boolean)}>
                  <Text style={[
                    styles.tierText,
                    brand.tier === 'gold' && styles.goldText,
                    brand.tier === 'silver' && styles.silverText,
                    brand.tier === 'bronze' && styles.bronzeText
                  ].filter(Boolean)}>{brand.tier.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.kicker}>
                {brand.hero?.tagline || `${brand.quickInfo?.style || ''} • ${brand.quickInfo?.origin || ''}`}
              </Text>
            </View>
            <PillButton
              title="Explore"
              onPress={() => onExploreBrand(brand)}
              style={styles.pillRight}
            />
          </View>
        </View>
      ))}

      {/* Rum Brands */}
      <SectionHeader title="Rum" />
      {getRandomizedBrandsByCategory('Rum').map((brand) => (
        <View key={brand.id} style={styles.card}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: brand.hero?.image || '' }} style={styles.hero} />
            <Pressable 
              style={styles.saveButton} 
              onPress={() => toggleSavedSpirit({
                id: brand.id,
                name: brand.name,
                subtitle: brand.category || brand.region,
                image: brand.hero?.image || brand.image
              })}
              hitSlop={12}
            >
              <Ionicons 
                name={isSpiritSaved(brand.id) ? "bookmark" : "bookmark-outline"} 
                size={20} 
                color={isSpiritSaved(brand.id) ? colors.accent : colors.text} 
              />
            </Pressable>
          </View>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing(0.5) }}>
                <Text style={styles.h2}>{brand.name || 'Unknown Brand'}</Text>
                <View style={[
                  styles.tierBadge,
                  brand.tier === 'gold' && styles.goldBadge,
                  brand.tier === 'silver' && styles.silverBadge,
                  brand.tier === 'bronze' && styles.bronzeBadge
                ].filter(Boolean)}>
                  <Text style={[
                    styles.tierText,
                    brand.tier === 'gold' && styles.goldText,
                    brand.tier === 'silver' && styles.silverText,
                    brand.tier === 'bronze' && styles.bronzeText
                  ].filter(Boolean)}>{brand.tier.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.kicker}>
                {brand.hero?.tagline || `${brand.quickInfo?.style || ''} • ${brand.quickInfo?.origin || ''}`}
              </Text>
            </View>
            <PillButton
              title="Explore"
              onPress={() => onExploreBrand(brand)}
              style={styles.pillRight}
            />
          </View>
        </View>
      ))}

      {/* bottom spacer so tab bar never overlaps last card */}
      <View style={{ height: spacing(6) }} />
    </ScrollView>

    {/* Cocktail Recipes Modal */}
    <Modal
      visible={!!selectedSpirit}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setSelectedSpirit(null)}
    >
      {selectedSpirit && (
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedSpirit.name} Cocktails</Text>
            <Pressable onPress={() => setSelectedSpirit(null)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.modalInfo}>
              <Text style={styles.modalBrand}>{selectedSpirit.category}</Text>
              <Text style={styles.modalDescription}>{selectedSpirit.hero?.tagline || `${selectedSpirit.quickInfo?.style} • ${selectedSpirit.quickInfo?.origin}`}</Text>
              
              <Text style={styles.recipesHeader}>Signature Cocktails:</Text>
              {selectedSpirit.signatureCocktails?.map((cocktail: any, index: number) => (
                <View key={index} style={styles.recipeCard}>
                  <Image source={{ uri: cocktail.image }} style={styles.recipeImage} />
                  <Text style={styles.recipeName}>{cocktail.name}</Text>
                  <Text style={styles.recipeDescription}>{cocktail.description}</Text>
                  
                  <Text style={styles.ingredientsHeader}>Ingredients:</Text>
                  <Text style={styles.ingredientsText}>{cocktail.ingredients}</Text>
                  
                  <Pressable 
                    style={styles.moreDetailsButton}
                    onPress={() => {
                      setSelectedSpirit(null);
                      // Navigate to full brand details
                      if (selectedSpirit.tier === 'gold') {
                        nav.navigate('FeaturedSpirit', { spiritId: selectedSpirit.id, tier: selectedSpirit.tier });
                      } else {
                        nav.navigate('BrandDetail', { brandId: selectedSpirit.id });
                      }
                    }}
                  >
                    <Text style={styles.moreDetailsText}>View Full Brand Details</Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.accent} />
                  </Pressable>
                </View>
              ))}
              
              {selectedSpirit.tastingNotes && (
                <View style={styles.tastingNotesCard}>
                  <Text style={styles.tastingNotesHeader}>Tasting Notes:</Text>
                  <View style={styles.tastingNote}>
                    <Text style={styles.tastingNoteLabel}>Nose:</Text>
                    <Text style={styles.tastingNoteText}>{selectedSpirit.tastingNotes.nose}</Text>
                  </View>
                  <View style={styles.tastingNote}>
                    <Text style={styles.tastingNoteLabel}>Palate:</Text>
                    <Text style={styles.tastingNoteText}>{selectedSpirit.tastingNotes.palate}</Text>
                  </View>
                  <View style={styles.tastingNote}>
                    <Text style={styles.tastingNoteLabel}>Finish:</Text>
                    <Text style={styles.tastingNoteText}>{selectedSpirit.tastingNotes.finish}</Text>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      )}
    </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  cc: {
    paddingVertical: spacing(2),
  },

  // Navigation chips
  chipsContainer: {
    paddingTop: spacing(2),
    paddingBottom: spacing(1),
  },
  chipsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing(2),
    gap: spacing(1),
  },
  chip: {
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  chipText: {
    fontSize: 15,
    fontWeight: '700',
  },

  // Cards
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    marginHorizontal: spacing(2),
    marginBottom: spacing(2),
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  imageContainer: {
    position: 'relative',
  },
  hero: {
    width: '100%',
    height: 200,
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
  cardBody: {
    padding: spacing(2),
    gap: spacing(1),
  },
  h2: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: spacing(0.5),
  },
  muted: {
    color: colors.muted,
    lineHeight: 20,
  },
  kicker: {
    color: colors.muted,
    marginTop: spacing(0.5),
  },
  rowBetween: {
    padding: spacing(2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pillRight: {
    alignSelf: 'flex-end',
  },
  
  // Tier Badges
  tierBadge: {
    paddingHorizontal: spacing(0.75),
    paddingVertical: spacing(0.25),
    borderRadius: radii.sm,
    marginLeft: spacing(1),
  },
  goldBadge: {
    backgroundColor: colors.tierGold,
  },
  silverBadge: {
    backgroundColor: colors.tierSilver,
  },
  bronzeBadge: {
    backgroundColor: colors.tierBronze,
  },
  tierText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  goldText: {
    color: colors.tierTextOnGold,
  },
  silverText: {
    color: colors.tierTextOnSilver,
  },
  bronzeText: {
    color: colors.tierTextOnBronze,
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing(3),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    flex: 1,
  },
  modalContent: {
    flex: 1,
  },
  modalInfo: {
    padding: spacing(3),
  },
  modalBrand: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
    textTransform: 'uppercase',
    marginBottom: spacing(0.5),
  },
  modalDescription: {
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing(3),
  },
  recipesHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(2),
  },
  recipeCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing(3),
    marginBottom: spacing(3),
  },
  recipeImage: {
    width: '100%',
    height: 200,
    borderRadius: radii.md,
    marginBottom: spacing(2),
  },
  recipeName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing(1),
  },
  recipeDescription: {
    fontSize: 15,
    color: colors.subtext,
    marginBottom: spacing(2),
    fontStyle: 'italic',
  },
  ingredientsHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(1),
  },
  ingredientsText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginBottom: spacing(2),
  },
  moreDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(3),
    gap: spacing(1),
  },
  moreDetailsText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  tastingNotesCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing(3),
    marginTop: spacing(2),
  },
  tastingNotesHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(2),
  },
  tastingNote: {
    marginBottom: spacing(1.5),
  },
  tastingNoteLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: spacing(0.5),
  },
  tastingNoteText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});