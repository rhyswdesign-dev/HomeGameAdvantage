import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

export interface UploadedFile {
  uri: string;
  name: string;
  type: string;
  size: number;
  mimeType?: string;
}

export interface RecipeSubmission {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: number;
  servings?: number;
  ingredients: Array<{
    name: string;
    amount: string;
    optional?: boolean;
  }>;
  instructions: string[];
  tags: string[];
  images: UploadedFile[];
  videos: UploadedFile[];
  notes?: string[];
  author: {
    name: string;
    username?: string;
    email?: string;
  };
  createdAt?: string;
}

export interface CompetitionEntry {
  competitionId: string;
  title: string;
  description: string;
  category: string;
  images: UploadedFile[];
  videos: UploadedFile[];
  recipe?: RecipeSubmission;
  author: {
    name: string;
    username?: string;
    email?: string;
  };
  submissionDate: Date;
  createdAt?: string;
}

class UploadService {
  private maxImageSize = 10 * 1024 * 1024; // 10MB
  private maxVideoSize = 100 * 1024 * 1024; // 100MB
  private allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  private allowedVideoTypes = ['video/mp4', 'video/mov', 'video/quicktime'];

  async requestPermissions(): Promise<boolean> {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraPermission.status !== 'granted' || mediaLibraryPermission.status !== 'granted') {
        Alert.alert(
          'Permissions Required',
          'We need camera and photo library access to upload images and videos.',
          [{ text: 'OK' }]
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }

  async pickImage(options?: {
    allowsEditing?: boolean;
    quality?: number;
    allowsMultipleSelection?: boolean;
  }): Promise<UploadedFile[]> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return [];

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: options?.allowsEditing ?? true,
        quality: options?.quality ?? 0.8,
        allowsMultipleSelection: options?.allowsMultipleSelection ?? false,
      });

      if (result.canceled) return [];

      const files: UploadedFile[] = [];

      for (const asset of result.assets) {
        // Validate file size
        const fileInfo = await FileSystem.getInfoAsync(asset.uri);
        if (fileInfo.exists && 'size' in fileInfo && fileInfo.size > this.maxImageSize) {
          Alert.alert(
            'File Too Large',
            `Image is too large (${Math.round(fileInfo.size / 1024 / 1024)}MB). Maximum size is ${this.maxImageSize / 1024 / 1024}MB.`
          );
          continue;
        }

        files.push({
          uri: asset.uri,
          name: asset.fileName || `image_${Date.now()}.jpg`,
          type: 'image',
          size: (fileInfo.exists && 'size' in fileInfo) ? fileInfo.size : 0,
          mimeType: asset.mimeType,
        });
      }

      return files;
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
      return [];
    }
  }

  async takePhoto(): Promise<UploadedFile | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (result.canceled) return null;

      const asset = result.assets[0];
      const fileInfo = await FileSystem.getInfoAsync(asset.uri);

      if (fileInfo.exists && 'size' in fileInfo && fileInfo.size > this.maxImageSize) {
        Alert.alert('File Too Large', 'Photo is too large. Please try again.');
        return null;
      }

      return {
        uri: asset.uri,
        name: asset.fileName || `photo_${Date.now()}.jpg`,
        type: 'image',
        size: (fileInfo.exists && 'size' in fileInfo) ? fileInfo.size : 0,
        mimeType: asset.mimeType,
      };
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
      return null;
    }
  }

  async pickVideo(): Promise<UploadedFile | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
      });

      if (result.canceled) return null;

      const asset = result.assets[0];
      const fileInfo = await FileSystem.getInfoAsync(asset.uri);

      if (fileInfo.exists && 'size' in fileInfo && fileInfo.size > this.maxVideoSize) {
        Alert.alert(
          'File Too Large',
          `Video is too large (${Math.round(fileInfo.size / 1024 / 1024)}MB). Maximum size is ${this.maxVideoSize / 1024 / 1024}MB.`
        );
        return null;
      }

      return {
        uri: asset.uri,
        name: asset.fileName || `video_${Date.now()}.mp4`,
        type: 'video',
        size: (fileInfo.exists && 'size' in fileInfo) ? fileInfo.size : 0,
        mimeType: asset.mimeType,
      };
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert('Error', 'Failed to pick video');
      return null;
    }
  }

  async recordVideo(): Promise<UploadedFile | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
        videoMaxDuration: 60, // 1 minute max
      });

      if (result.canceled) return null;

      const asset = result.assets[0];
      const fileInfo = await FileSystem.getInfoAsync(asset.uri);

      if (fileInfo.exists && 'size' in fileInfo && fileInfo.size > this.maxVideoSize) {
        Alert.alert('File Too Large', 'Video is too large. Please try a shorter video.');
        return null;
      }

      return {
        uri: asset.uri,
        name: asset.fileName || `video_${Date.now()}.mp4`,
        type: 'video',
        size: (fileInfo.exists && 'size' in fileInfo) ? fileInfo.size : 0,
        mimeType: asset.mimeType,
      };
    } catch (error) {
      console.error('Error recording video:', error);
      Alert.alert('Error', 'Failed to record video');
      return null;
    }
  }

  async pickDocument(): Promise<UploadedFile | null> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return null;

      const asset = result.assets[0];

      return {
        uri: asset.uri,
        name: asset.name,
        type: 'document',
        size: asset.size || 0,
        mimeType: asset.mimeType,
      };
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
      return null;
    }
  }

  validateRecipeSubmission(submission: Partial<RecipeSubmission>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!submission.title?.trim()) {
      errors.push('Recipe title is required');
    }

    if (!submission.description?.trim()) {
      errors.push('Recipe description is required');
    }

    if (!submission.difficulty) {
      errors.push('Difficulty level is required');
    }

    if (!submission.prepTime || submission.prepTime <= 0) {
      errors.push('Preparation time must be greater than 0');
    }

    if (!submission.ingredients || submission.ingredients.length === 0) {
      errors.push('At least one ingredient is required');
    } else {
      submission.ingredients.forEach((ingredient, index) => {
        if (!ingredient.name?.trim()) {
          errors.push(`Ingredient ${index + 1} name is required`);
        }
        if (!ingredient.amount?.trim()) {
          errors.push(`Ingredient ${index + 1} amount is required`);
        }
      });
    }

    if (!submission.instructions || submission.instructions.length === 0) {
      errors.push('At least one instruction step is required');
    } else {
      submission.instructions.forEach((instruction, index) => {
        if (!instruction?.trim()) {
          errors.push(`Instruction step ${index + 1} cannot be empty`);
        }
      });
    }

    if (!submission.author?.name?.trim()) {
      errors.push('Author name is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  async submitRecipe(submission: RecipeSubmission): Promise<{
    success: boolean;
    id?: string;
    error?: string;
  }> {
    try {
      // Validate submission
      const validation = this.validateRecipeSubmission(submission);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join('\n'),
        };
      }

      // Simulate upload process
      await this.simulateUpload(submission.images, submission.videos);

      // In a real app, this would upload to your backend
      // For now, we'll simulate a successful submission
      const recipeId = `recipe_${Date.now()}`;

      // Store locally for demo purposes
      await this.saveRecipeLocally(recipeId, submission);

      return {
        success: true,
        id: recipeId,
      };
    } catch (error) {
      console.error('Error submitting recipe:', error);
      return {
        success: false,
        error: 'Failed to submit recipe. Please try again.',
      };
    }
  }

  async submitCompetitionEntry(entry: CompetitionEntry): Promise<{
    success: boolean;
    id?: string;
    error?: string;
  }> {
    try {
      if (!entry.title?.trim()) {
        return {
          success: false,
          error: 'Entry title is required',
        };
      }

      if (!entry.description?.trim()) {
        return {
          success: false,
          error: 'Entry description is required',
        };
      }

      if (entry.images.length === 0 && entry.videos.length === 0) {
        return {
          success: false,
          error: 'At least one image or video is required',
        };
      }

      // Simulate upload process
      await this.simulateUpload(entry.images, entry.videos);

      const entryId = `entry_${Date.now()}`;

      // Store locally for demo purposes
      await this.saveCompetitionEntryLocally(entryId, entry);

      return {
        success: true,
        id: entryId,
      };
    } catch (error) {
      console.error('Error submitting competition entry:', error);
      return {
        success: false,
        error: 'Failed to submit entry. Please try again.',
      };
    }
  }

  private async simulateUpload(images: UploadedFile[], videos: UploadedFile[]): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real app, you would upload files to your server here
    console.log('Uploading files:', {
      images: images.length,
      videos: videos.length,
    });
  }

  private async saveRecipeLocally(id: string, recipe: RecipeSubmission): Promise<void> {
    try {
      const recipesDir = `${FileSystem.documentDirectory}recipes/`;
      const dirInfo = await FileSystem.getInfoAsync(recipesDir);
      
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(recipesDir, { intermediates: true });
      }

      const recipeData = {
        ...recipe,
        id,
        createdAt: new Date().toISOString(),
      };

      await FileSystem.writeAsStringAsync(
        `${recipesDir}${id}.json`,
        JSON.stringify(recipeData, null, 2)
      );
    } catch (error) {
      console.error('Error saving recipe locally:', error);
    }
  }

  private async saveCompetitionEntryLocally(id: string, entry: CompetitionEntry): Promise<void> {
    try {
      const entriesDir = `${FileSystem.documentDirectory}competition_entries/`;
      const dirInfo = await FileSystem.getInfoAsync(entriesDir);
      
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(entriesDir, { intermediates: true });
      }

      const entryData = {
        ...entry,
        id,
        createdAt: new Date().toISOString(),
      };

      await FileSystem.writeAsStringAsync(
        `${entriesDir}${id}.json`,
        JSON.stringify(entryData, null, 2)
      );
    } catch (error) {
      console.error('Error saving competition entry locally:', error);
    }
  }

  async getLocalRecipes(): Promise<RecipeSubmission[]> {
    try {
      const recipesDir = `${FileSystem.documentDirectory}recipes/`;
      const dirInfo = await FileSystem.getInfoAsync(recipesDir);
      
      if (!dirInfo.exists) return [];

      const files = await FileSystem.readDirectoryAsync(recipesDir);
      const recipes: RecipeSubmission[] = [];

      for (const file of files) {
        if (file.endsWith('.json')) {
          const content = await FileSystem.readAsStringAsync(`${recipesDir}${file}`);
          const recipe = JSON.parse(content);
          recipes.push(recipe);
        }
      }

      return recipes.sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
    } catch (error) {
      console.error('Error getting local recipes:', error);
      return [];
    }
  }

  async getLocalCompetitionEntries(): Promise<CompetitionEntry[]> {
    try {
      const entriesDir = `${FileSystem.documentDirectory}competition_entries/`;
      const dirInfo = await FileSystem.getInfoAsync(entriesDir);
      
      if (!dirInfo.exists) return [];

      const files = await FileSystem.readDirectoryAsync(entriesDir);
      const entries: CompetitionEntry[] = [];

      for (const file of files) {
        if (file.endsWith('.json')) {
          const content = await FileSystem.readAsStringAsync(`${entriesDir}${file}`);
          const entry = JSON.parse(content);
          entries.push(entry);
        }
      }

      return entries.sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
    } catch (error) {
      console.error('Error getting local competition entries:', error);
      return [];
    }
  }
}

export const uploadService = new UploadService();