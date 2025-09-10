import React from 'react';
import { ScrollView } from 'react-native';
import RecipeCard from './RecipeCard';
import type { Recipe } from '../../types/spirit';

export default function RecipeCarousel({ recipes }: { recipes: Recipe[] }) {
  return (
    <ScrollView 
      horizontal 
      nestedScrollEnabled
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, gap: 20 }}
    >
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </ScrollView>
  );
}