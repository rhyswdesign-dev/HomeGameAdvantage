import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY || 'dev-key',
});

// Vision model configuration
const VISION_MODEL = 'gpt-4-vision-preview';

// Development mode check - improved validation
const isDevelopmentMode = () => {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  return !apiKey ||
         apiKey === 'your-openai-api-key-here' ||
         apiKey === 'dev-key' ||
         !isValidApiKey(apiKey);
};

// Validate API key format
const isValidApiKey = (key: string): boolean => {
  if (!key) return false;
  return key.startsWith('sk-') && key.length > 40; // OpenAI keys are typically 51 chars
};

// Get setup instructions for user
const getSetupInstructions = (): string => {
  return `
🔧 To use real OpenAI API instead of mocks:

1. Get an API key from https://platform.openai.com/api-keys
2. Update your .env file:
   EXPO_PUBLIC_OPENAI_API_KEY=sk-your-actual-key-here
3. Restart with: npx expo start --clear

💰 Estimated cost: ~$0.01-0.03 per recipe with GPT-4
`;
};

export interface FormattedRecipe {
  title: string;
  description: string;
  ingredients: Array<{
    name: string;
    amount: string;
    notes?: string;
  }>;
  instructions: string[];
  garnish?: string;
  glassware?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  time?: string;
  servings?: number;
  tags?: string[];
}

export type RecipeType = 'cocktail' | 'mocktail' | 'spirits-education' | 'general';

export interface RecipeInput {
  title?: string;
  sourceUrl?: string;
  imageUrl?: string;
  extractedText?: string;
  userNotes?: string;
  recipeType?: RecipeType;
}

export class AIRecipeFormatter {

  /**
   * Check the current API setup status
   */
  static getAPIStatus(): {
    openAI: boolean;
    googleCloud: boolean;
    developmentMode: boolean;
    setupInstructions?: string;
  } {
    const openAIKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    const googleCloudKey = process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY;

    const openAIValid = openAIKey && isValidApiKey(openAIKey);
    const googleCloudValid = googleCloudKey && googleCloudKey !== 'your-google-cloud-api-key-here';
    const inDevelopmentMode = isDevelopmentMode();

    return {
      openAI: !!openAIValid,
      googleCloud: !!googleCloudValid,
      developmentMode: inDevelopmentMode,
      setupInstructions: inDevelopmentMode ? getSetupInstructions() : undefined
    };
  }

  /**
   * Auto-detect recipe type from content
   */
  private static detectRecipeType(input: RecipeInput): RecipeType {
    const content = (input.extractedText || input.userNotes || input.title || '').toLowerCase();

    // Check for spirits education keywords
    if (content.includes('tasting') || content.includes('notes') || content.includes('distill') ||
        content.includes('production') || content.includes('history') || content.includes('learn') ||
        content.includes('education') || content.includes('technique') || content.includes('profile')) {
      return 'spirits-education';
    }

    // Check for non-alcoholic/mocktail keywords
    if (content.includes('virgin') || content.includes('mocktail') || content.includes('non-alcoholic') ||
        content.includes('alcohol-free') || content.includes('zero-proof') || content.includes('soda') ||
        (content.includes('juice') && !content.includes('oz ')) || content.includes('kombucha')) {
      return 'mocktail';
    }

    // Check for cocktail keywords (most common, so check last)
    if (content.includes('oz') || content.includes('ml') || content.includes('dash') ||
        content.includes('cocktail') || content.includes('martini') || content.includes('whiskey') ||
        content.includes('gin') || content.includes('vodka') || content.includes('rum') ||
        content.includes('tequila') || content.includes('bourbon') || content.includes('shake') ||
        content.includes('stir') || content.includes('muddle') || content.includes('strain')) {
      return 'cocktail';
    }

    // Default to cocktail for anything drink-related
    return 'cocktail';
  }

  /**
   * Format a recipe using AI based on URL, image text, or user input
   */
  static async formatRecipe(input: RecipeInput): Promise<FormattedRecipe> {
    try {
      // Auto-detect recipe type if not provided
      const detectedType = input.recipeType || this.detectRecipeType(input);
      const enhancedInput = { ...input, recipeType: detectedType };

      console.log(`🔍 Auto-detected recipe type: ${detectedType}`);

      // Check if we're in development mode
      if (isDevelopmentMode()) {
        console.log('🔧 Development mode: Using mock AI response');
        console.log(getSetupInstructions());
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay

        return this.getMockFormattedRecipe(enhancedInput);
      }

      console.log('🤖 Using real OpenAI API for recipe formatting');

      const prompt = this.buildPrompt(enhancedInput);
      const systemPrompt = this.getSystemPrompt(detectedType);

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent formatting
        max_tokens: 1000,
      });

      const responseText = completion.choices[0]?.message?.content;
      if (!responseText) {
        throw new Error('No response from AI service');
      }

      // Parse the JSON response
      const formattedRecipe = JSON.parse(responseText) as FormattedRecipe;

