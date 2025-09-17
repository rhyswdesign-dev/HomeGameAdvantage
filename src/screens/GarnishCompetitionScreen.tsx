import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
  Share,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, radii, fonts } from '../theme/tokens';
import { useSavedItems } from '../hooks/useSavedItems';

const { width } = Dimensions.get('window');

const competitionData = {
  id: 'garnish-competition-jan-2025',
  title: 'Garnish of the Month Competition',
  subtitle: 'Powered by Legacy',
  image: 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa6?auto=format&fit=crop&w=1100&q=60',
  startDate: '2025-01-15T18:00:00Z',
  endDate: '2025-01-31T23:59:59Z',
  submissionDeadline: '2025-01-28T23:59:59Z',
  announcementDate: '2025-02-05T12:00:00Z',
  prizePool: 500,
  entryFee: 0,
  maxParticipants: 100,
  currentParticipants: 67
};

export default function GarnishCompetitionScreen() {
  const nav = useNavigation();
  const { toggleSavedEvent, isEventSaved } = useSavedItems();
  const [hasJoined, setHasJoined] = useState(false);
  const imageHeight = Math.round((width * 9) / 16);
  const isSaved = isEventSaved(competitionData.id);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };
  
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join the ${competitionData.title}! Prize pool: $${competitionData.prizePool}. Show off your garnish skills and win amazing prizes!`,
        title: competitionData.title,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share at this time');
    }
  };
  
  const handleSave = () => {
    toggleSavedEvent({
      id: competitionData.id,
      name: competitionData.title,
      subtitle: competitionData.subtitle,
      image: competitionData.image
    });
  };
  
  const handleJoinSubmit = () => {
    if (hasJoined) {
      Alert.alert(
        'Submit Entry',
        'Ready to submit your garnish entry?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Submit', onPress: () => Alert.alert('Success', 'Entry submitted successfully!') }
        ]
      );
    } else {
      Alert.alert(
        'Join Competition',
        `Join the ${competitionData.title}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Join', onPress: () => {
            setHasJoined(true);
            Alert.alert('Welcome!', 'You\'ve successfully joined the competition!');
          }}
        ]
      );
    }
  };

  useLayoutEffect(() => {
    nav.setOptions({
      headerTitle: 'Garnish Competition',
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Pressable hitSlop={12} onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color={colors.text} />
          </Pressable>
          <Pressable hitSlop={12} onPress={handleSave}>
            <Ionicons 
              name={isSaved ? "bookmark" : "bookmark-outline"} 
              size={24} 
              color={isSaved ? colors.accent : colors.text} 
            />
          </Pressable>
        </View>
      ),
    });
  }, [nav, isSaved, handleShare, handleSave]);

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: spacing(8) }}
        showsVerticalScrollIndicator={false}
      >
        <Image 
          source={{ uri: competitionData.image }} 
          style={[styles.headerImage, { height: imageHeight }]}
        />

        <View style={styles.contentContainer}>
          <Text style={styles.title}>{competitionData.title}</Text>
          <Text style={styles.subtitle}>{competitionData.subtitle}</Text>
          
          {/* Competition Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="trophy" size={20} color={colors.gold} />
              <Text style={styles.statText}>${competitionData.prizePool}</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="account-group" size={20} color={colors.accent} />
              <Text style={styles.statText}>{competitionData.currentParticipants}/{competitionData.maxParticipants}</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="clock-outline" size={20} color={colors.subtext} />
              <Text style={styles.statText}>5 days left</Text>
            </View>
          </View>
          
          {/* Important Dates */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Important Dates</Text>
            <View style={styles.dateItem}>
              <Ionicons name="calendar-outline" size={16} color={colors.accent} />
              <View style={styles.dateInfo}>
                <Text style={styles.dateLabel}>Competition Start</Text>
                <Text style={styles.dateValue}>{formatDate(competitionData.startDate)}</Text>
              </View>
            </View>
            <View style={styles.dateItem}>
              <Ionicons name="time-outline" size={16} color={colors.accent} />
              <View style={styles.dateInfo}>
                <Text style={styles.dateLabel}>Submission Deadline</Text>
                <Text style={styles.dateValue}>{formatDate(competitionData.submissionDeadline)}</Text>
              </View>
            </View>
            <View style={styles.dateItem}>
              <Ionicons name="megaphone-outline" size={16} color={colors.accent} />
              <View style={styles.dateInfo}>
                <Text style={styles.dateLabel}>Winner Announcement</Text>
                <Text style={styles.dateValue}>{formatDate(competitionData.announcementDate)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Event Details</Text>
            <Text style={styles.description}>
              Show off your creativity and technical skills in our monthly garnish competition! 
              Create the most innovative, beautiful, and delicious garnish that complements 
              your signature cocktail.
            </Text>
          </View>

          {/* Competition Rules */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Competition Rules</Text>
            <View style={styles.rulesList}>
              <View style={styles.ruleItem}>
                <Text style={styles.ruleNumber}>1.</Text>
                <Text style={styles.ruleText}>Must be an original garnish creation, not copied from existing designs</Text>
              </View>
              <View style={styles.ruleItem}>
                <Text style={styles.ruleNumber}>2.</Text>
                <Text style={styles.ruleText}>Submit high-quality photos showing the garnish with your signature cocktail</Text>
              </View>
              <View style={styles.ruleItem}>
                <Text style={styles.ruleNumber}>3.</Text>
                <Text style={styles.ruleText}>Include a detailed description of your technique and ingredients used</Text>
              </View>
              <View style={styles.ruleItem}>
                <Text style={styles.ruleNumber}>4.</Text>
                <Text style={styles.ruleText}>Tag @HomeGameAdvantage and use hashtag #GarnishChallenge2025</Text>
              </View>
              <View style={styles.ruleItem}>
                <Text style={styles.ruleNumber}>5.</Text>
                <Text style={styles.ruleText}>One entry per participant. Multiple submissions will result in disqualification</Text>
              </View>
              <View style={styles.ruleItem}>
                <Text style={styles.ruleNumber}>6.</Text>
                <Text style={styles.ruleText}>Submissions must be received before the deadline shown above</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Prizes</Text>
            <View style={styles.prizesList}>
              <View style={styles.prizeItem}>
                <Text style={styles.prizeRank}>🥇 FIRST PLACE</Text>
                <Text style={styles.prizeReward}>$300 Cash Prize</Text>
                <Text style={styles.prizeBonus}>+ Featured on homepage for 1 month</Text>
                <Text style={styles.prizeBonus}>+ Professional bartending masterclass</Text>
              </View>
              <View style={styles.prizeItem}>
                <Text style={styles.prizeRank}>🥈 SECOND PLACE</Text>
                <Text style={styles.prizeReward}>$150 Cash Prize</Text>
                <Text style={styles.prizeBonus}>+ Premium bartending kit ($200 value)</Text>
                <Text style={styles.prizeBonus}>+ Social media feature</Text>
              </View>
              <View style={styles.prizeItem}>
                <Text style={styles.prizeRank}>🥉 THIRD PLACE</Text>
                <Text style={styles.prizeReward}>$50 Cash Prize</Text>
                <Text style={styles.prizeBonus}>+ Professional garnish tool set</Text>
                <Text style={styles.prizeBonus}>+ Digital certificate</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Judging Criteria</Text>
            <View style={styles.criteriaList}>
              <View style={styles.criteriaItem}>
                <MaterialCommunityIcons name="eye" size={18} color={colors.accent} />
                <View style={styles.criteriaInfo}>
                  <Text style={styles.criteriaTitle}>Visual Appeal (25%)</Text>
                  <Text style={styles.criteriaDesc}>Overall presentation and aesthetic beauty</Text>
                </View>
              </View>
              <View style={styles.criteriaItem}>
                <MaterialCommunityIcons name="lightbulb" size={18} color={colors.accent} />
                <View style={styles.criteriaInfo}>
                  <Text style={styles.criteriaTitle}>Creativity (30%)</Text>
                  <Text style={styles.criteriaDesc}>Originality and innovative use of ingredients</Text>
                </View>
              </View>
              <View style={styles.criteriaItem}>
                <MaterialCommunityIcons name="tools" size={18} color={colors.accent} />
                <View style={styles.criteriaInfo}>
                  <Text style={styles.criteriaTitle}>Technical Skill (25%)</Text>
                  <Text style={styles.criteriaDesc}>Precision of cuts, technique, and execution</Text>
                </View>
              </View>
              <View style={styles.criteriaItem}>
                <MaterialCommunityIcons name="glass-cocktail" size={18} color={colors.accent} />
                <View style={styles.criteriaInfo}>
                  <Text style={styles.criteriaTitle}>Cocktail Harmony (20%)</Text>
                  <Text style={styles.criteriaDesc}>How well the garnish complements the drink</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Join/Submit Button */}
          <Pressable 
            style={[styles.joinButton, hasJoined && styles.submitButton]}
            onPress={handleJoinSubmit}
          >
            <MaterialCommunityIcons 
              name={hasJoined ? "upload" : "account-plus"} 
              size={20} 
              color={colors.white} 
            />
            <Text style={styles.joinButtonText}>
              {hasJoined ? 'Submit Entry' : 'Join Competition'}
            </Text>
          </Pressable>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(1),
    marginBottom: spacing(3),
    borderWidth: 1,
    borderColor: colors.line,
  },
  statItem: {
    alignItems: 'center',
    gap: spacing(0.5),
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing(1.5),
    gap: spacing(2),
  },
  dateInfo: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(0.25),
  },
  dateValue: {
    fontSize: 13,
    color: colors.subtext,
  },
  rulesList: {
    gap: spacing(1.5),
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing(1.5),
  },
  ruleNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accent,
    minWidth: 24,
  },
  ruleText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  prizesList: {
    gap: spacing(2),
  },
  prizeItem: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(2.5),
    borderWidth: 1,
    borderColor: colors.line,
  },
  prizeRank: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.accent,
    marginBottom: spacing(0.5),
  },
  prizeReward: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  prizeBonus: {
    fontSize: 14,
    color: colors.subtext,
    marginBottom: spacing(0.25),
  },
  criteriaList: {
    gap: spacing(2),
  },
  criteriaItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing(2),
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing(2),
    borderWidth: 1,
    borderColor: colors.line,
  },
  criteriaInfo: {
    flex: 1,
  },
  criteriaTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  criteriaDesc: {
    fontSize: 13,
    color: colors.subtext,
    lineHeight: 18,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderRadius: radii.lg,
    paddingVertical: spacing(3),
    paddingHorizontal: spacing(4),
    marginTop: spacing(2),
    gap: spacing(1.5),
    shadowColor: colors.accent,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  submitButton: {
    backgroundColor: colors.gold,
    shadowColor: colors.gold,
  },
  joinButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
});