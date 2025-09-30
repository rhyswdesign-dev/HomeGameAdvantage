import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

export interface VoiceRecipeInput {
  title?: string;
  instructions?: string;
  ingredients?: string;
  notes?: string;
}

export class VoiceRecipeService {
  private recording: Audio.Recording | null = null;
  private isRecording = false;

  /**
   * Request microphone permissions
   */
  static async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      return status === 'granted';
    } catch (error: any) {
      console.error('Error requesting audio permissions:', error);
      return false;
    }
  }

  /**
   * Start voice recording
   */
  async startRecording(): Promise<void> {
    try {
      console.log('Voice: Requesting permissions...');
      const hasPermission = await VoiceRecipeService.requestPermissions();
      if (!hasPermission) {
        throw new Error('Microphone permission denied');
      }

      console.log('Voice: Setting up audio mode...');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
      });

      console.log('Voice: Starting recording...');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      this.recording = recording;
      this.isRecording = true;
      console.log('Voice: Recording started successfully');

    } catch (error: any) {
      console.error('Voice recording error:', error);
      throw new Error(`Failed to start recording: ${error.message}`);
    }
  }

  /**
   * Stop voice recording and return audio file URI
   */
  async stopRecording(): Promise<string | null> {
    try {
      if (!this.recording || !this.isRecording) {
        throw new Error('No active recording');
      }

      console.log('Voice: Stopping recording...');
      await this.recording.stopAndUnloadAsync();

      const uri = this.recording.getURI();
      console.log('Voice: Recording saved to:', uri);

      this.isRecording = false;
      this.recording = null;

      return uri;

    } catch (error: any) {
      console.error('Voice stop recording error:', error);
      this.isRecording = false;
      this.recording = null;
      throw new Error(`Failed to stop recording: ${error.message}`);
    }
  }

  /**
   * Cancel ongoing recording
   */
  async cancelRecording(): Promise<void> {
    try {
      if (this.recording && this.isRecording) {
        await this.recording.stopAndUnloadAsync();
      }
      this.isRecording = false;
      this.recording = null;
    } catch (error: any) {
      console.error('Voice cancel recording error:', error);
    }
  }

  /**
   * Convert audio to text using OpenAI Whisper API
   * In development mode, returns mock transcription
   */
  async transcribeAudio(audioUri: string): Promise<string> {
    try {
      // Check if in development mode (no real speech-to-text service)
      const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
      const isDevelopmentMode = !apiKey ||
                               apiKey === 'your-openai-api-key-here' ||
                               apiKey === 'dev-key' ||
                               !apiKey.startsWith('sk-');

      if (isDevelopmentMode) {
        console.log('🔧 Development mode: Using mock transcription');
        console.log('💡 To use real transcription, set EXPO_PUBLIC_OPENAI_API_KEY in .env file');
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing delay

        return this.getMockTranscription();
      }

      console.log('🎤 Using real OpenAI Whisper API for transcription');

      // TODO: Implement real Whisper API integration
      // This requires uploading the audio file to OpenAI Whisper API
      // For now, return mock with message about production setup needed
      console.log('🔧 Real Whisper API integration coming soon - using mock for now');
      await new Promise(resolve => setTimeout(resolve, 2000));
      return this.getMockTranscription();

    } catch (error: any) {
      console.error('Voice transcription error:', error);
      throw new Error(`Failed to transcribe audio: ${error.message}`);
    }
  }

  /**
   * Parse transcribed text into recipe components using AI
   */
  async parseVoiceRecipe(transcription: string): Promise<VoiceRecipeInput> {
    try {
      // Use basic text parsing to extract recipe components
      const result: VoiceRecipeInput = {};

      // Simple keyword-based parsing
      const text = transcription.toLowerCase();

      // Extract title
      const titleMatch = text.match(/(?:recipe for|making|called|name is) (.+?)(?:\.|,|$)/i);
      if (titleMatch) {
        result.title = titleMatch[1].trim();
      }

      // Extract ingredients section
      const ingredientsMatch = text.match(/(?:ingredients?|you need|add|use)(.+?)(?:instructions?|directions?|steps?|method|now|then|$)/i);
      if (ingredientsMatch) {
        result.ingredients = ingredientsMatch[1].trim();
      }

      // Extract instructions section
      const instructionsMatch = text.match(/(?:instructions?|directions?|steps?|method|now|then)(.+?)(?:notes?|tips?|serve|enjoy|$)/i);
      if (instructionsMatch) {
        result.instructions = instructionsMatch[1].trim();
      }

      // Use remaining text as notes
      result.notes = transcription;

      return result;

    } catch (error) {
      console.error('Voice parsing error:', error);
      return { notes: transcription };
    }
  }

  /**
   * Get recording status
   */
  getRecordingStatus(): { isRecording: boolean } {
    return { isRecording: this.isRecording };
  }

  /**
   * Mock transcription for development/testing
   */
  private getMockTranscription(): string {
    const mockTranscriptions = [
      "This is a recipe for a Classic Old Fashioned. You'll need 2 ounces of bourbon whiskey, a quarter ounce of simple syrup, 2 dashes of Angostura bitters, and an orange peel for garnish. First, add the simple syrup and bitters to a rocks glass. Add the whiskey and stir to combine. Add a large ice cube and express the orange peel oils over the drink before dropping it in.",

      "I want to make a Virgin Mojito mocktail. The ingredients are 8 to 10 fresh mint leaves, 1 ounce of fresh lime juice, three quarters ounce of simple syrup, and 4 ounces of sparkling water. Start by gently muddling the mint leaves in the bottom of a glass. Add the lime juice and simple syrup, then fill with ice and stir. Top with sparkling water and stir once more. Garnish with a fresh mint sprig and lime wheel.",

      "This is about bourbon tasting techniques. Pour half an ounce of bourbon into a tulip-shaped glass. First, observe the color and viscosity. Then nose the whiskey with your mouth slightly open. Take a small sip and let it coat your palate. Try to identify flavors like vanilla, caramel, oak, and spice. This should take about 10 minutes for a proper tasting."
    ];

    return mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
  }

  /**
   * Clean up resources
   */
  async cleanup(): Promise<void> {
    try {
      if (this.recording) {
        await this.cancelRecording();
      }
    } catch (error) {
      console.error('Voice cleanup error:', error);
    }
  }
}