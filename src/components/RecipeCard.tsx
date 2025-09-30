import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, fonts } from '../theme/tokens';

interface RecipeCardProps {
  recipe: {
    id: string;
    name: string;
    title?: string;
    subtitle?: string;
    description?: string;
    category?: string;
    image: string;
    difficulty: string;
    time: string;
    rating?: number;
    ingredients?: any[];
  };
  onPress: (recipe: any) => void;
  onSave?: (recipe: any) => void;
  onAddToCart?: (recipe: any) => void;
  onDelete?: (recipe: any) => void;
  isSaved?: boolean;
  showSaveButton?: boolean;
  showCartButton?: boolean;
  showDeleteButton?: boolean;
  style?: any;
}

export default function RecipeCard({
  recipe,
  onPress,
  onSave,
  onAddToCart,
  onDelete,
  isSaved = false,
  showSaveButton = true,
  showCartButton = true,
  showDeleteButton = false,
  style,
}: RecipeCardProps) {
  return (
    <TouchableOpacity
      style={[styles.verticalCard, style]}
      onPress={() => onPress(recipe)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: recipe.image }} style={styles.cocktailImage} />
      <View style={styles.cocktailInfo}>
        <Text style={styles.cardTitle}>{recipe.name || recipe.title}</Text>
        <Text style={styles.cardSub}>{recipe.subtitle || recipe.description}</Text>
        <View style={styles.cocktailMeta}>
          <Text style={styles.cocktailDifficulty}>{recipe.difficulty}</Text>
          <Text style={styles.cocktailTime}>{recipe.time}</Text>
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.recipeActions}>
        {/* Shopping cart button */}
        {showCartButton && onAddToCart && (
          <TouchableOpacity
            style={styles.shoppingCartButton}
            activeOpacity={0.7}
            onPress={(e) => {
              e.stopPropagation();
              onAddToCart(recipe);
            }}
          >
            <Ionicons
              name="basket"
              size={18}
              color={colors.white}
            />
          </TouchableOpacity>
        )}

        {/* Delete button */}
        {showDeleteButton && onDelete && (
          <TouchableOpacity
            style={styles.deleteButton}
            activeOpacity={0.7}
            onPress={(e) => {
              e.stopPropagation();
              onDelete(recipe);
            }}
          >
            <Ionicons name="trash-outline" size={18} color={colors.white} />
          </TouchableOpacity>
        )}

        {/* Save/Bookmark button */}
        {showSaveButton && onSave && (
          <TouchableOpacity
            style={styles.saveButton}
            activeOpacity={0.7}
            onPress={(e) => {
              e.stopPropagation();
              onSave(recipe);
            }}
          >
            <Ionicons
              name={isSaved ? "bookmark" : "bookmark-outline"}
              size={20}
              color={isSaved ? colors.accent : colors.text}
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Vertical Cards - Full width matching Old Fashioned styling
  verticalCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
    position: 'relative',
  },
  cocktailImage: {
    width: '100%',
    height: 160,
  },
  cocktailInfo: {
    padding: spacing(2),
  },
  cocktailMeta: {
    flexDirection: 'row',
    gap: spacing(2),
    marginTop: spacing(1),
  },
  cocktailDifficulty: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
  },
  cocktailTime: {
    fontSize: 12,
    color: colors.subtext,
    fontWeight: '600',
  },
  recipeActions: {
    position: 'absolute',
    top: spacing(1),
    right: spacing(1),
    flexDirection: 'row',
    gap: spacing(1),
  },
  shoppingCartButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  saveButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(220, 38, 38, 0.8)', // Red background for delete
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Text styles matching Old Fashioned card
  cardTitle: {
    color: colors.text,
    fontWeight: '800',
    fontSize: fonts.h3,
  },
  cardSub: {
    color: colors.muted,
    marginTop: 2,
  },
});