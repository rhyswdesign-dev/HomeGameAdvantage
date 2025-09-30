import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSavedItems } from '../../hooks/useSavedItems';
import RecipeCard from '../RecipeCard';
import { createRecipeCardProps } from '../../utils/recipeActions';
import type { Recipe } from '../../types/spirit';

interface SpiritRecipeCardProps {
  recipe: Recipe;
  showSaveButton?: boolean;
  showCartButton?: boolean;
}

export default function SpiritRecipeCard({
  recipe,
  showSaveButton = true,
  showCartButton = false
}: SpiritRecipeCardProps) {
  const navigation = useNavigation();
  const { toggleSavedCocktail, isCocktailSaved } = useSavedItems();

  // Convert Spirit Recipe format to standard recipe format
  const standardRecipe = {
    id: recipe.id,
    name: recipe.name,
    subtitle: recipe.glassware ? `Serve in: ${recipe.glassware}` : undefined,
    description: recipe.ingredients.slice(0, 3).join(' • ') +
                (recipe.ingredients.length > 3 ? ` +${recipe.ingredients.length - 3} more` : ''),
    image: recipe.image,
    difficulty: 'Medium', // Default since Spirit recipes don't have difficulty
    time: '5 min', // Default since Spirit recipes don't have time
    ingredients: recipe.ingredients,
  };

  const cardProps = createRecipeCardProps(standardRecipe, navigation, {
    toggleSavedCocktail,
    isCocktailSaved,
    showSaveButton,
    showCartButton,
    showDeleteButton: false,
  });

  return (
    <RecipeCard
      {...cardProps}
      style={{ width: 240, marginRight: 16 }} // Maintain carousel sizing
    />
  );
}

