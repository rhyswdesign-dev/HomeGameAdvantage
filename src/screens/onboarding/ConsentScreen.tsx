/**
 * Consent Screen - Privacy and analytics consent
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

type ConsentScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Consent'>;
};

export default function ConsentScreen({ navigation }: ConsentScreenProps) {
  const [analyticsConsent, setAnalyticsConsent] = useState(true);

  const handleContinue = () => {
    // Store consent in user preferences
    // TODO: Save consent to user repo
    console.log('Analytics consent:', analyticsConsent);
    
    navigation.navigate('Survey');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Privacy & Data</Text>
        <Text style={styles.description}>
          We value your privacy. Here's how we handle your data to provide you with the best learning experience.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Progress</Text>
          <Text style={styles.sectionText}>
            Your lesson progress, XP, and achievements are stored to personalize your experience and track your learning journey.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Analytics (Optional)</Text>
          <Text style={styles.sectionText}>
            Help us improve the app by sharing anonymous usage data. You can change this anytime in Settings.
          </Text>
          
          <View style={styles.consentRow}>
            <Text style={styles.consentText}>Share anonymous analytics</Text>
            <Switch
              value={analyticsConsent}
              onValueChange={setAnalyticsConsent}
              trackColor={{ false: '#d4d4d8', true: '#4CAF50' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={styles.privacy}>
          <Text style={styles.privacyText}>
            By continuing, you agree to our{' '}
            <Text style={styles.privacyLink}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.privacyLink}>Privacy Policy</Text>
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  consentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
  },
  consentText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  privacy: {
    marginTop: 'auto',
    marginBottom: 24,
  },
  privacyText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    lineHeight: 18,
  },
  privacyLink: {
    color: '#4CAF50',
    textDecorationLine: 'underline',
  },
  actions: {
    paddingBottom: 48,
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});