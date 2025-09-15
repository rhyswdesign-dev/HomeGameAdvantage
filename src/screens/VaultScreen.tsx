import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../theme/tokens';
import { useUser } from '../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import PillButton from '../components/PillButton';
import { useSavedItems } from '../hooks/useSavedItems';

interface Drop {
  id: string;
  title: string;
  brand: string;
  description: string;
  image: string;
  xpRequired: number;
  price?: number;
  value: string;
  contents: string[];
  category: 'mystery-drop' | 'cocktail-kit' | 'bar-tools' | 'mixology-book' | 'glassware' | 'premium-spirits' | 'artwork' | 'home-decor' | 'brand-merch' | 'event-access';
  type: 'new' | 'popular' | 'limited';
  isUnlocked: boolean;
  releaseDate: string;
}

const latestDrops: Drop[] = [
  {
    id: 'mystery-box-winter',
    title: 'Winter Mystery Drop',
    brand: 'HomeGameAdvantage',
    description: 'Curated surprise collection of premium bar essentials and spirits',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=60',
    xpRequired: 2000,
    price: 199,
    value: '$350+ Value',
    contents: ['Mystery Premium Spirit', 'Artisan Cocktail Tools', 'Recipe Collection', 'Surprise Garnishes'],
    category: 'mystery-drop',
    type: 'new',
    isUnlocked: false,
    releaseDate: '2025-03-15',
  },
  {
    id: 'negroni-kit-deluxe',
    title: 'Deluxe Negroni Kit',
    brand: 'Aperitivo Co.',
    description: 'Everything you need to craft the perfect Negroni at home',
    image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=800&q=60',
    xpRequired: 1500,
    price: 149,
    value: '$200 Value',
    contents: ['Premium Gin (50ml)', 'Artisan Vermouth', 'House Bitters', 'Crystal Glasses', 'Recipe Cards'],
    category: 'cocktail-kit',
    type: 'popular',
    isUnlocked: false,
    releaseDate: '2025-03-10',
  },
  {
    id: 'japanese-bar-tools',
    title: 'Japanese Bar Master Set',
    brand: 'Shokunin Tools',
    description: 'Handcrafted Japanese bar tools used by Tokyo\'s finest bartenders',
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=800&q=60',
    xpRequired: 1200,
    price: 289,
    value: '$400 Value',
    contents: ['Handforged Jigger', 'Damascus Bar Spoon', 'Precision Strainer', 'Bamboo Storage Box'],
    category: 'bar-tools',
    type: 'limited',
    isUnlocked: false,
    releaseDate: '2025-03-08',
  },
  {
    id: 'crystal-glassware-set',
    title: 'Crystal Glassware Collection',
    brand: 'Bohemia Crystal',
    description: 'Hand-blown crystal glasses for the ultimate cocktail experience',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=60',
    xpRequired: 800,
    price: 125,
    value: '$180 Value',
    contents: ['2x Old Fashioned Glasses', '2x Coupe Glasses', '2x Highball Glasses', 'Gift Box'],
    category: 'glassware',
    type: 'new',
    isUnlocked: true, // User has enough XP
    releaseDate: '2025-03-12',
  },
];

const chips: Array<{ key: string; label: string }> = [
  { key: 'Home', label: 'Home' },
  { key: 'Spirits', label: 'Spirits' },
  { key: 'NonAlcoholic', label: 'Non-Alcoholic' },
  { key: 'Bars', label: 'Bars' },
  { key: 'Events', label: 'Events' },
  { key: 'Games', label: 'Games' },
  { key: 'Vault', label: 'Vault' },
];

const categories = [
  { id: 'mystery-drop', name: 'Mystery Drop', icon: 'gift-outline', color: '#FF6B6B' },
  { id: 'cocktail-kit', name: 'Cocktail Kit', icon: 'wine-outline', color: '#4ECDC4' },
  { id: 'bar-tools', name: 'Bar Tools', icon: 'hammer-outline', color: '#45B7D1' },
  { id: 'mixology-book', name: 'Mixology Book', icon: 'book-outline', color: '#96CEB4' },
  { id: 'glassware', name: 'Glassware', icon: 'wine-outline', color: '#FFEAA7' },
  { id: 'premium-spirits', name: 'Premium Spirits', icon: 'bottle-outline', color: '#DDA0DD' },
  { id: 'artwork', name: 'Artwork', icon: 'image-outline', color: '#98D8C8' },
  { id: 'home-decor', name: 'Home Decor', icon: 'home-outline', color: '#F7DC6F' },
  { id: 'brand-merch', name: 'Brand Merch', icon: 'shirt-outline', color: '#BB8FCE' },
  { id: 'event-access', name: 'Event Access', icon: 'ticket-outline', color: '#85C1E9' },
];

