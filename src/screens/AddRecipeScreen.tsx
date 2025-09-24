import React, { useState, useLayoutEffect, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
  ScrollView,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, radii, fonts } from '../theme/tokens';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { createRecipe, getUserFolders, createFolder, RecipeFolder } from '../lib/firestore';
import { uploadImage } from '../lib/storage';
import { useAuth } from '../contexts/AuthContext';

export default function AddRecipeScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [title, setTitle] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [tags, setTags] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<RecipeFolder | null>(null);
  const [folders, setFolders] = useState<RecipeFolder[]>([]);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [loading, setLoading] = useState(false);

  const userInfo = isLoading
    ? '⏳ Checking authentication...'
    : isAuthenticated
      ? `✅ Signed in as: ${user?.uid.substring(0, 8)}...`
      : '❌ Not signed in';

  useLayoutEffect(() => {
    nav.setOptions({
      title: 'Add Recipe',
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { color: colors.text, fontWeight: '900' },
      headerShadowVisible: false,
    });
  }, [nav]);

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      if (user) {
        const userFolders = await getUserFolders(user.uid);
        setFolders(userFolders);
      }
    } catch (error) {
      console.error('Error loading folders:', error);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      Alert.alert('Error', 'Please enter a folder name');
      return;
    }

    try {
      await createFolder({ name: newFolderName.trim() });
      setNewFolderName('');
      setShowFolderModal(false);
      loadFolders(); // Reload folders
      Alert.alert('Success', 'Folder created successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create folder');
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera roll permissions are required to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permissions are required to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    console.log('AddRecipeScreen: handleSave called');
    console.log('AddRecipeScreen: isAuthenticated:', isAuthenticated);
    console.log('AddRecipeScreen: user:', user?.uid);

    if (!isAuthenticated || !user) {
      Alert.alert('Authentication Required', 'Please sign in first from the Profile tab', [
        { text: 'OK' }
      ]);
      return;
    }

    if (!title.trim() && !sourceUrl.trim() && !selectedImage) {
      Alert.alert('Required', 'Please add a title, URL, or image to save the recipe.');
      return;
    }

    setLoading(true);
    try {
      let imageUrl: string | undefined;

      if (selectedImage) {
        console.log('AddRecipeScreen: Uploading image...');
        imageUrl = await uploadImage(selectedImage);
      }

      const tagArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      console.log('AddRecipeScreen: Creating recipe with user:', user.uid);
      console.log('AddRecipeScreen: imageUrl value:', imageUrl);
      const recipeData: any = {
        title: title.trim() || undefined,
        sourceUrl: sourceUrl.trim() || undefined,
        tags: tagArray,
      };

      // Only include imageUrl if it has a valid value
      if (imageUrl) {
        recipeData.imageUrl = imageUrl;
        console.log('AddRecipeScreen: Added imageUrl to recipe data');
      } else {
        console.log('AddRecipeScreen: No imageUrl, excluding from recipe data');
      }

      // Only include folder if one is selected
      if (selectedFolder) {
        recipeData.folder = selectedFolder.name;
        console.log('AddRecipeScreen: Added folder to recipe data:', selectedFolder.name);
      }

      console.log('AddRecipeScreen: Final recipe data:', recipeData);
      await createRecipe(recipeData);

      Alert.alert('Success', 'Recipe saved successfully!', [
        { text: 'OK', onPress: () => resetForm() }
      ]);
    } catch (error: any) {
      console.error('AddRecipeScreen: Save error:', error);
      Alert.alert('Error', `Failed to save recipe: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setSourceUrl('');
    setSelectedImage(null);
    setTags('');
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Add New Recipe</Text>
          <Text style={styles.subtitle}>Save from link, image, or manual entry</Text>
        </View>


        <View style={styles.section}>
          <Text style={styles.label}>Recipe Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter recipe title..."
            placeholderTextColor={colors.subtext}
            value={title}
            onChangeText={setTitle}
            multiline
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Source URL</Text>
          <TextInput
            style={styles.input}
            placeholder="Paste link from Instagram, TikTok, YouTube..."
            placeholderTextColor={colors.subtext}
            value={sourceUrl}
            onChangeText={setSourceUrl}
            keyboardType="url"
            autoCapitalize="none"
            multiline
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Recipe Image</Text>
          {selectedImage ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.image} />
              <TouchableOpacity style={styles.removeButton} onPress={removeImage}>
                <Ionicons name="close" size={16} color={colors.bg} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imageButtons}>
              <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                <Ionicons name="images-outline" size={20} color={colors.accent} />
                <Text style={styles.imageButtonText}>Choose Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
                <Ionicons name="camera-outline" size={20} color={colors.accent} />
                <Text style={styles.imageButtonText}>Take Photo</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Tags (comma separated)</Text>
          <TextInput
            style={styles.input}
            placeholder="dinner, pasta, italian..."
            placeholderTextColor={colors.subtext}
            value={tags}
            onChangeText={setTags}
            autoCapitalize="none"
          />
        </View>

        {/* Folder Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.label}>Folder (optional)</Text>
            <TouchableOpacity
              style={styles.createFolderButton}
              onPress={() => setShowFolderModal(true)}
            >
              <Ionicons name="add-circle" size={18} color={colors.accent} />
              <Text style={styles.createFolderText}>Create Folder</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.folderSelector, selectedFolder && styles.folderSelectorSelected]}
            onPress={() => {
              // Create a simple selection alert
              const folderOptions = folders.map(f => f.name);
              folderOptions.unshift('No folder');
              Alert.alert(
                'Select Folder',
                'Choose a folder for this recipe:',
                [
                  ...folderOptions.map(name => ({
                    text: name,
                    onPress: () => {
                      if (name === 'No folder') {
                        setSelectedFolder(null);
                      } else {
                        const folder = folders.find(f => f.name === name);
                        setSelectedFolder(folder || null);
                      }
                    }
                  })),
                  { text: 'Cancel', style: 'cancel' }
                ]
              );
            }}
          >
            <Ionicons name="folder-outline" size={20} color={selectedFolder ? colors.accent : colors.subtext} />
            <Text style={[styles.folderSelectorText, selectedFolder && { color: colors.text }]}>
              {selectedFolder ? selectedFolder.name : 'Select folder (optional)'}
            </Text>
            <Ionicons name="chevron-down" size={16} color={colors.subtext} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save Recipe'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
          <Text style={styles.cancelButtonText}>Clear Form</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Folder Creation Modal */}
      <Modal
        visible={showFolderModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFolderModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowFolderModal(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Create Folder</Text>
            <TouchableOpacity onPress={handleCreateFolder}>
              <Text style={styles.modalSaveText}>Create</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.label}>Folder Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter folder name..."
              placeholderTextColor={colors.subtext}
              value={newFolderName}
              onChangeText={setNewFolderName}
              autoFocus
            />
          </View>
        </SafeAreaView>
      </Modal>
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
    padding: spacing(2),
  },
  header: {
    marginBottom: spacing(4),
  },
  title: {
    fontSize: fonts.h1,
    fontWeight: '900',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.subtext,
    marginTop: spacing(0.5),
  },
  section: {
    marginBottom: spacing(3),
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(1),
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing(2),
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.line,
    minHeight: 50,
    color: colors.text,
  },
  imageContainer: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  image: {
    width: 200,
    height: 150,
    borderRadius: radii.md,
    backgroundColor: colors.line,
  },
  removeButton: {
    position: 'absolute',
    top: spacing(1),
    right: spacing(1),
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: radii.sm,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageButtons: {
    flexDirection: 'row',
    gap: spacing(1.5),
  },
  imageButton: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing(2),
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: spacing(1),
    justifyContent: 'center',
  },
  imageButtonText: {
    fontSize: 16,
    color: colors.accent,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    padding: spacing(2.5),
    alignItems: 'center',
    marginTop: spacing(2),
  },
  saveButtonDisabled: {
    backgroundColor: colors.subtext,
    opacity: 0.6,
  },
  saveButtonText: {
    color: colors.bg,
    fontSize: 18,
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderRadius: radii.md,
    padding: spacing(2.5),
    alignItems: 'center',
    marginTop: spacing(1.5),
  },
  cancelButtonText: {
    color: colors.subtext,
    fontSize: 16,
    fontWeight: '600',
  },
  debugSection: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing(2),
    marginHorizontal: spacing(3),
    marginBottom: spacing(2),
    borderWidth: 1,
    borderColor: colors.line,
  },
  debugText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '600',
  },

  // Folder styles
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing(1),
  },
  createFolderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(0.5),
  },
  createFolderText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  folderSelector: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing(2.5),
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(2),
  },
  folderSelectorSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accent + '10',
  },
  folderSelectorText: {
    flex: 1,
    color: colors.subtext,
    fontSize: 16,
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  modalCancelText: {
    color: colors.subtext,
    fontSize: 16,
  },
  modalSaveText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    padding: spacing(3),
  },
});