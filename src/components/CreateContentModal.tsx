/**
 * CREATE CONTENT MODAL
 * Shows options for creating posts or recipes when + button is pressed
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../theme/tokens';

interface CreateContentModalProps {
  visible: boolean;
  onClose: () => void;
  onCreatePost: () => void;
  onCreateRecipe: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CreateContentModal({
  visible,
  onClose,
  onCreatePost,
  onCreateRecipe,
}: CreateContentModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Content</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.subtext} />
            </Pressable>
          </View>

          <Text style={styles.subtitle}>
            What would you like to create for the community?
          </Text>

          <View style={styles.options}>
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                onCreatePost();
                onClose();
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.optionIcon, { backgroundColor: colors.accent + '20' }]}>
                <Ionicons name="chatbubble-ellipses" size={28} color={colors.accent} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Create Post</Text>
                <Text style={styles.optionDescription}>
                  Share your thoughts, experiences, or discoveries with the community
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                onCreateRecipe();
                onClose();
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.optionIcon, { backgroundColor: '#FF6B35' + '20' }]}>
                <Ionicons name="restaurant" size={28} color="#FF6B35" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Create Recipe</Text>
                <Text style={styles.optionDescription}>
                  Share your cocktail recipes and bartending creations
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modal: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing(3),
    width: screenWidth * 0.9,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing(2),
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  closeButton: {
    padding: spacing(1),
  },
  subtitle: {
    fontSize: 16,
    color: colors.subtext,
    marginBottom: spacing(3),
    lineHeight: 22,
  },
  options: {
    gap: spacing(2),
    marginBottom: spacing(3),
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing(2.5),
    backgroundColor: colors.bg,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.line,
    gap: spacing(2),
  },
  optionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  optionDescription: {
    fontSize: 14,
    color: colors.subtext,
    lineHeight: 20,
  },
  cancelButton: {
    padding: spacing(2),
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.subtext,
  },
});