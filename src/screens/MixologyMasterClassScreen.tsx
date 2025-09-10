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

export default function MixologyMasterClassScreen() {
  const nav = useNavigation();
  const imageHeight = Math.round((width * 9) / 16);

  useLayoutEffect(() => {
    nav.setOptions({
      headerTitle: 'Mixology Master Class',
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
          source={{ uri: 'https://images.unsplash.com/photo-1574671928146-5c89a22b2e85?auto=format&fit=crop&w=1100&q=60' }} 
          style={[styles.headerImage, { height: imageHeight }]}
        />

        <View style={styles.contentContainer}>
          <Text style={styles.title}>Mixology Master Class</Text>
          <Text style={styles.subtitle}>Powered by MixedMindStudios</Text>
          <Text style={styles.meta}>Duration: 3 hours · Class Size: Limited to 12</Text>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Class Overview</Text>
            <Text style={styles.description}>
              Learn from professional mixologists in this hands-on masterclass covering 
              advanced cocktail techniques, spirit knowledge, and presentation skills. 
              Perfect for aspiring bartenders and cocktail enthusiasts.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>What You'll Learn</Text>
            <Text style={styles.description}>
              • Advanced shaking and stirring techniques{'\n'}
              • Premium spirit selection and pairing{'\n'}
              • Molecular mixology basics{'\n'}
              • Garnish artistry and presentation{'\n'}
              • Cost management for home bars
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Class Includes</Text>
            <Text style={styles.description}>
              • All tools and ingredients provided{'\n'}
              • Recipe cards to take home{'\n'}
              • Light appetizers and tastings{'\n'}
              • Professional certificate of completion{'\n'}
              • 20% discount on premium bar tools
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Registration & Staking</Text>
            <Text style={styles.description}>
              To secure your spot and ensure serious commitment, registration requires staking 500 XP. 
              This XP stake will be returned upon completion of the full masterclass. If you leave early 
              or don't attend, the staked XP is forfeited to maintain class quality and availability 
              for other participants.{'\n\n'}
              
              <Text style={styles.stakingHighlight}>Why we stake XP:</Text>{'\n'}
              • Ensures committed participants and better learning environment{'\n'}
              • Prevents no-shows that waste limited class spots{'\n'}
              • Creates accountability for the full 3-hour experience{'\n'}
              • Your XP is fully refunded upon successful completion
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Prerequisites</Text>
            <Text style={styles.description}>
              Must be 21+ years old. Basic cocktail knowledge recommended but not required. 
              Perfect for beginners to intermediate level mixologists.
            </Text>
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
  stakingHighlight: {
    fontWeight: '700',
    color: colors.accent,
  },
});