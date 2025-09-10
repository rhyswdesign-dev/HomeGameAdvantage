import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import type { Recipe } from '../../types/spirit';

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <View style={s.card}>
      <Image source={{ uri: recipe.image }} style={s.image} />
      <View style={s.content}>
        <Text style={s.name}>{recipe.name}</Text>
        <View style={s.ingredients}>
          {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
            <Text key={`${recipe.id}-ingredient-${index}`} style={s.ingredient}>
              • {ingredient}
            </Text>
          ))}
          {recipe.ingredients.length > 3 && (
            <Text style={s.moreIngredients}>
              +{recipe.ingredients.length - 3} more
            </Text>
          )}
        </View>
        {recipe.glassware && (
          <Text style={s.glassware}>Serve in: {recipe.glassware}</Text>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    width: 240,
    backgroundColor: '#2B231C',
    borderRadius: 18,
    overflow: 'hidden',
    marginRight: 16
  },
  image: {
    width: '100%',
    height: 160
  },
  content: {
    padding: 16
  },
  name: {
    color: '#F4ECE4',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8
  },
  ingredients: {
    marginBottom: 8
  },
  ingredient: {
    color: '#C9BEB3',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 2
  },
  moreIngredients: {
    color: '#E58B2B',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4
  },
  glassware: {
    color: '#E58B2B',
    fontSize: 12,
    fontWeight: '600'
  }
});