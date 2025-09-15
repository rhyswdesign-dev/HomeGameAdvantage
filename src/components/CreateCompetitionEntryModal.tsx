import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../theme/tokens';
import { uploadService, CompetitionEntry, UploadedFile } from '../services/uploadService';

interface CreateCompetitionEntryModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: (entryId: string) => void;
  competitionId: string;
  competitionTitle?: string;
}

export default function CreateCompetitionEntryModal({
  visible,
  onClose,
  onSuccess,
  competitionId,
  competitionTitle = 'Competition Entry',
}: CreateCompetitionEntryModalProps) {
  const [entry, setEntry] = useState<Partial<CompetitionEntry>>({
    competitionId,
    title: '',
    description: '',
    category: '',
    images: [],
    videos: [],
    author: { name: '' },
    submissionDate: new Date(),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = <K extends keyof CompetitionEntry>(
    key: K,
    value: CompetitionEntry[K]
  ) => {
    setEntry(prev => ({ ...prev, [key]: value }));
  };

  const handleAddImage = async () => {
    try {
      const images = await uploadService.pickImage({
        allowsMultipleSelection: true,
        quality: 0.9,
      });
      if (images.length > 0) {
        const updated = [...(entry.images || []), ...images];
        updateField('images', updated);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add images');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const photo = await uploadService.takePhoto();
      if (photo) {
        const updated = [...(entry.images || []), photo];
        updateField('images', updated);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handleAddVideo = async () => {
    try {
      const video = await uploadService.pickVideo();
      if (video) {
        const updated = [...(entry.videos || []), video];
        updateField('videos', updated);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add video');
    }
  };

  const handleRecordVideo = async () => {
    try {
      const video = await uploadService.recordVideo();
      if (video) {
        const updated = [...(entry.videos || []), video];
        updateField('videos', updated);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to record video');
    }
  };

  const removeMedia = (type: 'images' | 'videos', index: number) => {
    const updated = (entry[type] || []).filter((_, i) => i !== index);
    updateField(type, updated);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await uploadService.submitCompetitionEntry(entry as CompetitionEntry);
      if (result.success) {
        Alert.alert('Success!', 'Your competition entry has been submitted successfully.');
        onSuccess?.(result.id!);
        onClose();
        // Reset form
        setEntry({
          competitionId,
          title: '',
          description: '',
          category: '',
          images: [],
          videos: [],
          author: { name: '' },
          submissionDate: new Date(),
        });
      } else {
        Alert.alert('Error', result.error || 'Failed to submit entry');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const competitionCategories = [
    { key: 'cocktail', label: '🍸 Cocktail Creation', description: 'Original cocktail recipes' },
    { key: 'presentation', label: '🎨 Best Presentation', description: 'Visual appeal and garnishing' },
    { key: 'speed', label: '⚡ Speed Challenge', description: 'Fast and accurate mixing' },
    { key: 'classic', label: '🏆 Classic Recreation', description: 'Perfect classic cocktails' },
    { key: 'innovation', label: '💡 Innovation', description: 'Creative techniques and ingredients' },
    { key: 'theme', label: '🎭 Theme Challenge', description: 'Seasonal or themed drinks' },
  ];

  const mediaCount = (entry.images?.length || 0) + (entry.videos?.length || 0);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.headerButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Create Entry</Text>
            <Text style={styles.headerSubtitle}>{competitionTitle}</Text>
          </View>
          <Pressable 
            style={[styles.headerButton, styles.submitButton]} 
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitText}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Text>
          </Pressable>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Entry Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Entry Information</Text>
            
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Entry Title *</Text>
              <TextInput
                style={styles.textInput}
                value={entry.title}
                onChangeText={(value) => updateField('title', value)}
                placeholder="Give your entry a catchy title"
                placeholderTextColor={colors.subtext}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Description *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={entry.description}
                onChangeText={(value) => updateField('description', value)}
                placeholder="Describe your creation, techniques used, inspiration..."
                placeholderTextColor={colors.subtext}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Your Name *</Text>
              <TextInput
                style={styles.textInput}
                value={entry.author?.name}
                onChangeText={(value) => updateField('author', { ...entry.author, name: value })}
                placeholder="Your name"
                placeholderTextColor={colors.subtext}
              />
            </View>
          </View>

          {/* Category Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Competition Category</Text>
            <View style={styles.categoryGrid}>
              {competitionCategories.map((category) => {
                const isSelected = entry.category === category.key;
                return (
                  <Pressable
                    key={category.key}
                    style={[styles.categoryOption, isSelected && styles.categoryOptionSelected]}
                    onPress={() => updateField('category', category.key)}
                  >
                    <Text style={[
                      styles.categoryLabel,
                      isSelected && styles.categoryLabelSelected
                    ]}>
                      {category.label}
                    </Text>
                    <Text style={[
                      styles.categoryDescription,
                      isSelected && styles.categoryDescriptionSelected
                    ]}>
                      {category.description}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Media Upload */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Photos & Videos</Text>
              <Text style={styles.mediaCounter}>
                {mediaCount}/10 media files
              </Text>
            </View>
            <Text style={styles.sectionDescription}>
              Add photos or videos showcasing your creation. At least one is required.
            </Text>
            
            <View style={styles.mediaButtons}>
              <Pressable style={styles.mediaButton} onPress={handleAddImage}>
                <Ionicons name="images" size={24} color={colors.accent} />
                <Text style={styles.mediaButtonText}>Add Photos</Text>
                <Text style={styles.mediaButtonSubtext}>From gallery</Text>
              </Pressable>
              
              <Pressable style={styles.mediaButton} onPress={handleTakePhoto}>
                <Ionicons name="camera" size={24} color={colors.accent} />
                <Text style={styles.mediaButtonText}>Take Photo</Text>
                <Text style={styles.mediaButtonSubtext}>Camera</Text>
              </Pressable>
            </View>

            <View style={styles.mediaButtons}>
              <Pressable style={styles.mediaButton} onPress={handleAddVideo}>
                <Ionicons name="videocam" size={24} color={colors.accent} />
                <Text style={styles.mediaButtonText}>Add Video</Text>
                <Text style={styles.mediaButtonSubtext}>From gallery</Text>
              </Pressable>
              
              <Pressable style={styles.mediaButton} onPress={handleRecordVideo}>
                <Ionicons name="radio-button-on" size={24} color={colors.error} />
                <Text style={styles.mediaButtonText}>Record Video</Text>
                <Text style={styles.mediaButtonSubtext}>Max 60s</Text>
              </Pressable>
            </View>

            {/* Media Preview */}
            {((entry.images && entry.images.length > 0) || (entry.videos && entry.videos.length > 0)) && (
              <View style={styles.mediaPreview}>
                <Text style={styles.previewTitle}>Media Preview</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.mediaGrid}>
                    {/* Images */}
                    {(entry.images || []).map((image, index) => (
                      <View key={`image-${index}`} style={styles.mediaItem}>
                        <Image source={{ uri: image.uri }} style={styles.mediaThumb} />
                        <View style={styles.mediaInfo}>
                          <Ionicons name="image" size={14} color={colors.white} />
                          <Text style={styles.mediaSize}>
                            {Math.round(image.size / 1024)}KB
                          </Text>
                        </View>
                        <Pressable 
                          style={styles.removeMedia}
                          onPress={() => removeMedia('images', index)}
                        >
                          <Ionicons name="close" size={16} color={colors.white} />
                        </Pressable>
                      </View>
                    ))}
                    
                    {/* Videos */}
                    {(entry.videos || []).map((video, index) => (
                      <View key={`video-${index}`} style={styles.mediaItem}>
                        <View style={styles.videoThumb}>
                          <Ionicons name="play" size={32} color={colors.white} />
                        </View>
                        <View style={styles.mediaInfo}>
                          <Ionicons name="videocam" size={14} color={colors.white} />
                          <Text style={styles.mediaSize}>
                            {Math.round(video.size / 1024 / 1024)}MB
                          </Text>
                        </View>
                        <Pressable 
                          style={styles.removeMedia}
                          onPress={() => removeMedia('videos', index)}
                        >
                          <Ionicons name="close" size={16} color={colors.white} />
                        </Pressable>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}
          </View>

          {/* Submission Guidelines */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 Submission Guidelines</Text>
            <View style={styles.guidelines}>
              <View style={styles.guideline}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={styles.guidelineText}>
                  Include clear, well-lit photos of your creation
                </Text>
              </View>
              <View style={styles.guideline}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={styles.guidelineText}>
                  Videos should show preparation or presentation techniques
                </Text>
              </View>
              <View style={styles.guideline}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={styles.guidelineText}>
                  Description should explain your creative process
                </Text>
              </View>
              <View style={styles.guideline}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={styles.guidelineText}>
                  Follow competition rules and category requirements
                </Text>
              </View>
            </View>
          </View>

          <View style={{ height: spacing(8) }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  headerButton: {
    padding: spacing(1),
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.subtext,
    marginTop: 2,
  },
  submitButton: {
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingHorizontal: spacing(3),
  },
  submitText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingVertical: spacing(3),
    paddingHorizontal: spacing(3),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing(1),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.subtext,
    marginBottom: spacing(3),
    lineHeight: 20,
  },
  mediaCounter: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  field: {
    marginBottom: spacing(3),
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(1),
  },
  textInput: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.md,
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2.5),
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    gap: spacing(2),
  },
  categoryOption: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.line,
    borderRadius: radii.lg,
    padding: spacing(3),
  },
  categoryOptionSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accent + '10',
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  categoryLabelSelected: {
    color: colors.accent,
  },
  categoryDescription: {
    fontSize: 14,
    color: colors.subtext,
  },
  categoryDescriptionSelected: {
    color: colors.accent,
  },
  mediaButtons: {
    flexDirection: 'row',
    gap: spacing(2),
    marginBottom: spacing(2),
  },
  mediaButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing(3),
    borderWidth: 2,
    borderColor: colors.accent,
    borderRadius: radii.lg,
    borderStyle: 'dashed',
    gap: spacing(0.5),
  },
  mediaButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  mediaButtonSubtext: {
    fontSize: 12,
    color: colors.subtext,
  },
  mediaPreview: {
    marginTop: spacing(3),
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(2),
  },
  mediaGrid: {
    flexDirection: 'row',
    gap: spacing(2),
  },
  mediaItem: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  mediaThumb: {
    width: '100%',
    height: '100%',
    borderRadius: radii.md,
  },
  videoThumb: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.card,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.line,
  },
  mediaInfo: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: radii.sm,
    paddingHorizontal: spacing(1),
    paddingVertical: spacing(0.5),
    gap: spacing(0.5),
  },
  mediaSize: {
    fontSize: 10,
    color: colors.white,
    fontWeight: '600',
  },
  removeMedia: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.error,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guidelines: {
    gap: spacing(2),
  },
  guideline: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing(2),
  },
  guidelineText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});