export default function VaultScreen() {
  const [selectedDrop, setSelectedDrop] = useState<Drop | null>(null);
  const [active, setActive] = useState<string>('Vault');
  const { user } = useUser();
  const userXP = user.xp;
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { toggleSavedVaultItem, isVaultItemSaved } = useSavedItems();

  const goto = (key: string) => {
    setActive(key);
    try { 
      if (key === 'Home') {
        nav.goBack();
      } else if (key) {
        nav.navigate(key as never);
      }
    } catch {}
  };

  useLayoutEffect(() => {
    nav.setOptions({
      title: 'Drops',
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { color: colors.text, fontWeight: '900' },
      headerShadowVisible: false,
      headerLeft: () => (
        <Pressable hitSlop={12} onPress={() => nav.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
      ),
    });
  }, [nav]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'new': return colors.accent;
      case 'popular': return colors.gold;
      case 'limited': return '#9C27B0';
      default: return colors.subtext;
    }
  };

  const handleUnlock = (drop: Drop) => {
    if (drop.isUnlocked) {
      Alert.alert('Already Unlocked', 'This drop is already available to you!');
      return;
    }

    if (userXP >= drop.xpRequired) {
      Alert.alert(
        'Unlock Drop',
        `Unlock ${drop.title} for ${drop.xpRequired} XP?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Unlock', 
            onPress: () => {
              Alert.alert('Success!', `${drop.title} has been unlocked!`);
            }
          }
        ]
      );
    } else {
      const xpNeeded = drop.xpRequired - userXP;
      Alert.alert(
        'Insufficient XP', 
        `You need ${xpNeeded} more XP to unlock this drop. Complete more challenges and lessons to earn XP!`
      );
    }
  };

  const handlePurchase = (drop: Drop) => {
    if (!drop.price) return;
    
    Alert.alert(
      'Purchase Drop',
      `Purchase ${drop.title} for $${drop.price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Purchase', 
          onPress: () => {
            Alert.alert('Success!', `${drop.title} has been purchased and unlocked!`);
          }
        }
      ]
    );
  };

  const renderDropCard = (drop: Drop) => (
    <Pressable
      key={drop.id}
      style={[
        styles.packCard,
        !drop.isUnlocked && userXP < drop.xpRequired && styles.lockedCard
      ]}
      onPress={() => setSelectedDrop(drop)}
    >
      <View style={styles.packImageContainer}>
        <Image source={{ uri: drop.image }} style={styles.packImage} />
        {!drop.isUnlocked && userXP < drop.xpRequired && (
          <View style={styles.lockOverlay}>
            <Ionicons name="lock-closed" size={24} color={colors.white} />
          </View>
        )}
        <View style={[styles.typeBadge, { backgroundColor: getTypeColor(drop.type) }]}>
          <Text style={styles.typeBadgeText}>{drop.type.toUpperCase()}</Text>
        </View>
        <Pressable 
          style={styles.saveButton} 
          onPress={() => toggleSavedVaultItem({
            id: drop.id,
            name: drop.title,
            subtitle: drop.brand,
            image: drop.image
          })}
          hitSlop={12}
        >
          <Ionicons 
            name={isVaultItemSaved(drop.id) ? "bookmark" : "bookmark-outline"} 
            size={20} 
            color={isVaultItemSaved(drop.id) ? colors.accent : colors.text} 
          />
        </Pressable>
      </View>
      
      <View style={styles.packContent}>
        <Text style={styles.packBrand}>{drop.brand}</Text>
        <Text style={styles.packTitle}>{drop.title}</Text>
        <Text style={styles.packDescription} numberOfLines={2}>
          {drop.description}
        </Text>
        
        <View style={styles.packFooter}>
          <View style={styles.xpRequirement}>
            <MaterialCommunityIcons name="star" size={16} color={colors.gold} />
            <Text style={styles.xpText}>{drop.xpRequired} XP</Text>
          </View>
          <Text style={styles.packValue}>{drop.value}</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          {drop.isUnlocked ? (
            <Pressable style={[styles.unlockButton, styles.unlockedButton]}>
              <Ionicons name="checkmark-circle" size={20} color={colors.white} />
              <Text style={styles.unlockButtonText}>Unlocked</Text>
            </Pressable>
          ) : userXP >= drop.xpRequired ? (
            <Pressable 
              style={styles.unlockButton}
              onPress={() => handleUnlock(drop)}
            >
              <MaterialCommunityIcons name="star" size={20} color={colors.white} />
              <Text style={styles.unlockButtonText}>Purchase</Text>
            </Pressable>
          ) : (
            <View style={styles.buttonRow}>
              <Pressable 
                style={[styles.unlockButton, styles.lockedButton]}
                onPress={() => handleUnlock(drop)}
              >
                <Ionicons name="lock-closed" size={16} color={colors.white} />
                <Text style={styles.lockedButtonText}>
                  {drop.xpRequired - userXP} XP needed
                </Text>
              </Pressable>
              {drop.price && (
                <Pressable 
                  style={styles.purchaseButton}
                  onPress={() => handlePurchase(drop)}
                >
                  <Text style={styles.purchaseButtonText}>${drop.price}</Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
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

        {/* XP Balance Section */}
        <View style={styles.xpBalanceSection}>
          <Text style={styles.sectionTitle}>Latest Drops</Text>
          <Text style={styles.sectionSubtitle}>Premium curated collections</Text>
          <View style={styles.balanceRow}>
            <View style={styles.xpBalance}>
              <MaterialCommunityIcons name="star" size={20} color={colors.gold} />
              <Text style={styles.xpBalanceText}>{userXP} XP</Text>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.headerActionsScroll}
              contentContainerStyle={styles.headerActions}
            >
              <Pressable 
                style={styles.browseCategoriesButton}
                onPress={() => nav.navigate('CategoriesList' as never)}
              >
                <Text style={styles.browseCategoriesText}>Browse Categories</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.accent} />
              </Pressable>
              
              <Pressable 
                style={styles.premiumButton}
                onPress={() => nav.navigate('Pricing' as never)}
              >
                <Ionicons name="star" size={16} color={colors.white} />
                <Text style={styles.premiumButtonText}>Premium</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>


        {/* Latest Drops */}
        <View style={styles.packsContainer}>
          <Text style={styles.dropsHeader}>Featured Drops</Text>
          {latestDrops.map(renderDropCard)}
        </View>
      </ScrollView>

      {/* Drop Detail Modal */}
      <Modal
        visible={!!selectedDrop}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedDrop(null)}
      >
        {selectedDrop && (
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedDrop.title}</Text>
              <Pressable onPress={() => setSelectedDrop(null)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <Image source={{ uri: selectedDrop.image }} style={styles.modalImage} />
              
              <View style={styles.modalInfo}>
                <Text style={styles.modalBrand}>{selectedDrop.brand}</Text>
                <Text style={styles.modalDescription}>{selectedDrop.description}</Text>
                
                <Text style={styles.contentsHeader}>What's Included:</Text>
                {selectedDrop.contents.map((item, index) => (
                  <View key={index} style={styles.contentItem}>
                    <Ionicons name="checkmark-circle" size={16} color={colors.accent} />
                    <Text style={styles.contentText}>{item}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  xpBalanceSection: {
    padding: spacing(2),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.subtext,
    marginTop: spacing(0.5),
  },
  packsContainer: {
    padding: spacing(3),
    gap: spacing(3),
  },
  dropsHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(2),
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing(1),
  },
  headerActionsScroll: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing(2),
    paddingRight: spacing(2),
  },
  xpBalance: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
    borderRadius: radii.md,
    gap: spacing(0.5),
  },
  browseCategoriesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
    borderRadius: radii.md,
    gap: spacing(0.5),
  },
  browseCategoriesText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  premiumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
    borderRadius: radii.md,
    gap: spacing(0.5),
  },
  premiumButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  xpBalanceText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  packCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  lockedCard: {
    opacity: 0.8,
  },
  packImageContainer: {
    position: 'relative',
    height: 200,
  },
  packImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.bg,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeBadge: {
    position: 'absolute',
    top: spacing(2),
    right: spacing(2),
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(0.5),
    borderRadius: radii.sm,
  },
  saveButton: {
    position: 'absolute',
    top: spacing(1),
    left: spacing(1),
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.white,
  },
  packContent: {
    padding: spacing(3),
  },
  packBrand: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
    textTransform: 'uppercase',
    marginBottom: spacing(0.5),
  },
  packTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing(1),
  },
  packDescription: {
    fontSize: 14,
    color: colors.subtext,
    lineHeight: 20,
    marginBottom: spacing(2),
  },
  packFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing(2),
  },
  xpRequirement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(0.5),
  },
  xpText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  packValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.accent,
  },
  buttonContainer: {
    marginTop: spacing(1),
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing(2),
  },
  unlockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(3),
    gap: spacing(1),
    flex: 1,
  },
  unlockedButton: {
    backgroundColor: colors.gold,
  },
  lockedButton: {
    backgroundColor: colors.subtext,
    flex: 2,
  },
  unlockButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  lockedButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  purchaseButton: {
    backgroundColor: colors.gold,
    borderRadius: radii.md,
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(3),
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  purchaseButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
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
  modalImage: {
    width: '100%',
    height: 300,
    backgroundColor: colors.bg,
  },
  modalInfo: {
    padding: spacing(3),
  },
  modalBrand: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
    textTransform: 'uppercase',
    marginBottom: spacing(1),
  },
  modalDescription: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: spacing(3),
  },
  contentsHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(2),
  },
  contentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(2),
    marginBottom: spacing(1.5),
  },
  contentText: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
  },
});