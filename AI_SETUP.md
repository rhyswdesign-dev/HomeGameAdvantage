# AI Recipe Formatting Setup

## Overview

The app includes AI-powered recipe formatting that transforms saved links and text into structured recipe cards with ingredients, instructions, garnish details, and more.

## Development Mode

By default, the app runs in development mode with mock AI responses when:
- No OpenAI API key is provided
- The API key is set to the default placeholder: `your-openai-api-key-here`

Development mode provides realistic mock responses for testing the UI and user flow.

## Production Setup

To enable real AI features, you have two options:

### Option 1: Quick Setup (OpenAI Only)
For basic AI recipe formatting and image analysis:

1. Get an OpenAI API key from [platform.openai.com](https://platform.openai.com/api-keys)
2. Update your `.env` file: `EXPO_PUBLIC_OPENAI_API_KEY=sk-your-key-here`
3. Restart: `npx expo start --clear`

**Features Enabled**: Recipe formatting, Vision AI image analysis
**Cost**: ~$0.01-0.03 per recipe

### Option 2: Full Setup (OpenAI + Google Cloud)
For complete AI features including OCR text extraction:

1. Get OpenAI API key (see above)
2. Get Google Cloud Vision API key from [console.cloud.google.com](https://console.cloud.google.com/)
3. Update your `.env` file:
   ```bash
   EXPO_PUBLIC_OPENAI_API_KEY=sk-your-openai-key-here
   EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY=your-google-cloud-key-here
   ```
4. Restart: `npx expo start --clear`

**Features Enabled**: All AI features
**Cost**: ~$0.01-0.03 per recipe + ~$0.001-0.005 per OCR image

## AI Features

### Current Features
- ✅ Recipe text parsing and structuring
- ✅ Ingredient extraction with amounts
- ✅ Instruction step generation
- ✅ Garnish and glassware suggestions
- ✅ Difficulty and time estimation
- ✅ Preview and edit flow before saving
- ✅ Firebase integration for saving formatted recipes
- ✅ URL text extraction (enhanced implementation)
- ✅ OCR integration for screenshot text extraction
- ✅ Camera and gallery integration for recipe photos

### Recently Added Features
- ✅ Custom prompt templates for different recipe types (cocktail, mocktail, spirits education, general)
- ✅ Voice-to-text recipe input with speech recognition
- ✅ Image analysis for recipe detection using AI vision

### Planned Features
- ⏳ Multi-language support for recipe text
- ⏳ Recipe quality scoring and recommendations
- ⏳ Integration with cocktail databases and APIs
- ⏳ Advanced recipe categorization and tagging

## Usage

### Method 1: Format Existing Recipes
1. Navigate to "My Recipes" tab
2. Find a recipe you've saved
3. Tap the purple "✨" button (AI Format)
4. Review and edit the AI-generated structure
5. Save the formatted recipe

### Method 2: Scan Recipe Photos
1. Navigate to "Recipes" tab
2. Tap the camera button in the header
3. Take a photo or choose from gallery
4. Choose processing method:
   - **Text Extraction**: Extract text using OCR, then format with AI
   - **👁️ Vision Analysis**: Directly analyze recipe image using AI vision
5. Edit and save the formatted recipe

### Method 3: Voice Recipe Input (NEW!)
1. Navigate to "Recipes" tab
2. Tap the microphone button in the header
3. Record yourself describing the recipe
4. Review transcribed text and detected components
5. Choose recipe type and format with AI
6. Edit and save the formatted recipe

## API Costs

OpenAI API usage is pay-per-use:
- Model: GPT-4
- Estimated cost: ~$0.01-0.03 per recipe
- Temperature: 0.3 (for consistent formatting)
- Max tokens: 1000

## Development Notes

### File Structure
- `src/services/aiRecipeFormatter.ts` - Main AI service
- `src/screens/AIRecipeFormatScreen.tsx` - Preview/edit UI
- `src/screens/RecipesScreen.tsx` - Integration point

### Mock Response
Development mode returns a structured mock recipe with:
- Realistic ingredient lists
- Step-by-step instructions
- Appropriate garnish suggestions
- Proper glassware recommendations
- Difficulty and timing estimates

### Error Handling
- Network failures gracefully fall back to manual formatting
- Invalid API keys show appropriate error messages
- Malformed responses trigger retry options