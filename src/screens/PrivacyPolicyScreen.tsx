import React, { useLayoutEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../theme/tokens';

interface PrivacyPolicyScreenProps {
  onBack?: () => void;
}

export default function PrivacyPolicyScreen({ onBack }: PrivacyPolicyScreenProps) {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Privacy Policy',
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { color: colors.text, fontWeight: '700' },
      headerShadowVisible: false,
      headerLeft: () => (
        <TouchableOpacity 
          onPress={onBack || (() => navigation.goBack())}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, onBack]);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.subtitle}>
            Effective Date: March 1, 2024
          </Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Section
            title="Introduction"
            content="Home Game Advantage ('we', 'our', or 'us') respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our mobile application and services."
          />

          <Section
            title="Information We Collect"
            content="We collect information you provide directly to us, such as when you create an account, update your profile, participate in events, or contact us for support."
            subsections={[
              {
                subtitle: "Personal Information",
                content: "• Name and email address\n• Profile information (bio, avatar, preferences)\n• Location data (with your permission)\n• Communication preferences"
              },
              {
                subtitle: "Usage Information",
                content: "• App usage patterns and preferences\n• Event participation and feedback\n• Bar and spirit interactions\n• Device information and identifiers"
              },
              {
                subtitle: "Social Information",
                content: "• Information from social media accounts (if you connect them)\n• User-generated content like reviews and comments\n• Social interactions within the app"
              }
            ]}
          />

          <Section
            title="How We Use Your Information"
            content="We use the information we collect to provide, maintain, and improve our services."
            subsections={[
              {
                subtitle: "Core Services",
                content: "• Personalize your experience with relevant content\n• Facilitate event registration and participation\n• Enable social features and community interaction\n• Provide customer support and respond to inquiries"
              },
              {
                subtitle: "Communication",
                content: "• Send important updates about your account or our services\n• Notify you about events and opportunities (with your consent)\n• Share promotional content and special offers (optional)\n• Gather feedback to improve our services"
              },
              {
                subtitle: "Analytics and Improvement",
                content: "• Analyze usage patterns to improve app functionality\n• Conduct research and analytics\n• Develop new features and services\n• Ensure security and prevent fraud"
              }
            ]}
          />

          <Section
            title="Information Sharing"
            content="We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:"
            subsections={[
              {
                subtitle: "Service Providers",
                content: "We may share information with trusted third-party service providers who help us operate our app and provide services to you, such as cloud hosting, analytics, and customer support."
              },
              {
                subtitle: "Legal Requirements",
                content: "We may disclose your information if required by law, court order, or government regulation, or to protect our rights, property, or safety."
              },
              {
                subtitle: "Business Transfers",
                content: "In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction."
              }
            ]}
          />

          <Section
            title="Data Security"
            content="We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure."
          />

          <Section
            title="Your Rights and Choices"
            content="You have several rights regarding your personal information:"
            subsections={[
              {
                subtitle: "Access and Updates",
                content: "• Access and update your account information at any time\n• Request a copy of the personal data we hold about you\n• Correct any inaccurate or incomplete information"
              },
              {
                subtitle: "Data Control",
                content: "• Delete your account and associated data\n• Opt out of marketing communications\n• Control location tracking and other permissions\n• Request data portability where applicable"
              },
              {
                subtitle: "Communication Preferences",
                content: "• Choose which types of notifications you receive\n• Unsubscribe from promotional emails\n• Adjust privacy settings for social features"
              }
            ]}
          />

          <Section
            title="Cookies and Tracking"
            content="We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie settings through your device or browser settings."
          />

          <Section
            title="Children's Privacy"
            content="Our service is not intended for children under the age of 21. We do not knowingly collect personal information from children under 21. If you are a parent or guardian and believe your child has provided us with personal information, please contact us."
          />

          <Section
            title="International Data Transfers"
            content="Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards."
          />

          <Section
            title="Changes to This Policy"
            content="We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy in the app and updating the effective date. Your continued use of the app after such changes constitutes acceptance of the updated policy."
          />

          <Section
            title="Contact Us"
            content="If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:"
            subsections={[
              {
                subtitle: "Contact Information",
                content: "Email: privacy@homegameadvantage.com\nAddress: [Company Address]\nPhone: [Phone Number]\n\nWe will respond to your inquiries within 30 days."
              }
            ]}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By using Home Game Advantage, you acknowledge that you have read, understood, and agree to this Privacy Policy.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface SectionProps {
  title: string;
  content: string;
  subsections?: Array<{
    subtitle: string;
    content: string;
  }>;
}

function Section({ title, content, subsections }: SectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionContent}>{content}</Text>
      
      {subsections && subsections.map((subsection, index) => (
        <View key={index} style={styles.subsection}>
          <Text style={styles.subsectionTitle}>{subsection.subtitle}</Text>
          <Text style={styles.subsectionContent}>{subsection.content}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    paddingBottom: spacing(6),
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingHorizontal: spacing(3),
    paddingTop: spacing(3),
    paddingBottom: spacing(4),
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing(1),
  },
  subtitle: {
    fontSize: 16,
    color: colors.subtext,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: spacing(3),
  },
  section: {
    marginBottom: spacing(4),
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(2),
  },
  sectionContent: {
    fontSize: 16,
    color: colors.subtext,
    lineHeight: 24,
    marginBottom: spacing(1),
  },
  subsection: {
    marginTop: spacing(2),
    marginLeft: spacing(2),
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(1),
  },
  subsectionContent: {
    fontSize: 15,
    color: colors.subtext,
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: spacing(3),
    paddingTop: spacing(4),
    paddingBottom: spacing(2),
    backgroundColor: colors.card,
    marginHorizontal: spacing(3),
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.line,
  },
  footerText: {
    fontSize: 14,
    color: colors.subtext,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
});