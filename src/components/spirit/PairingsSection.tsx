import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../../theme/tokens';
import type { PairingItem } from '../../types/spirit';

interface PairingsSectionProps {
  pairings: PairingItem[];
}

export default function PairingsSection({ pairings }: PairingsSectionProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food': return 'restaurant-outline';
      case 'cigar': return 'cloud-outline';
      case 'occasion': return 'calendar-outline';
      default: return 'star-outline';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Ionicons
        key={i}
        name={i < rating ? 'star' : 'star-outline'}
        size={14}
        color={i < rating ? colors.gold : colors.subtext}
      />
    ));
  };

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {pairings.map((pairing) => (
        <View key={pairing.id} style={styles.pairingCard}>
          <Image source={{ uri: pairing.image }} style={styles.pairingImage} />
          
          <View style={styles.pairingContent}>
            <View style={styles.pairingHeader}>
              <Ionicons 
                name={getCategoryIcon(pairing.category) as any} 
                size={16} 
                color={colors.accent} 
              />
              <Text style={styles.categoryText}>
                {pairing.category.charAt(0).toUpperCase() + pairing.category.slice(1)}
              </Text>
            </View>
            
            <Text style={styles.pairingName}>{pairing.name}</Text>
            <Text style={styles.pairingDescription} numberOfLines={2}>
              {pairing.description}
            </Text>
            
            <View style={styles.ratingContainer}>
              <View style={styles.starsRow}>
                {renderStars(pairing.rating)}
              </View>
              <Text style={styles.ratingText}>{pairing.rating}/5</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing(2),
    gap: spacing(2),
  },
  pairingCard: {
    width: 200,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  pairingImage: {
    width: '100%',
    height: 120,
    backgroundColor: colors.bg,
  },
  pairingContent: {
    padding: spacing(2),
  },
  pairingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing(1),
    gap: spacing(0.5),
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
    textTransform: 'uppercase',
  },
  pairingName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(1),
  },
  pairingDescription: {
    fontSize: 12,
    color: colors.subtext,
    lineHeight: 16,
    marginBottom: spacing(1.5),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
});