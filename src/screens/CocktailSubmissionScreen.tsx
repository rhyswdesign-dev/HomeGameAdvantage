import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, fonts } from '../theme/tokens';

const { width } = Dimensions.get('window');

export default function CocktailSubmissionScreen() {
  const nav = useNavigation();
  const imageHeight = Math.round((width * 9) / 16);

  useLayoutEffect(() => {
    nav.setOptions({
      headerTitle: 'Cocktail Competition',
      headerLeft: () => (
        <Pressable hitSlop={12} onPress={() => nav.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
      ),
    });
  }, [nav]);

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: spacing(8) }}
        showsVerticalScrollIndicator={false}
      >
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1528465424850-54d22f092599?auto=format&fit=crop&w=1100&q=60' }} 
          style={[styles.headerImage, { height: imageHeight }]}
        />

        <View style={styles.contentContainer}>
          <Text style={styles.title}>Cocktail Submission Competition</Text>
          <Text style={styles.subtitle}>Powered by Untitled Champagne Lounge</Text>
          <Text style={styles.meta}>Event Date: TBD · Prize Pool: $1000</Text>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Event Details</Text>
            <Text style={styles.description}>
              Submit your most creative cocktail recipe for a chance to have it featured 
              at Untitled Champagne Lounge! Our panel of expert mixologists will judge 
              based on creativity, taste profile, and presentation.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Submission Requirements</Text>
            <Text style={styles.description}>
              • Original cocktail recipe with detailed measurements{'\n'}
              • High-quality photo of the finished cocktail{'\n'}
              • Brief story behind your creation{'\n'}
              • Must use at least one premium spirit
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Prizes</Text>
            <Text style={styles.description}>
              🥇 Winner: $500 + Recipe featured on menu for 3 months{'\n'}
              🥈 Runner-up: $300 + Professional mixology masterclass{'\n'}
              🥉 Third Place: $200 + Premium bar tool set
            </Text>
          </View>

          {/* Share Your Recipe Button */}
          <View style={styles.section}>
            <Pressable 
              style={styles.submitButton}
              onPress={() => {
                // Handle recipe submission
                console.log('Share Your Recipe pressed');
              }}
            >
              <Text style={styles.submitButtonText}>Share Your Recipe</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollView: {
    flex: 1,
  },
  headerImage: {
    width: '100%',
    borderBottomLeftRadius: radii.lg,
    borderBottomRightRadius: radii.lg,
  },
  contentContainer: {
    paddingHorizontal: spacing(2),
    paddingTop: spacing(2),
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.subtext,
    marginBottom: spacing(0.5),
  },
  meta: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: spacing(2),
  },
  section: {
    marginBottom: spacing(3),
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(1),
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  submitButton: {
    backgroundColor: colors.gold || '#E4933E',
    paddingVertical: spacing(1.5),
    paddingHorizontal: spacing(3),
    borderRadius: radii.lg,
    alignItems: 'center',
    marginTop: spacing(1),
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#120D07',
  },
});