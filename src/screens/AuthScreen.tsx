import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../theme/tokens';
import { useAuth } from '../contexts/AuthContext';
import { signInAnonymous } from '../lib/auth';

interface AuthScreenProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

export default function AuthScreen({ onComplete, onSkip }: AuthScreenProps = {}) {
  const { isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!email.trim()) {
      Alert.alert('Email required', 'Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      // For now, we'll use anonymous sign-in as a placeholder
      await signInAnonymous();
      Alert.alert('Success', 'Signed in successfully!');
      // Call onComplete if provided (for onboarding flow)
      if (onComplete) {
        onComplete();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleContinue = async () => {
    setLoading(true);
    try {
      // Placeholder for Google sign-in
      await signInAnonymous();
      Alert.alert('Success', 'Signed in with Google!');
      // Call onComplete if provided (for onboarding flow)
      if (onComplete) {
        onComplete();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleContinue = async () => {
    setLoading(true);
    try {
      // Placeholder for Apple sign-in
      await signInAnonymous();
      Alert.alert('Success', 'Signed in with Apple!');
      // Call onComplete if provided (for onboarding flow)
      if (onComplete) {
        onComplete();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to sign in with Apple');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.successSection}>
            <MaterialCommunityIcons name="check-circle" size={60} color={colors.accent} />
            <Text style={styles.successTitle}>Welcome!</Text>
            <Text style={styles.successSubtitle}>You're now signed in</Text>
          </View>

          <View style={styles.actionsSection}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="person-outline" size={20} color={colors.text} />
              <Text style={styles.actionButtonText}>View Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="settings-outline" size={20} color={colors.text} />
              <Text style={styles.actionButtonText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <MaterialCommunityIcons name="glass-cocktail" size={48} color={colors.accent} />
            </View>
            <Text style={styles.title}>Log in or sign up</Text>
          </View>

          {/* Email Input */}
          <View style={styles.inputSection}>
            <TextInput
              style={styles.emailInput}
              placeholder="Enter your email address"
              placeholderTextColor={colors.subtext}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              style={[styles.continueButton, loading && styles.buttonDisabled]}
              onPress={handleContinue}
              disabled={loading}
            >
              <Text style={styles.continueButtonText}>
                {loading ? 'Signing in...' : 'Continue'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerSection}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Sign-in */}
          <View style={styles.socialSection}>
            <TouchableOpacity
              style={[styles.socialButton, loading && styles.buttonDisabled]}
              onPress={handleGoogleContinue}
              disabled={loading}
            >
              <MaterialCommunityIcons name="google" size={20} color={colors.text} />
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, loading && styles.buttonDisabled]}
              onPress={handleAppleContinue}
              disabled={loading}
            >
              <MaterialCommunityIcons name="apple" size={20} color={colors.text} />
              <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Skip button (only show during onboarding) */}
          {onSkip && (
            <TouchableOpacity
              style={styles.skipButton}
              onPress={onSkip}
            >
              <Text style={styles.skipButtonText}>Skip for now</Text>
            </TouchableOpacity>
          )}

          {/* Debug Info */}
          {__DEV__ && (
            <View style={styles.debugSection}>
              <Text style={styles.debugText}>
                Auth Status: {isLoading ? 'Loading...' : isAuthenticated ? 'Authenticated' : 'Not authenticated'}
              </Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: spacing(4),
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing(6),
  },
  logoContainer: {
    marginBottom: spacing(3),
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  inputSection: {
    marginBottom: spacing(4),
  },
  emailInput: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2.5),
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: spacing(2),
  },
  continueButton: {
    backgroundColor: colors.text,
    borderRadius: radii.lg,
    paddingVertical: spacing(2.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    color: colors.bg,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  dividerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing(4),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.line,
  },
  dividerText: {
    color: colors.subtext,
    fontSize: 14,
    marginHorizontal: spacing(2),
  },
  socialSection: {
    gap: spacing(2),
  },
  socialButton: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    paddingVertical: spacing(2.5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.line,
    gap: spacing(1.5),
  },
  socialButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  successSection: {
    alignItems: 'center',
    marginBottom: spacing(6),
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing(2),
    marginBottom: spacing(1),
  },
  successSubtitle: {
    fontSize: 16,
    color: colors.subtext,
    textAlign: 'center',
  },
  actionsSection: {
    gap: spacing(2),
  },
  actionButton: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    paddingVertical: spacing(2.5),
    paddingHorizontal: spacing(3),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.line,
    gap: spacing(2),
  },
  actionButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  debugSection: {
    marginTop: spacing(4),
    padding: spacing(2),
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  debugText: {
    fontSize: 12,
    color: colors.subtext,
    textAlign: 'center',
  },
  skipButton: {
    marginTop: spacing(4),
    paddingVertical: spacing(2),
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    color: colors.subtext,
    fontWeight: '500',
  },
});