      // Validate and clean the response
      return this.validateAndCleanRecipe(formattedRecipe);

    } catch (error: any) {
      console.error('AI Recipe Formatting Error:', error);

      // Provide more specific error messages
      if (error.message?.includes('API key')) {
        throw new Error('Invalid API key. Please check your OpenAI API key in settings.');
      }

      if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
        throw new Error('API quota exceeded. Please try again later or check your OpenAI billing.');
      }

      if (error.message?.includes('network') || error.message?.includes('timeout')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      }

      throw new Error('AI formatting failed. Please try again or use manual formatting.');
    }
  }

  /**
   * Analyze recipe image using AI vision to detect ingredients and instructions
   */
  static async analyzeRecipeImage(imageUrl: string, recipeType?: RecipeType): Promise<FormattedRecipe> {
    try {
      console.log('Vision: Starting recipe image analysis');

      // Check if we're in development mode
      if (isDevelopmentMode()) {
        console.log('🔧 Development mode: Using mock vision analysis');
        console.log(getSetupInstructions());
        await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate processing delay

        return this.getMockVisionAnalysis(recipeType || 'cocktail');
      }

      console.log('👁️ Using real OpenAI Vision API for image analysis');

      const systemPrompt = `You are an expert mixologist and recipe analyzer. You can see cocktail recipes, ingredients lists, bar menus, and recipe cards in images. Extract and structure the recipe information into a clean, professional format. Always respond with valid JSON only.

Focus on:
- Recipe names and titles
- Ingredient lists with measurements
- Step-by-step instructions
- Garnish and presentation details
- Glassware recommendations
- Any visible techniques or methods`;

      const userPrompt = `Analyze this recipe image and extract all recipe information into the following JSON format:

{
  "title": "Recipe name from image",
  "description": "Brief description of what you see",
  "ingredients": [
    {"name": "ingredient name", "amount": "measurement from image", "notes": "any additional notes"}
  ],
  "instructions": ["step 1 from image", "step 2 from image", ...],
  "garnish": "garnish description if visible",
  "glassware": "recommended glass based on image",
  "difficulty": "Easy|Medium|Hard",
  "time": "estimated preparation time",
  "servings": 1,
  "tags": ["relevant tags based on image content"]
}

Please extract all visible recipe information from the image. If you can see multiple recipes, focus on the most prominent one.`;

      const completion = await openai.chat.completions.create({
        model: VISION_MODEL,
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: userPrompt
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                  detail: "high"
                }
              }
            ]
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      });

      const responseText = completion.choices[0]?.message?.content;
      if (!responseText) {
        throw new Error('No response from vision AI service');
      }

      console.log('Vision: Analysis complete');

      // Parse the JSON response
      const analysisResult = JSON.parse(responseText) as FormattedRecipe;

      // Validate and clean the response
      return this.validateAndCleanRecipe(analysisResult);

    } catch (error: any) {
      console.error('AI Vision Analysis Error:', error);

      // Provide more specific error messages for vision analysis
      if (error.message?.includes('API key')) {
        throw new Error('Invalid API key. Please check your OpenAI API key in settings.');
      }

      if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
        throw new Error('API quota exceeded. Please try again later or check your OpenAI billing.');
      }

      if (error.message?.includes('image') || error.message?.includes('vision')) {
        throw new Error('Image analysis failed. Please try with a clearer image or use text extraction instead.');
      }

      throw new Error('Vision analysis failed. Please try again or use text extraction.');
    }
  }

  /**
   * Extract text from image URL using OCR service
   */
  static async extractTextFromImage(imageUrl: string): Promise<string> {
    try {
      // Use our OCR service to extract text from the image
      const { OCRService } = await import('./ocrService');

      // For development mode, return mock response
      if (isDevelopmentMode()) {
        console.log('🔧 Development mode: Using mock OCR response');
        await new Promise(resolve => setTimeout(resolve, 1500));
        return "2 oz gin, 1 oz fresh lime juice, 3/4 oz simple syrup, mint leaves. Muddle mint, add other ingredients, shake with ice, strain over crushed ice.";
      }

      // In production, this would process the imageUrl with OCR
      // For now, return a helpful message
      return "OCR text extraction from images - please use the camera feature in the app for better results.";

    } catch (error: any) {
      console.error('Image text extraction error:', error);
      return "Could not extract text from image. Please try using the camera feature.";
    }
  }

  /**
   * Check if URL is an Instagram URL
   */
  private static isInstagramUrl(url: string): boolean {
    return url.includes('instagram.com') || url.includes('instagr.am');
  }

  /**
   * Check if URL is from social media platforms
   */
  private static isSocialMediaUrl(url: string): boolean {
    const socialDomains = ['tiktok.com', 'twitter.com', 'x.com', 'facebook.com', 'youtube.com', 'youtu.be'];
    return socialDomains.some(domain => url.includes(domain));
  }

  /**
   * Extract text from Instagram URLs
   */
  private static async extractFromInstagram(url: string): Promise<string> {
    try {
      console.log('📸 Processing Instagram URL');

      // Instagram URLs are heavily protected, so provide helpful fallback
      const fallbackText = `Instagram Recipe from: ${url}

Please try one of these alternatives:
1. Take a screenshot and use the "📷 Camera" button to capture the recipe
2. Copy the recipe text from the Instagram post manually
3. Use the "👁️ Vision Analysis" feature to analyze a screenshot

Tip: Instagram posts often contain recipe details in the caption or comments.`;

      // Try basic fetch (will likely fail but worth attempting)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
            'Accept': 'text/html,application/xhtml+xml',
          },
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const html = await response.text();

          // Look for meta description or og:description
          const descMatch = html.match(/<meta[^>]*(?:name="description"|property="og:description")[^>]*content="([^"]*)"[^>]*>/i);
          if (descMatch && descMatch[1] && descMatch[1].length > 20) {
            console.log('✅ Found Instagram description');
            return `Instagram Recipe Description: ${descMatch[1]}\n\nSource: ${url}`;
          }
        }
      } catch (fetchError) {
        console.log('Instagram fetch failed (expected):', fetchError.message);
      }

      return fallbackText;

    } catch (error: any) {
      console.error('Instagram extraction error:', error);
      return `Instagram URL detected: ${url}\n\nPlease copy the recipe text manually or use the camera feature to capture the recipe.`;
    }
  }

  /**
   * Extract text from other social media URLs
   */
  private static async extractFromSocialMedia(url: string): Promise<string> {
    try {
      console.log('📱 Processing social media URL');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          'Accept': 'text/html,application/xhtml+xml',
        },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const html = await response.text();

        // Extract Open Graph or Twitter Card content
        const ogTitle = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"[^>]*>/i)?.[1];
        const ogDescription = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/i)?.[1];
        const twitterDescription = html.match(/<meta[^>]*name="twitter:description"[^>]*content="([^"]*)"[^>]*>/i)?.[1];

        const extractedText = [ogTitle, ogDescription || twitterDescription].filter(Boolean).join('\n\n');

        if (extractedText && extractedText.length > 10) {
          return `${extractedText}\n\nSource: ${url}`;
        }
      }

      return `Social media URL: ${url}\n\nUnable to extract content automatically. Please copy the recipe text manually or use the camera feature.`;

    } catch (error: any) {
      console.error('Social media extraction error:', error);
      return `Social media URL: ${url}\n\nPlease copy the recipe text manually or use the camera feature to capture the recipe.`;
    }
  }

  /**
   * Enhanced URL text extraction with Instagram support
   */
  static async extractTextFromUrl(url: string): Promise<string> {
    try {
      console.log(`🔍 Extracting text from URL: ${url}`);

      // Handle Instagram URLs specially
      if (this.isInstagramUrl(url)) {
        return await this.extractFromInstagram(url);
      }

      // Handle other social media URLs
      if (this.isSocialMediaUrl(url)) {
        return await this.extractFromSocialMedia(url);
      }

      // Standard web scraping with enhanced headers
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // Increased timeout

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();

      // Enhanced text extraction with improved recipe focus
      console.log('🔍 Processing HTML content...');

      // First, try to extract structured data (JSON-LD)
      const jsonLdMatch = html.match(/<script[^>]*type=['"]application\/ld\+json['"][^>]*>([\s\S]*?)<\/script>/gi);
      if (jsonLdMatch) {
        for (const match of jsonLdMatch) {
          try {
            const jsonContent = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '').trim();
            const data = JSON.parse(jsonContent);

            if (data['@type'] === 'Recipe' || (Array.isArray(data) && data.some(item => item['@type'] === 'Recipe'))) {
              console.log('✅ Found structured recipe data');
              const recipe = Array.isArray(data) ? data.find(item => item['@type'] === 'Recipe') : data;

              const structuredText = [
                recipe.name && `Recipe: ${recipe.name}`,
                recipe.description && `Description: ${recipe.description}`,
                recipe.recipeIngredient && `Ingredients: ${recipe.recipeIngredient.join(', ')}`,
                recipe.recipeInstructions && `Instructions: ${recipe.recipeInstructions.map(inst =>
                  typeof inst === 'string' ? inst : inst.text || inst.name || ''
                ).join('. ')}`
              ].filter(Boolean).join('\n\n');

              if (structuredText.length > 50) {
                return `${structuredText}\n\nSource: ${url}`;
              }
            }
          } catch (e) {
            // Continue to next JSON-LD block
          }
        }
      }

      // Extract meta tags with recipe info
      const metaTags = {
        title: html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"[^>]*>/i)?.[1],
        description: html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i)?.[1] || html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/i)?.[1]
      };

      // Enhanced HTML cleaning for recipe content
      let textContent = html
        // Remove script, style, and non-content elements
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
        .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
        .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
        .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '')
        .replace(/<!--[\s\S]*?-->/g, '')

        // Prioritize recipe-specific elements
        .replace(/<(div|section|article)[^>]*(?:recipe|ingredient|instruction|method)[^>]*>[\s\S]*?<\/\1>/gi, (match) => {
          const cleaned = match.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
          return ` RECIPE_SECTION: ${cleaned} `;
        })

        // Handle lists (often ingredients or instructions)
        .replace(/<(ul|ol)[^>]*>[\s\S]*?<\/\1>/gi, (match) => {
          const listItems = match.match(/<li[^>]*>([^<]*(?:<[^>]*>[^<]*)*)<\/li>/gi) || [];
          const items = listItems.map(li => li.replace(/<[^>]*>/g, '').trim()).filter(Boolean);
          return items.length > 0 ? `\nLIST: ${items.join('; ')}\n` : '';
        })

        // Clean remaining HTML
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/\n\s*\n/g, '\n')
        .trim();

      // Combine meta tags and extracted content
      const finalContent = [
        metaTags.title && `Title: ${metaTags.title}`,
        metaTags.description && `Description: ${metaTags.description}`,
        textContent
      ].filter(Boolean).join('\n\n');

      // Try to extract recipe-focused content
      const recipeKeywords = [
        'ingredients', 'instructions', 'directions', 'method', 'recipe', 'garnish', 'serve',
        'mix', 'shake', 'stir', 'muddle', 'strain', 'oz', 'ml', 'cup', 'tbsp', 'tsp', 'dash',
        'cocktail', 'drink', 'beverage', 'liqueur', 'spirit', 'whiskey', 'gin', 'vodka', 'rum'
      ];

      const sentences = finalContent.split(/[.!?]+/);
      const recipeSentences = sentences.filter(sentence =>
        recipeKeywords.some(keyword =>
          sentence.toLowerCase().includes(keyword)
        )
      );

      // Prioritize recipe content but include context
      let extractedText = recipeSentences.length > 5
        ? recipeSentences.join('. ').trim()
        : finalContent;

      // Clean and limit length
      extractedText = extractedText
        .replace(/RECIPE_SECTION:\s*/g, '')
        .replace(/LIST:\s*/g, '\n• ')
        .replace(/\s+/g, ' ')
        .replace(/\n\s*\n/g, '\n')
        .trim();

      const maxLength = 2500; // Increased for better recipe extraction
      if (extractedText.length > maxLength) {
        extractedText = extractedText.substring(0, maxLength) + '...';
      }

      const result = extractedText || "No meaningful recipe content extracted from URL";
      console.log(`✅ Extracted ${result.length} characters from ${url}`);

      return `${result}\n\nSource: ${url}`;

    } catch (error: any) {
      console.error('URL extraction error:', error);
      if (error.name === 'AbortError') {
        return "URL request timed out - please try again";
      }
      return `Could not extract text from URL: ${error.message}`;
    }
  }

  /**
   * Get system prompt based on recipe type
   */
  private static getSystemPrompt(recipeType: RecipeType): string {
    const basePrompt = "You are an expert recipe formatter. Extract and structure recipes into clean, professional format. Always respond with valid JSON only.";

    switch (recipeType) {
      case 'cocktail':
        return `${basePrompt} You specialize in alcoholic cocktails and mixed drinks. Focus on proper measurements, technique terminology (shake, stir, build), appropriate glassware, and classic garnishes. Pay attention to balance, flavor profiles, and presentation.`;

      case 'mocktail':
        return `${basePrompt} You specialize in non-alcoholic cocktails and mocktails. Focus on creative flavor combinations, fresh ingredients, interesting textures, and virgin alternatives to classic cocktails. Emphasize refreshing and sophisticated non-alcoholic beverages.`;

      case 'spirits-education':
        return `${basePrompt} You specialize in educational content about spirits, distillation processes, and tasting notes. Focus on history, production methods, flavor profiles, and proper tasting techniques. Include educational context and background information.`;

      case 'general':
      default:
        return `${basePrompt} You handle all types of drink recipes. Focus on clarity, accuracy, and proper formatting regardless of whether the recipe is alcoholic or non-alcoholic.`;
    }
  }

  /**
   * Build the AI prompt based on available input data
   */
  private static buildPrompt(input: RecipeInput): string {
    const recipeType = input.recipeType || 'cocktail';
    const typeSpecificInstructions = this.getTypeSpecificInstructions(recipeType);

    let prompt = `Please format this recipe/drink information into a structured JSON format with the following schema:

{
  "title": "Recipe name",
  "description": "Brief description",
  "ingredients": [
    {"name": "ingredient name", "amount": "measurement", "notes": "optional notes"}
  ],
  "instructions": ["step 1", "step 2", ...],
  "garnish": "garnish description (if applicable)",
  "glassware": "recommended glass",
  "difficulty": "Easy|Medium|Hard",
  "time": "preparation time",
  "servings": 1,
  "tags": ["tag1", "tag2"]
}

${typeSpecificInstructions}

Input data:
`;

    if (input.title) {
      prompt += `\nTitle: ${input.title}`;
    }

    if (input.sourceUrl) {
      prompt += `\nSource URL: ${input.sourceUrl}`;
    }

    if (input.extractedText) {
      prompt += `\nExtracted text: ${input.extractedText}`;
    }

    if (input.userNotes) {
      prompt += `\nUser notes: ${input.userNotes}`;
    }

    prompt += `\n\nPlease extract the recipe information and format it as valid JSON. Focus on clarity and accuracy.`;

    return prompt;
  }

  /**
   * Get type-specific formatting instructions
   */
  private static getTypeSpecificInstructions(recipeType: RecipeType): string {
    switch (recipeType) {
      case 'cocktail':
        return `
COCKTAIL-SPECIFIC REQUIREMENTS:
- Use proper bar terminology (muddle, shake, stir, build, strain, etc.)
- Include appropriate glassware (rocks, coupe, highball, martini, etc.)
- Specify garnish details (how to prepare and place)
- Use standard bar measurements (oz, dashes, splash, etc.)
- Include tags like: classic, modern, stirred, shaken, spirit-forward, etc.
- Default difficulty based on technique complexity`;

      case 'mocktail':
        return `
MOCKTAIL-SPECIFIC REQUIREMENTS:
- Focus on non-alcoholic ingredients and substitutions
- Emphasize fresh, natural ingredients and flavors
- Include creative presentation and garnish ideas
- Use refreshing, health-conscious language in descriptions
- Include tags like: virgin, refreshing, fruity, herbal, etc.
- Suggest virgin alternatives to classic cocktails when applicable`;

      case 'spirits-education':
        return `
SPIRITS EDUCATION REQUIREMENTS:
- Include detailed description with educational context
- Focus on tasting notes, production methods, or history
- Use educational and informative language
- Include tags related to spirit type, region, production method
- Emphasize learning objectives and key takeaways
- Structure as educational content rather than just a recipe`;

      case 'general':
      default:
        return `
GENERAL FORMATTING:
- Handle both alcoholic and non-alcoholic recipes appropriately
- Use clear, accessible language for all skill levels
- Include helpful tips and variations when applicable
- Use appropriate tags based on content type`;
    }
  }

  /**
   * Validate and clean the AI response
   */
  private static validateAndCleanRecipe(recipe: FormattedRecipe): FormattedRecipe {
    return {
      title: recipe.title || 'Untitled Recipe',
      description: recipe.description || 'Recipe description',
      ingredients: recipe.ingredients || [],
      instructions: recipe.instructions || [],
      garnish: recipe.garnish,
      glassware: recipe.glassware || 'Rocks Glass',
      difficulty: recipe.difficulty || 'Medium',
      time: recipe.time || '5 min',
      servings: recipe.servings || 1,
      tags: recipe.tags || ['cocktail']
    };
  }

  /**
   * Generate mock formatted recipe for development mode
   */
  private static getMockFormattedRecipe(input: RecipeInput): FormattedRecipe {
    const recipeType = input.recipeType || 'cocktail';

    switch (recipeType) {
      case 'cocktail':
        // Attempt to parse user input for specific requests
        const userRequest = (input.userNotes || input.title || '').toLowerCase();

        // Check for specific spirits mentioned
        if (userRequest.includes('tequila')) {
          return this.generateTequilaCocktail(userRequest, input);
        } else if (userRequest.includes('gin')) {
          return this.generateGinCocktail(userRequest, input);
        } else if (userRequest.includes('vodka')) {
          return this.generateVodkaCocktail(userRequest, input);
        } else if (userRequest.includes('rum')) {
          return this.generateRumCocktail(userRequest, input);
        }

        // Default fallback
        return {
          title: input.title || 'Classic Old Fashioned',
          description: 'A timeless whiskey cocktail with perfect balance of spirit, sweetness, and bitters.',
          ingredients: [
            { name: 'Bourbon Whiskey', amount: '2 oz', notes: 'High-rye preferred' },
            { name: 'Simple Syrup', amount: '0.25 oz', notes: 'Or 1 sugar cube' },
            { name: 'Angostura Bitters', amount: '2 dashes', notes: 'Essential for complexity' },
            { name: 'Orange Peel', amount: '1 large piece', notes: 'For oils and garnish' },
          ],
          instructions: [
            'Add simple syrup and bitters to rocks glass',
            'Add whiskey and stir to combine',
            'Add large ice cube',
            'Express orange peel oils over drink and drop in'
          ],
          garnish: 'Orange peel twist',
          glassware: 'Rocks Glass',
          difficulty: 'Easy' as const,
          time: '3 min',
          servings: 1,
          tags: ['classic', 'stirred', 'spirit-forward', 'whiskey']
        };

      case 'mocktail':
        return {
          title: input.title || 'Virgin Mojito',
          description: 'A refreshing non-alcoholic cocktail with fresh mint, lime, and sparkling water.',
          ingredients: [
            { name: 'Fresh Mint Leaves', amount: '8-10 leaves', notes: 'Muddle gently' },
            { name: 'Fresh Lime Juice', amount: '1 oz', notes: 'Freshly squeezed' },
            { name: 'Simple Syrup', amount: '0.75 oz', notes: 'Adjust to taste' },
            { name: 'Sparkling Water', amount: '4 oz', notes: 'Top to fill' },
          ],
          instructions: [
            'Gently muddle mint leaves in bottom of glass',
            'Add lime juice and simple syrup',
            'Fill with ice and stir',
            'Top with sparkling water and stir once'
          ],
          garnish: 'Fresh mint sprig and lime wheel',
          glassware: 'Highball Glass',
          difficulty: 'Easy' as const,
          time: '2 min',
          servings: 1,
          tags: ['virgin', 'refreshing', 'mint', 'citrus', 'sparkling']
        };

      case 'spirits-education':
        return {
          title: input.title || 'Bourbon Tasting Guide',
          description: 'Learn to identify key characteristics of bourbon whiskey through proper tasting technique.',
          ingredients: [
            { name: 'Bourbon Whiskey', amount: '0.5 oz', notes: '100 proof recommended' },
            { name: 'Spring Water', amount: '0.25 oz', notes: 'For dilution if needed' },
          ],
          instructions: [
            'Pour bourbon into tulip-shaped glass',
            'Observe color and viscosity',
            'Nose the whiskey with mouth slightly open',
            'Take small sip and let it coat your palate',
            'Identify flavors: vanilla, caramel, oak, spice'
          ],
          garnish: 'None - focus on pure spirit',
          glassware: 'Glencairn or Tulip Glass',
          difficulty: 'Medium' as const,
          time: '10 min',
          servings: 1,
          tags: ['education', 'tasting', 'bourbon', 'technique', 'spirits']
        };

      case 'general':
      default:
        return {
          title: input.title || 'Classic Drink',
          description: 'A well-crafted beverage with balanced flavors.',
          ingredients: [
            { name: 'Main Ingredient', amount: '2 oz', notes: 'Primary component' },
            { name: 'Modifier', amount: '0.5 oz', notes: 'Balancing element' },
          ],
          instructions: [
            'Combine ingredients in appropriate vessel',
            'Mix using proper technique',
            'Serve in suitable glassware'
          ],
          garnish: 'Appropriate garnish',
          glassware: 'Appropriate Glass',
          difficulty: 'Easy' as const,
          time: '3 min',
          servings: 1,
          tags: ['classic', 'balanced']
        };
    }
  }

  /**
   * Generate mock vision analysis for development mode
   */
  private static getMockVisionAnalysis(recipeType: RecipeType): FormattedRecipe {
    const mockAnalyses = {
      cocktail: {
        title: 'Classic Negroni',
        description: 'A perfectly balanced Italian cocktail with equal parts gin, Campari, and sweet vermouth, garnished with orange peel.',
        ingredients: [
          { name: 'Gin', amount: '1 oz', notes: 'London Dry preferred' },
          { name: 'Campari', amount: '1 oz', notes: 'Italian bitter aperitif' },
          { name: 'Sweet Vermouth', amount: '1 oz', notes: 'Carpano Antica Formula recommended' },
          { name: 'Orange Peel', amount: '1 large piece', notes: 'For garnish and oils' },
        ],
        instructions: [
          'Add gin, Campari, and sweet vermouth to mixing glass with ice',
          'Stir for 20-30 seconds until well chilled',
          'Strain into rocks glass over large ice cube',
          'Express orange peel oils over drink and garnish'
        ],
        garnish: 'Orange peel twist',
        glassware: 'Rocks Glass',
        difficulty: 'Easy' as const,
        time: '2 min',
        servings: 1,
        tags: ['classic', 'italian', 'bitter', 'aperitif', 'stirred']
      },
      mocktail: {
        title: 'Sparkling Cucumber Mint Cooler',
        description: 'A refreshing non-alcoholic drink with cucumber, fresh mint, lime, and sparkling water.',
        ingredients: [
          { name: 'Fresh Cucumber', amount: '3 slices', notes: 'Peeled and muddled' },
          { name: 'Fresh Mint Leaves', amount: '6-8 leaves', notes: 'Gently muddled' },
          { name: 'Fresh Lime Juice', amount: '1 oz', notes: 'Freshly squeezed' },
          { name: 'Simple Syrup', amount: '0.5 oz', notes: 'Adjust to taste' },
          { name: 'Sparkling Water', amount: '4 oz', notes: 'Chilled' },
        ],
        instructions: [
          'Gently muddle cucumber and mint in glass',
          'Add lime juice and simple syrup',
          'Fill with ice and stir',
          'Top with sparkling water',
          'Garnish with cucumber wheel and mint sprig'
        ],
        garnish: 'Cucumber wheel and fresh mint sprig',
        glassware: 'Highball Glass',
        difficulty: 'Easy' as const,
        time: '3 min',
        servings: 1,
        tags: ['virgin', 'refreshing', 'cucumber', 'mint', 'sparkling', 'summer']
      },
      'spirits-education': {
        title: 'Single Malt Scotch Tasting',
        description: 'Educational tasting guide for single malt Scotch whisky, focusing on regional characteristics and flavor profiles.',
        ingredients: [
          { name: 'Single Malt Scotch', amount: '0.5 oz', notes: 'Highland or Speyside recommended' },
          { name: 'Spring Water', amount: '0.25 oz', notes: 'For dilution if needed' },
        ],
        instructions: [
          'Pour whisky into Glencairn glass',
          'Observe color: pale gold to deep amber',
          'Nose without water: identify initial aromas',
          'Add few drops of water if above 46% ABV',
          'Nose again: notice how aromas open up',
          'Take small sip, let it coat palate',
          'Identify flavors: fruit, honey, spice, smoke',
          'Note the finish: length and evolution'
        ],
        garnish: 'None - focus on pure spirit',
        glassware: 'Glencairn Glass',
        difficulty: 'Medium' as const,
        time: '15 min',
        servings: 1,
        tags: ['education', 'tasting', 'scotch', 'whisky', 'technique', 'spirits']
      },
      general: {
        title: 'House Special',
        description: 'A well-balanced beverage with quality ingredients and careful preparation.',
        ingredients: [
          { name: 'Base Spirit', amount: '2 oz', notes: 'Premium quality' },
          { name: 'Modifier', amount: '0.75 oz', notes: 'Complementary flavor' },
          { name: 'Accent', amount: '2 dashes', notes: 'For complexity' },
        ],
        instructions: [
          'Combine ingredients in mixing vessel',
          'Add ice and stir or shake as appropriate',
          'Strain into suitable glassware',
          'Garnish appropriately and serve'
        ],
        garnish: 'Appropriate garnish',
        glassware: 'Appropriate Glass',
        difficulty: 'Medium' as const,
        time: '4 min',
        servings: 1,
        tags: ['house-special', 'balanced', 'premium']
      }
    };

    return mockAnalyses[recipeType] || mockAnalyses.cocktail;
  }

  /**
   * Generate tequila-based cocktail based on user request
   */
  private static generateTequilaCocktail(userRequest: string, input: RecipeInput): FormattedRecipe {
    // Check for specific flavor profiles
    if (userRequest.includes('watermelon')) {
      return {
        title: input.title || 'Watermelon Tequila Refresher',
        description: 'A refreshing summer cocktail combining fresh watermelon with smooth tequila and lime.',
        ingredients: [
          { name: 'Tequila Blanco', amount: '2 oz', notes: '100% agave preferred' },
          { name: 'Fresh Watermelon Juice', amount: '3 oz', notes: 'Muddle fresh watermelon' },
          { name: 'Fresh Lime Juice', amount: '0.75 oz', notes: 'Freshly squeezed' },
          { name: 'Agave Nectar', amount: '0.5 oz', notes: 'Adjust to taste' },
          { name: 'Tajín', amount: 'Pinch', notes: 'For rim and garnish' },
        ],
        instructions: [
          'Rim glass with lime juice and Tajín seasoning',
          'Muddle fresh watermelon in shaker',
          'Add tequila, lime juice, and agave nectar',
          'Shake vigorously with ice',
          'Double strain over fresh ice',
          'Garnish with watermelon wedge and lime wheel'
        ],
        garnish: 'Watermelon wedge and lime wheel',
        glassware: 'Rocks Glass',
        difficulty: 'Easy' as const,
        time: '4 min',
        servings: 1,
        tags: ['tequila', 'fresh', 'summer', 'refreshing', 'fruit']
      };
    }

    // Default tequila cocktail (Margarita variation)
    return {
      title: input.title || 'Perfect Margarita',
      description: 'A classic tequila cocktail with the perfect balance of citrus and agave.',
      ingredients: [
        { name: 'Tequila Blanco', amount: '2 oz', notes: '100% agave preferred' },
        { name: 'Fresh Lime Juice', amount: '1 oz', notes: 'Freshly squeezed' },
        { name: 'Orange Liqueur', amount: '0.75 oz', notes: 'Cointreau or Grand Marnier' },
        { name: 'Agave Nectar', amount: '0.25 oz', notes: 'Optional, to taste' },
      ],
      instructions: [
        'Add all ingredients to shaker with ice',
        'Shake vigorously for 15 seconds',
        'Strain over fresh ice in salt-rimmed glass',
        'Garnish with lime wheel'
      ],
      garnish: 'Lime wheel',
      glassware: 'Rocks Glass',
      difficulty: 'Easy' as const,
      time: '3 min',
      servings: 1,
      tags: ['tequila', 'classic', 'citrus', 'shaken']
    };
  }

  /**
   * Generate gin-based cocktail based on user request
   */
  private static generateGinCocktail(userRequest: string, input: RecipeInput): FormattedRecipe {
    if (userRequest.includes('cucumber')) {
      return {
        title: input.title || 'Cucumber Gin Cooler',
        description: 'A refreshing gin cocktail with crisp cucumber and bright citrus.',
        ingredients: [
          { name: 'London Dry Gin', amount: '2 oz', notes: 'Hendricks works great' },
          { name: 'Fresh Cucumber', amount: '4 slices', notes: 'Muddle 3, reserve 1 for garnish' },
          { name: 'Fresh Lime Juice', amount: '0.75 oz', notes: 'Freshly squeezed' },
          { name: 'Simple Syrup', amount: '0.5 oz', notes: 'Adjust to taste' },
          { name: 'Soda Water', amount: '2 oz', notes: 'To top' },
        ],
        instructions: [
          'Muddle cucumber slices in shaker',
          'Add gin, lime juice, and simple syrup',
          'Shake with ice and double strain',
          'Serve over ice and top with soda water',
          'Garnish with cucumber slice'
        ],
        garnish: 'Cucumber slice',
        glassware: 'Highball Glass',
        difficulty: 'Easy' as const,
        time: '3 min',
        servings: 1,
        tags: ['gin', 'fresh', 'cucumber', 'refreshing']
      };
    }

    // Default gin cocktail
    return {
      title: input.title || 'Classic Gin & Tonic',
      description: 'The perfect gin and tonic with premium ingredients and proper garnish.',
      ingredients: [
        { name: 'London Dry Gin', amount: '2 oz', notes: 'Premium quality' },
        { name: 'Tonic Water', amount: '4-6 oz', notes: 'Premium tonic, chilled' },
        { name: 'Fresh Lime', amount: '2 wedges', notes: 'One for squeeze, one for garnish' },
      ],
      instructions: [
        'Fill highball glass with ice',
        'Add gin and squeeze lime wedge',
        'Top with chilled tonic water',
        'Stir gently once',
        'Garnish with lime wedge'
      ],
      garnish: 'Lime wedge',
      glassware: 'Highball Glass',
      difficulty: 'Easy' as const,
      time: '2 min',
      servings: 1,
      tags: ['gin', 'classic', 'simple', 'refreshing']
    };
  }

  /**
   * Generate vodka-based cocktail based on user request
   */
  private static generateVodkaCocktail(userRequest: string, input: RecipeInput): FormattedRecipe {
    return {
      title: input.title || 'Premium Moscow Mule',
      description: 'A classic vodka cocktail with spicy ginger beer and fresh lime.',
      ingredients: [
        { name: 'Premium Vodka', amount: '2 oz', notes: 'High-quality vodka' },
        { name: 'Fresh Lime Juice', amount: '0.5 oz', notes: 'Freshly squeezed' },
        { name: 'Ginger Beer', amount: '4 oz', notes: 'Spicy ginger beer' },
      ],
      instructions: [
        'Fill copper mug with ice',
        'Add vodka and lime juice',
        'Top with ginger beer',
        'Stir gently',
        'Garnish with lime wheel'
      ],
      garnish: 'Lime wheel',
      glassware: 'Copper Mug',
      difficulty: 'Easy' as const,
      time: '2 min',
      servings: 1,
      tags: ['vodka', 'classic', 'spicy', 'refreshing']
    };
  }

  /**
   * Generate rum-based cocktail based on user request
   */
  private static generateRumCocktail(userRequest: string, input: RecipeInput): FormattedRecipe {
    return {
      title: input.title || 'Classic Mojito',
      description: 'A refreshing Cuban cocktail with white rum, fresh mint, and lime.',
      ingredients: [
        { name: 'White Rum', amount: '2 oz', notes: 'Light Cuban-style rum' },
        { name: 'Fresh Mint Leaves', amount: '8-10 leaves', notes: 'Gently muddled' },
        { name: 'Fresh Lime Juice', amount: '1 oz', notes: 'Freshly squeezed' },
        { name: 'Simple Syrup', amount: '0.75 oz', notes: 'Adjust to taste' },
        { name: 'Soda Water', amount: '2 oz', notes: 'To top' },
      ],
      instructions: [
        'Gently muddle mint leaves in glass',
        'Add lime juice and simple syrup',
        'Fill with ice and add rum',
        'Stir to combine',
        'Top with soda water',
        'Garnish with mint sprig and lime wheel'
      ],
      garnish: 'Mint sprig and lime wheel',
      glassware: 'Highball Glass',
      difficulty: 'Easy' as const,
      time: '3 min',
      servings: 1,
      tags: ['rum', 'classic', 'mint', 'refreshing', 'cuban']
    };
  }

  /**
   * Test the AI formatting with sample data
   */
  static async testFormatting(): Promise<FormattedRecipe> {
    const testInput: RecipeInput = {
      title: "Old Fashioned",
      extractedText: "2 oz bourbon whiskey, 1/4 oz simple syrup, 2 dashes angostura bitters, orange peel for garnish. Stir ingredients with ice, strain over large ice cube, express orange oils over drink.",
      userNotes: "Classic cocktail, served in rocks glass"
    };

    return this.formatRecipe(testInput);
  }
}