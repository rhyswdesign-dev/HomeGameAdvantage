import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
} from 'react-native';
import { colors, spacing, radii, fonts } from '../theme/tokens';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

export default function RecipeDetailScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const recipe = (route.params as any)?.recipe;

  if (!recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
          <Text style={styles.errorText}>Recipe not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => nav.goBack()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleShare = async () => {
    try {
      let message = `Check out this ${recipe.name || recipe.title} recipe!`;
      if (recipe.description) {
        message += ` ${recipe.description}`;
      }
      if (recipe.sourceUrl) {
        message += ` Source: ${recipe.sourceUrl}`;
      }

      await Share.share({
        message,
        title: `${recipe.name || recipe.title} Recipe`,
      });
    } catch (error) {
      console.error('Error sharing recipe:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Recipe Image */}
        {(recipe.image || recipe.imageUrl) && (
          <Image
            source={{ uri: recipe.image || recipe.imageUrl }}
            style={styles.recipeImage}
          />
        )}

        {/* Recipe Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{recipe.name || recipe.title}</Text>

          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color={colors.accent} />
          </TouchableOpacity>
        </View>

        {/* Recipe Stats */}
        {(recipe.difficulty || recipe.time || recipe.rating) && (
          <View style={styles.statsContainer}>
            {recipe.time && (
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={16} color={colors.accent} />
                <Text style={styles.statText}>{recipe.time}</Text>
              </View>
            )}
            {recipe.difficulty && (
              <View style={styles.statItem}>
                <Ionicons name="bar-chart-outline" size={16} color={colors.accent} />
                <Text style={styles.statText}>{recipe.difficulty}</Text>
              </View>
            )}
            {recipe.rating && (
              <View style={styles.statItem}>
                <Ionicons name="star" size={16} color={colors.gold} />
                <Text style={styles.statText}>{recipe.rating}</Text>
              </View>
            )}
          </View>
        )}

        {/* Recipe Description */}
        {recipe.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{recipe.description}</Text>
          </View>
        )}

        {/* Source URL */}
        {recipe.sourceUrl && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Source</Text>
            <Text style={styles.sourceText}>{recipe.sourceUrl}</Text>
          </View>
        )}

        {/* Ingredients/Tags */}
        {(recipe.ingredients || recipe.tags) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {recipe.ingredients ? 'Ingredients' : 'Tags'}
            </Text>
            <View style={styles.tagsContainer}>
              {(recipe.ingredients || recipe.tags || []).map((item: string, index: number) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Folder */}
        {recipe.folder && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Folder</Text>
            <View style={styles.folderContainer}>
              <Ionicons name="folder-outline" size={16} color={colors.accent} />
              <Text style={styles.folderText}>{recipe.folder}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
  },
  recipeImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: spacing(3),
    paddingBottom: spacing(2),
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginRight: spacing(2),
  },
  shareButton: {
    padding: spacing(1),
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing(3),
    paddingBottom: spacing(2),
    gap: spacing(3),
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(0.5),
  },
  statText: {
    fontSize: 14,
    color: colors.subtext,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(1),
  },
  descriptionText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  sourceText: {
    fontSize: 16,
    color: colors.accent,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(1),
  },
  tag: {
    backgroundColor: colors.card,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(0.5),
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.line,
  },
  tagText: {
    fontSize: 14,
    color: colors.text,
  },
  folderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1),
  },
  folderText: {
    fontSize: 16,
    color: colors.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing(4),
  },
  errorText: {
    fontSize: 18,
    color: colors.error,
    marginVertical: spacing(2),
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing(4),
    paddingVertical: spacing(2),
    borderRadius: radii.md,
    marginTop: spacing(2),
  },
  backButtonText: {
    color: colors.bg,
    fontSize: 16,
    fontWeight: '600',
  },
});