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

interface VaultPack {
  id: string;
  title: string;
  brand: string;
  description: string;
  image: string;
  xpRequired: number;
  price?: number; // Optional price if it can be purchased
  value: string;
  contents: string[];
  type: 'premium' | 'exclusive' | 'limited';
  isUnlocked: boolean;
}

const vaultPacks: VaultPack[] = [
  {
    id: 'hendricks-exclusive',
    title: 'Hendricks Master Collection',
    brand: 'Hendricks',
    description: 'Exclusive access to rare botanicals and distillery secrets',
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=800&q=60',
    xpRequired: 2500,
    price: 150,
    value: '$300 Value',
    contents: ['Limited Edition Bottle', 'Tasting Notes', 'Cocktail Recipes', 'Brand History'],
    type: 'exclusive',
    isUnlocked: false,
  },
  {
    id: 'mixology-masterclass',
    title: 'Advanced Mixology Course',
    brand: 'MixMind Studios',
    description: 'Professional bartending techniques and trade secrets',
    image: 'https://images.unsplash.com/photo-1572297530709-bb185f063a3c?auto=format&fit=crop&w=800&q=60',
    xpRequired: 1500,
    value: 'XP Exclusive',
    contents: ['4-Hour Video Course', 'PDF Techniques Guide', 'Recipe Collection', 'Certification'],
    type: 'premium',
    isUnlocked: false,
  },
  {
    id: 'craft-tools-bundle',
    title: 'Professional Bar Tools Kit',
    brand: 'Legacy',
    description: 'Premium tools used by world-class bartenders',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=60',
    xpRequired: 800,
    price: 89,
    value: '$200 Value',
    contents: ['Japanese Jigger', 'Hawthorne Strainer', 'Bar Spoon', 'Muddler', 'Storage Case'],
    type: 'premium',
    isUnlocked: true, // User has enough XP for this one
  },
  {
    id: 'cocktail-ingredients',
    title: 'Rare Ingredients Box',
    brand: 'Artisan Spirits',
    description: 'Hard-to-find bitters, syrups, and garnish essentials',
    image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=60',
    xpRequired: 1200,
    price: 75,
    value: '$120 Value',
    contents: ['Cardamom Bitters', 'Lavender Syrup', 'Smoked Salt', 'Dehydrated Citrus', 'Recipe Cards'],
    type: 'limited',
    isUnlocked: false,
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

export default function VaultScreen() {
  const [selectedPack, setSelectedPack] = useState<VaultPack | null>(null);
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
      title: 'Vault',
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'exclusive': return colors.gold;
      case 'premium': return colors.accent;
      case 'limited': return '#9C27B0';
      default: return colors.subtext;
    }
  };

  const handleUnlock = (pack: VaultPack) => {
    if (pack.isUnlocked) {
      Alert.alert('Already Unlocked', 'This pack is already available to you!');
      return;
    }

    if (userXP >= pack.xpRequired) {
      Alert.alert(
        'Unlock Pack',
        `Unlock ${pack.title} for ${pack.xpRequired} XP?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Unlock', 
            onPress: () => {
              // Here you would deduct XP and unlock the pack
              Alert.alert('Success!', `${pack.title} has been unlocked!`);
            }
          }
        ]
      );
    } else {
      const xpNeeded = pack.xpRequired - userXP;
      Alert.alert(
        'Insufficient XP', 
        `You need ${xpNeeded} more XP to unlock this pack. Complete more challenges and lessons to earn XP!`
      );
    }
  };

  const handlePurchase = (pack: VaultPack) => {
    if (!pack.price) return;
    
    Alert.alert(
      'Purchase Pack',
      `Purchase ${pack.title} for $${pack.price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Purchase', 
          onPress: () => {
            Alert.alert('Success!', `${pack.title} has been purchased and unlocked!`);
          }
        }
      ]
    );
  };

  const renderPackCard = (pack: VaultPack) => (
    <Pressable
      key={pack.id}
      style={[
        styles.packCard,
        !pack.isUnlocked && userXP < pack.xpRequired && styles.lockedCard
      ]}
      onPress={() => setSelectedPack(pack)}
    >
      <View style={styles.packImageContainer}>
        <Image source={{ uri: pack.image }} style={styles.packImage} />
        {!pack.isUnlocked && userXP < pack.xpRequired && (
          <View style={styles.lockOverlay}>
            <Ionicons name="lock-closed" size={24} color={colors.white} />
          </View>
        )}
        <View style={[styles.typeBadge, { backgroundColor: getTypeColor(pack.type) }]}>
          <Text style={styles.typeBadgeText}>{pack.type.toUpperCase()}</Text>
        </View>
        <Pressable 
          style={styles.saveButton} 
          onPress={() => toggleSavedVaultItem({
            id: pack.id,
            name: pack.title,
            subtitle: pack.brand,
            image: pack.image
          })}
          hitSlop={12}
        >
          <Ionicons 
            name={isVaultItemSaved(pack.id) ? "bookmark" : "bookmark-outline"} 
            size={20} 
            color={isVaultItemSaved(pack.id) ? colors.accent : colors.text} 
          />
        </Pressable>
      </View>
      
      <View style={styles.packContent}>
        <Text style={styles.packBrand}>{pack.brand}</Text>
        <Text style={styles.packTitle}>{pack.title}</Text>
        <Text style={styles.packDescription} numberOfLines={2}>
          {pack.description}
        </Text>
        
        <View style={styles.packFooter}>
          <View style={styles.xpRequirement}>
            <MaterialCommunityIcons name="star" size={16} color={colors.gold} />
            <Text style={styles.xpText}>{pack.xpRequired} XP</Text>
          </View>
          <Text style={styles.packValue}>{pack.value}</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          {pack.isUnlocked ? (
            <Pressable style={[styles.unlockButton, styles.unlockedButton]}>
              <Ionicons name="checkmark-circle" size={20} color={colors.white} />
              <Text style={styles.unlockButtonText}>Unlocked</Text>
            </Pressable>
          ) : userXP >= pack.xpRequired ? (
            <Pressable 
              style={styles.unlockButton}
              onPress={() => handleUnlock(pack)}
            >
              <MaterialCommunityIcons name="star" size={20} color={colors.white} />
              <Text style={styles.unlockButtonText}>Unlock</Text>
            </Pressable>
          ) : (
            <View style={styles.buttonRow}>
              <Pressable 
                style={[styles.unlockButton, styles.lockedButton]}
                onPress={() => handleUnlock(pack)}
              >
                <Ionicons name="lock-closed" size={16} color={colors.white} />
                <Text style={styles.lockedButtonText}>
                  {pack.xpRequired - userXP} XP needed
                </Text>
              </Pressable>
              {pack.price && (
                <Pressable 
                  style={styles.purchaseButton}
                  onPress={() => handlePurchase(pack)}
                >
                  <Text style={styles.purchaseButtonText}>${pack.price}</Text>
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
          <Text style={styles.sectionTitle}>Vault</Text>
          <Text style={styles.sectionSubtitle}>Exclusive brand content</Text>
          <View style={styles.xpBalance}>
            <MaterialCommunityIcons name="star" size={20} color={colors.gold} />
            <Text style={styles.xpBalanceText}>{userXP} XP</Text>
          </View>
        </View>

        {/* Vault Packs */}
        <View style={styles.packsContainer}>
          {vaultPacks.map(renderPackCard)}
        </View>
      </ScrollView>

      {/* Pack Detail Modal */}
      <Modal
        visible={!!selectedPack}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedPack(null)}
      >
        {selectedPack && (
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedPack.title}</Text>
              <Pressable onPress={() => setSelectedPack(null)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <Image source={{ uri: selectedPack.image }} style={styles.modalImage} />
              
              <View style={styles.modalInfo}>
                <Text style={styles.modalBrand}>{selectedPack.brand}</Text>
                <Text style={styles.modalDescription}>{selectedPack.description}</Text>
                
                <Text style={styles.contentsHeader}>What's Included:</Text>
                {selectedPack.contents.map((item, index) => (
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
  xpBalance: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
    borderRadius: radii.md,
    gap: spacing(0.5),
    alignSelf: 'flex-start',
    marginTop: spacing(1),
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