import { storage, auth } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import * as ImageManipulator from 'expo-image-manipulator';

export async function uploadImage(uri: string, path?: string): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User must be authenticated to upload images');
  }

  console.log('Storage: Starting image upload for user:', user.uid);
  console.log('Storage: Image URI:', uri);

  try {
    // Compress and resize image before upload
    console.log('Storage: Compressing image...');
    const compressedImage = await ImageManipulator.manipulateAsync(
      uri,
      [
        { resize: { width: 800 } }, // Resize to max width of 800px
      ],
      {
        compress: 0.8, // 80% quality
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    // Create a unique filename if no path provided
    const filename = path || `images/${user.uid}/${Date.now()}.jpg`;
    console.log('Storage: Upload path:', filename);
    const storageRef = ref(storage, filename);

    // Convert URI to blob
    console.log('Storage: Converting to blob...');
    const response = await fetch(compressedImage.uri);
    if (!response.ok) {
      throw new Error(`Failed to fetch compressed image: ${response.status} ${response.statusText}`);
    }
    const blob = await response.blob();
    console.log('Storage: Blob size:', blob.size, 'bytes, type:', blob.type);

    // Upload to Firebase Storage
    console.log('Storage: Uploading to Firebase Storage...');
    const snapshot = await uploadBytes(storageRef, blob);
    console.log('Storage: Upload successful, bytes transferred:', snapshot.totalBytes);

    // Get download URL
    console.log('Storage: Getting download URL...');
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Storage: Upload complete, URL:', downloadURL);

    return downloadURL;
  } catch (error) {
    console.error('Storage: Upload error details:', {
      code: error?.code,
      message: error?.message,
      serverResponse: error?.serverResponse,
      customData: error?.customData
    });

    // Provide more specific error messages
    if (error?.code === 'storage/unauthorized') {
      throw new Error('Storage access denied. Please check Firebase Storage rules.');
    }
    if (error?.code === 'storage/quota-exceeded') {
      throw new Error('Storage quota exceeded. Please upgrade your Firebase plan.');
    }
    if (error?.code === 'storage/unauthenticated') {
      throw new Error('User authentication expired. Please sign in again.');
    }
    if (error?.code === 'storage/unknown') {
      throw new Error('Unknown storage error. Please check your internet connection and Firebase configuration.');
    }

    console.error('Storage: Full error object:', error);
    throw new Error(`Failed to upload image: ${error?.message || 'Unknown error'}`);
  }
}

export async function deleteImage(url: string): Promise<void> {
  try {
    // Extract path from URL to create reference
    const imageRef = ref(storage, url);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image');
  }
}

export async function uploadFile(uri: string, filename: string, contentType: string = 'application/octet-stream'): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User must be authenticated to upload files');
  }

  try {
    const storageRef = ref(storage, `files/${user.uid}/${filename}`);

    const response = await fetch(uri);
    const blob = await response.blob();

    const snapshot = await uploadBytes(storageRef, blob, {
      contentType,
    });

    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
}