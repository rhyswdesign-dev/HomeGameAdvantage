import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../theme/tokens';
import { useAuth } from '../contexts/AuthContext';
import { signInAnonymous, logOut } from '../lib/auth';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

export default function ProfileScreen() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signInAnonymous();
      Alert.alert('Success', 'Signed in successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await logOut();
      Alert.alert('Success', 'Signed out successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <MaterialCommunityIcons name="glass-cocktail" size={48} color={colors.accent} />
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.subtitle}>Signed in as: {user?.uid.substring(0, 8)}...</Text>
          </View>

          <View style={styles.settingsSection}>
            <TouchableOpacity style={styles.settingButton} onPress={() => nav.navigate('AddRecipe')}>
              <Ionicons name="add-circle-outline" size={20} color={colors.text} />
              <Text style={styles.settingButtonText}>Add Recipe</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingButton} onPress={() => nav.navigate('Main', { screen: 'Recipes', params: { activeTab: 'My Recipes' } })}>
              <Ionicons name="restaurant-outline" size={20} color={colors.text} />
              <Text style={styles.settingButtonText}>My Recipes</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingButton}>
              <Ionicons name="document-text-outline" size={20} color={colors.text} />
              <Text style={styles.settingButtonText}>Legal</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingButton}>
              <Ionicons name="help-circle-outline" size={20} color={colors.text} />
              <Text style={styles.settingButtonText}>Help & Support</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingButton}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.text} />
              <Text style={styles.settingButtonText}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingButton}>
              <Ionicons name="information-circle-outline" size={20} color={colors.text} />
              <Text style={styles.settingButtonText}>About</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.settingButton, styles.signOutButton]}
              onPress={handleSignOut}
              disabled={loading}
            >
              <Ionicons name="log-out-outline" size={20} color={colors.error} />
              <Text style={[styles.settingButtonText, { color: colors.error }]}>
                {loading ? 'Signing out...' : 'Sign Out'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="glass-cocktail" size={48} color={colors.accent} />
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Sign in to access your profile</Text>
        </View>

        <View style={styles.authSection}>
          <TouchableOpacity
            style={[styles.signInButton, loading && styles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={loading}
          >
            <Text style={styles.signInButtonText}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <TouchableOpacity style={styles.settingButton}>
            <Ionicons name="document-text-outline" size={20} color={colors.text} />
            <Text style={styles.settingButtonText}>Legal</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingButton}>
            <Ionicons name="help-circle-outline" size={20} color={colors.text} />
            <Text style={styles.settingButtonText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingButton}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.text} />
            <Text style={styles.settingButtonText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingButton}>
            <Ionicons name="information-circle-outline" size={20} color={colors.text} />
            <Text style={styles.settingButtonText}>About</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: spacing(4),
  },
  header: {
    alignItems: 'center',
    marginTop: spacing(6),
    marginBottom: spacing(6),
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing(3),
  },
  subtitle: {
    fontSize: 16,
    color: colors.subtext,
    textAlign: 'center',
    marginTop: spacing(1),
  },
  authSection: {
    marginBottom: spacing(6),
  },
  signInButton: {
    backgroundColor: colors.text,
    borderRadius: radii.lg,
    paddingVertical: spacing(2.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInButtonText: {
    color: colors.bg,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  settingsSection: {
    gap: spacing(1),
  },
  settingButton: {
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
  settingButtonText: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  signOutButton: {
    marginTop: spacing(4),
    borderColor: colors.error + '20',
  },
});