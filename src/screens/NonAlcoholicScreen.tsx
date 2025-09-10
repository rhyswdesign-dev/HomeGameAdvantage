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

// Sample non-alcoholic beverages data with recipes
const nonAlcoholicBeverages = [
  {
    id: 'seedlip-garden-108',
    name: 'Seedlip Garden 108',
    category: 'Non-Alcoholic Gin',
    region: 'United Kingdom',
    tier: 'gold',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=1200&auto=format&fit=crop',
    tagline: 'Herbal & Garden Fresh',
    recipes: [
      {
        name: 'Garden 108 & Tonic',
        ingredients: ['2 oz Seedlip Garden 108', '4 oz Premium tonic water', '3 cucumber slices', 'Fresh mint sprig', 'Lime wheel'],
        instructions: 'Fill glass with ice. Add Seedlip Garden 108. Top with tonic water. Garnish with cucumber, mint, and lime.',
        glassware: 'Highball glass'
      },
      {
        name: 'Herbaceous Spritz',
        ingredients: ['1.5 oz Seedlip Garden 108', '3 oz Elderflower sparkling water', '0.5 oz Fresh lime juice', 'Rosemary sprig', 'Grapefruit peel'],
        instructions: 'Combine in wine glass over ice. Stir gently. Express grapefruit oils and garnish with rosemary.',
        glassware: 'Wine glass'
      }
    ]
  },
  {
    id: 'lyre-s-american-malt',
    name: "Lyre's American Malt",
    category: 'Non-Alcoholic Whiskey',
    region: 'Australia',
    tier: 'silver',
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=1200&auto=format&fit=crop',
    tagline: 'Rich & Smoky',
    recipes: [
      {
        name: 'Smokeless Old Fashioned',
        ingredients: ['2 oz Lyre\'s American Malt', '0.25 oz Maple syrup', '2 dashes Orange bitters', '1 dash Angostura bitters', 'Orange peel', 'Luxardo cherry'],
        instructions: 'Stir all ingredients with ice. Strain over large ice cube. Express orange oils and garnish with cherry.',
        glassware: 'Old Fashioned glass'
      },
      {
        name: 'Virgin Manhattan',
        ingredients: ['2 oz Lyre\'s American Malt', '1 oz Non-alcoholic sweet vermouth', '2 dashes Angostura bitters', 'Luxardo cherry'],
        instructions: 'Stir with ice and strain into chilled glass. Garnish with cherry.',
        glassware: 'Coupe glass'
      }
    ]
  },
  {
    id: 'ritual-zero-proof-gin',
    name: 'Ritual Zero Proof Gin',
    category: 'Non-Alcoholic Gin',
    region: 'United States',
    tier: 'bronze',
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=1200&auto=format&fit=crop',
    tagline: 'Juniper Forward',
    recipes: [
      {
        name: 'Zero Proof Gin & Tonic',
        ingredients: ['2 oz Ritual Zero Proof Gin', '4 oz Tonic water', 'Lime wheel', 'Juniper berries'],
        instructions: 'Build in glass over ice. Stir gently. Garnish with lime and juniper berries.',
        glassware: 'Highball glass'
      },
      {
        name: 'Mock Negroni',
        ingredients: ['1 oz Ritual Zero Proof Gin', '1 oz Non-alcoholic Aperol', '1 oz Non-alcoholic sweet vermouth', 'Orange wheel'],
        instructions: 'Stir with ice and strain over fresh ice. Garnish with orange wheel.',
        glassware: 'Old Fashioned glass'
      }
    ]
  },
  {
    id: 'ghia-aperitif',
    name: 'Ghia Aperitif',
    category: 'Non-Alcoholic Aperitif',
    region: 'United States',
    tier: 'gold',
    image: 'https://images.unsplash.com/photo-1574671928146-5c89a22b2e85?q=80&w=1200&auto=format&fit=crop',
    tagline: 'Mediterranean Botanicals',
    recipes: [
      {
        name: 'Ghia Spritz',
        ingredients: ['2 oz Ghia Aperitif', '3 oz Sparkling water', '1 oz Fresh grapefruit juice', 'Rosemary sprig', 'Grapefruit wheel'],
        instructions: 'Build in wine glass over ice. Top with sparkling water. Garnish with grapefruit and rosemary.',
        glassware: 'Wine glass'
      },
      {
        name: 'Mediterranean Mule',
        ingredients: ['2 oz Ghia Aperitif', '0.5 oz Fresh lime juice', '4 oz Ginger beer', 'Lime wheel', 'Fresh thyme'],
        instructions: 'Combine in copper mug with ice. Top with ginger beer. Garnish with lime and thyme.',
        glassware: 'Copper mug'
      }
    ]
  },
];

const kombucha = [
  {
    id: 'gt-s-gingerade',
    name: "GT's Gingerade",
    category: 'Kombucha',
    region: 'United States',
    tier: 'bronze',
    image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?q=80&w=1200&auto=format&fit=crop',
    tagline: 'Probiotic & Refreshing',
    recipes: [
      {
        name: 'Ginger Kombucha Mule',
        ingredients: ['6 oz GT\'s Gingerade', '1 oz Fresh lime juice', '0.5 oz Agave syrup', 'Mint sprig', 'Candied ginger', 'Lime wheel'],
        instructions: 'Combine lime juice and agave in mug. Add ice and kombucha. Stir gently. Garnish with mint, ginger, and lime.',
        glassware: 'Copper mug'
      },
      {
        name: 'Probiotic Punch',
        ingredients: ['4 oz GT\'s Gingerade', '2 oz Fresh pineapple juice', '1 oz Coconut water', 'Fresh basil leaves', 'Pineapple wedge'],
        instructions: 'Muddle basil gently in glass. Add juices and ice. Top with kombucha. Garnish with pineapple.',
        glassware: 'Highball glass'
      }
    ]
  },
  {
    id: 'health-ade-pink-lady-apple',
    name: 'Health-Ade Pink Lady Apple',
    category: 'Kombucha',
    region: 'United States',
    tier: 'silver',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=1200&auto=format&fit=crop',
    tagline: 'Crisp & Fruity',
    recipes: [
      {
        name: 'Apple Cinnamon Sparkler',
        ingredients: ['6 oz Health-Ade Pink Lady Apple', '1 oz Fresh lemon juice', '0.5 oz Cinnamon simple syrup', 'Apple slice', 'Cinnamon stick'],
        instructions: 'Combine lemon juice and syrup in glass. Add ice and kombucha. Stir gently. Garnish with apple and cinnamon.',
        glassware: 'Wine glass'
      },
      {
        name: 'Orchard Refresher',
        ingredients: ['5 oz Health-Ade Pink Lady Apple', '1 oz Elderflower cordial', '2 oz Sparkling water', 'Fresh thyme', 'Green apple fan'],
        instructions: 'Build in glass over ice. Add cordial, then kombucha, top with sparkling water. Garnish with thyme and apple.',
        glassware: 'Highball glass'
      }
    ]
  },
];

export default function NonAlcoholicScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [active, setActive] = useState<string>('NonAlcoholic');
  const [selectedBeverage, setSelectedBeverage] = useState<any>(null);
  const { toggleSavedDrink, isDrinkSaved } = useSavedItems();

  const goto = (key: string) => {
    setActive(key);
    try {
      if (key === 'Home') {
        nav.goBack();
      } else if (key === 'NonAlcoholic') {
        // Already on NonAlcoholic screen, do nothing
        return;
      } else if (key) {
        nav.navigate(key as never);
      }
    } catch (error) {
      console.log('Navigation error:', error);
    }
  };

  const onExploreBrand = (beverage: any) => {
    setSelectedBeverage(beverage);
  };

  useLayoutEffect(() => {
    nav.setOptions({
      title: 'Non-Alcoholic',
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

        {/* Spirit Alternatives */}
        <SectionHeader title="Spirit Alternatives" />
        {nonAlcoholicBeverages.map((beverage) => (
          <View key={beverage.id} style={styles.card}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: beverage.image }} style={styles.hero} />
              <Pressable 
                style={styles.saveButton} 
                onPress={() => toggleSavedDrink({
                  id: beverage.id,
                  name: beverage.name,
                  subtitle: beverage.category || beverage.region,
                  image: beverage.image
                })}
                hitSlop={12}
              >
                <Ionicons 
                  name={isDrinkSaved(beverage.id) ? "bookmark" : "bookmark-outline"} 
                  size={20} 
                  color={isDrinkSaved(beverage.id) ? colors.accent : colors.text} 
                />
              </Pressable>
            </View>
            <View style={styles.rowBetween}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing(0.5) }}>
                  <Text style={styles.h2}>{beverage.name}</Text>
                  <View style={[
                    styles.tierBadge,
                    beverage.tier === 'gold' && styles.goldBadge,
                    beverage.tier === 'silver' && styles.silverBadge,
                    beverage.tier === 'bronze' && styles.bronzeBadge
                  ].filter(Boolean)}>
                    <Text style={[
                      styles.tierText,
                      beverage.tier === 'gold' && styles.goldText,
                      beverage.tier === 'silver' && styles.silverText,
                      beverage.tier === 'bronze' && styles.bronzeText
                    ].filter(Boolean)}>{beverage.tier.toUpperCase()}</Text>
                  </View>
                </View>
                <Text style={styles.kicker}>
                  {beverage.tagline || `${beverage.category} • ${beverage.region}`}
                </Text>
              </View>
              <PillButton
                title="Explore"
                onPress={() => onExploreBrand(beverage)}
                style={styles.pillRight}
              />
            </View>
          </View>
        ))}

        {/* Kombucha & Fermented */}
        <SectionHeader title="Kombucha & Fermented" />
        {kombucha.map((beverage) => (
          <View key={beverage.id} style={styles.card}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: beverage.image }} style={styles.hero} />
              <Pressable 
                style={styles.saveButton} 
                onPress={() => toggleSavedDrink({
                  id: beverage.id,
                  name: beverage.name,
                  subtitle: beverage.category || beverage.region,
                  image: beverage.image
                })}
                hitSlop={12}
              >
                <Ionicons 
                  name={isDrinkSaved(beverage.id) ? "bookmark" : "bookmark-outline"} 
                  size={20} 
                  color={isDrinkSaved(beverage.id) ? colors.accent : colors.text} 
                />
              </Pressable>
            </View>
            <View style={styles.rowBetween}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing(0.5) }}>
                  <Text style={styles.h2}>{beverage.name}</Text>
                  <View style={[
                    styles.tierBadge,
                    beverage.tier === 'gold' && styles.goldBadge,
                    beverage.tier === 'silver' && styles.silverBadge,
                    beverage.tier === 'bronze' && styles.bronzeBadge
                  ].filter(Boolean)}>
                    <Text style={[
                      styles.tierText,
                      beverage.tier === 'gold' && styles.goldText,
                      beverage.tier === 'silver' && styles.silverText,
                      beverage.tier === 'bronze' && styles.bronzeText
                    ].filter(Boolean)}>{beverage.tier.toUpperCase()}</Text>
                  </View>
                </View>
                <Text style={styles.kicker}>
                  {beverage.tagline || `${beverage.category} • ${beverage.region}`}
                </Text>
              </View>
              <PillButton
                title="Explore"
                onPress={() => onExploreBrand(beverage)}
                style={styles.pillRight}
              />
            </View>
          </View>
        ))}

        {/* bottom spacer so tab bar never overlaps last card */}
        <View style={{ height: spacing(6) }} />
      </ScrollView>

      {/* Recipes Modal */}
      <Modal
        visible={!!selectedBeverage}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedBeverage(null)}
      >
        {selectedBeverage && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedBeverage.name} Recipes</Text>
              <Pressable onPress={() => setSelectedBeverage(null)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <View style={styles.modalInfo}>
                <Text style={styles.modalBrand}>{selectedBeverage.category}</Text>
                <Text style={styles.modalDescription}>{selectedBeverage.tagline}</Text>
                
                <Text style={styles.recipesHeader}>Featured Recipes:</Text>
                {selectedBeverage.recipes?.map((recipe: any, index: number) => (
                  <View key={index} style={styles.recipeCard}>
                    <Text style={styles.recipeName}>{recipe.name}</Text>
                    <Text style={styles.glassware}>Served in: {recipe.glassware}</Text>
                    
                    <Text style={styles.ingredientsHeader}>Ingredients:</Text>
                    {recipe.ingredients.map((ingredient: string, i: number) => (
                      <View key={i} style={styles.ingredientItem}>
                        <Ionicons name="ellipse" size={8} color={colors.accent} />
                        <Text style={styles.ingredientText}>{ingredient}</Text>
                      </View>
                    ))}
                    
                    <Text style={styles.instructionsHeader}>Instructions:</Text>
                    <Text style={styles.instructionsText}>{recipe.instructions}</Text>
                  </View>
                ))}
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
  recipeName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  glassware: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '600',
    marginBottom: spacing(2),
  },
  ingredientsHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(1),
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing(0.5),
    paddingLeft: spacing(1),
  },
  ingredientText: {
    fontSize: 15,
    color: colors.text,
    marginLeft: spacing(1.5),
    flex: 1,
  },
  instructionsHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing(2),
    marginBottom: spacing(1),
  },
  instructionsText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
});