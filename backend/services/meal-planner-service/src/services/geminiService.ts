/**
 * Gemini AI Service
 * 
 * Handles all interactions with Google's Gemini AI for meal plan generation.
 * This service is responsible for:
 * - Building AI prompts with personalization
 * - Calling Gemini API with proper configuration
 * - Parsing and validating AI responses
 * - Error handling and retries
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  MealSuggestionsResponse,
  MealSuggestionContent,
  PersonalizedContext,
} from '../types/mealPlanner.types';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Generate meal suggestions using Gemini AI with enhanced nutrition information
 * 
 * @param context - Personalized context with user profile and learned preferences
 * @returns Structured meal suggestions with detailed nutrition for all 4 meal types
 */
export async function generateMealSuggestionsWithGemini(
  context: PersonalizedContext
): Promise<MealSuggestionsResponse> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192, // Increased for detailed nutrition info
      },
    });

    // Build personalized prompt based on learned preferences
    const personalizationPrompt = buildPersonalizationPrompt(context);

    // Build the base prompt with user profile if available
    const profileContext = context.userProfile
      ? `\n\nUser Profile for Personalization: ${context.userProfile}`
      : '';

    const prompt = `Generate 2 alternative meal suggestions for each meal of today (breakfast, lunch, dinner, snack) for women before, during, or after pregnancy.

Constraints:
- Use only locally available ingredients in rural India.
- Every ingredient must include its local Hinglish name in brackets wherever it appears (meal name, steps, facts, benefits, etc.).
- Use simple, easy-to-understand language.
- Include real nutrition/food facts in the 'facts' field.
- Avoid urban/fancy ingredients.
- First suggestion: normal nutritious option.
- Second suggestion: cost-effective alternative, still nutritious.

${personalizationPrompt}

For each meal suggestion, include:
1. 'name': Name of the meal (all ingredients in Hinglish brackets)
2. 'why': Why it is recommended for women's health
3. 'benefits': Key nutrients or health benefits (mention all ingredients with Hinglish)
4. 'facts': Relevant nutrition/food facts for the ingredients (with Hinglish names)
5. 'steps': Concise preparation steps using simple language (mention all ingredients with Hinglish)
6. 'nutrition': DETAILED nutrition information object with:
   - calories: Total calories in kcal (number)
   - protein: Protein in grams (number)
   - carbohydrates: Carbs in grams (number)
   - fats: Total fats in grams (number)
   - fiber: Dietary fiber in grams (number)
   - iron: Iron in mg (number)
   - calcium: Calcium in mg (number)
   - vitaminA: Vitamin A in mcg (number, optional but recommended for pregnancy)
   - vitaminC: Vitamin C in mg (number, optional but recommended for pregnancy)
   - folate: Folate/Folic acid in mcg (number, CRITICAL for pregnancy)
   - servingSize: Serving size description (string, e.g., "1 plate (200g)", "1 bowl (150ml)")

**IMPORTANT**: Provide accurate, realistic nutrition values based on standard Indian meal portions. For pregnancy nutrition, ensure adequate folate, iron, and calcium.

Return the response in **strict JSON format only**, exactly like this example:

{
  "breakfast": [
    {
      "name": "Rice flakes (Poha) with peas (Matar) and peanuts (Moongphali)",
      "why": "Light, easy to digest, provides energy and protein for women during pregnancy",
      "benefits": "Carbohydrates from rice flakes (Poha), protein and iron from peas (Matar), healthy fats from peanuts (Moongphali)",
      "facts": "Rice flakes (Poha) are rich in carbs. Peas (Matar) provide plant protein and iron. Peanuts (Moongphali) contain healthy fats and protein.",
      "steps": "Wash rice flakes (Poha). Sauté peas (Matar) and peanuts (Moongphali) with onion (Pyaz), green chili (Hari Mirch), and turmeric (Haldi). Mix with Poha and serve with lemon (Nimbu).",
      "nutrition": {
        "calories": 280,
        "protein": 8,
        "carbohydrates": 50,
        "fats": 7,
        "fiber": 5,
        "iron": 3,
        "calcium": 40,
        "vitaminA": 100,
        "vitaminC": 15,
        "folate": 80,
        "servingSize": "1 plate (200g)"
      }
    },
    {
      "name": "Ragi (Nachni) porridge with jaggery (Gur) and milk (Doodh)",
      "why": "Cost-effective, rich in calcium and iron, boosts morning energy",
      "benefits": "Calcium from ragi (Nachni) and milk (Doodh), iron from jaggery (Gur), fiber aids digestion",
      "facts": "Ragi (Nachni) is high in calcium. Jaggery (Gur) is a natural source of iron. Milk (Doodh) provides protein and calcium.",
      "steps": "Cook ragi (Nachni) flour in water or milk (Doodh). Stir in jaggery (Gur) while warm. Serve hot.",
      "nutrition": {
        "calories": 200,
        "protein": 5,
        "carbohydrates": 38,
        "fats": 3,
        "fiber": 4,
        "iron": 3,
        "calcium": 300,
        "vitaminA": 50,
        "vitaminC": 5,
        "folate": 50,
        "servingSize": "1 bowl (150ml)"
      }
    }
  ],
  "lunch": [
    { "name": "", "why": "", "benefits": "", "facts": "", "steps": "", "nutrition": {} },
    { "name": "", "why": "", "benefits": "", "facts": "", "steps": "", "nutrition": {} }
  ],
  "dinner": [
    { "name": "", "why": "", "benefits": "", "facts": "", "steps": "", "nutrition": {} },
    { "name": "", "why": "", "benefits": "", "facts": "", "steps": "", "nutrition": {} }
  ],
  "snack": [
    { "name": "", "why": "", "benefits": "", "facts": "", "steps": "", "nutrition": {} },
    { "name": "", "why": "", "benefits": "", "facts": "", "steps": "", "nutrition": {} }
  ]
}

${profileContext}`;


    // Generate response from Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    // Clean and parse the response
    const cleanedResponse = cleanGeminiResponse(responseText);
    const parsedResponse: MealSuggestionsResponse = JSON.parse(cleanedResponse);

    // Validate the response structure
    validateMealSuggestionsResponse(parsedResponse);

    return parsedResponse;
  } catch (error: any) {
    console.error('Error generating meal suggestions with Gemini:', error);
    throw new Error(`Gemini API error: ${error.message}`);
  }
}

/**
 * Build personalization prompt from context
 */
function buildPersonalizationPrompt(context: PersonalizedContext): string {
  const prompts: string[] = [];
  
  if (!context.hasHistory || context.confidenceLevel < 0.3) {
    return '';
  }

  prompts.push('\n**PERSONALIZATION BASED ON USER HISTORY:**');

  if (context.budgetPreference === 'high') {
    prompts.push(
      `- User strongly prefers BUDGET-FRIENDLY options (average budget: ₹${Math.round(context.averageBudget)})`,
      `- Prioritize cost-effective ingredients and simple preparations`,
      `- Focus on locally available, seasonal, and affordable ingredients`
    );
  } else if (context.budgetPreference === 'low') {
    prompts.push(
      `- User prefers NORMAL nutritious options without strict budget constraints`,
      `- Can include slightly premium ingredients if nutritionally beneficial`
    );
  }

  if (context.preferredIngredients.length > 0) {
    prompts.push(
      `- User frequently selects meals with: ${context.preferredIngredients.join(', ')}`,
      `- Try to incorporate these ingredients where appropriate`
    );
  }

  if (context.favoriteMealTypes.length > 0) {
    prompts.push(
      `- User's favorite meals include: ${context.favoriteMealTypes.join(', ')}`,
      `- Consider variations of these successful recipes`
    );
  }

  if (context.dietaryRestrictions && context.dietaryRestrictions.length > 0) {
    prompts.push(
      `- DIETARY RESTRICTIONS: ${context.dietaryRestrictions.join(', ')}`,
      `- Ensure all suggestions comply with these restrictions`
    );
  }

  if (context.allergies && context.allergies.length > 0) {
    prompts.push(
      `- ALLERGIES: Avoid ${context.allergies.join(', ')}`,
      `- Do not include these ingredients in any form`
    );
  }

  if (context.pregnancyStage) {
    prompts.push(
      `- Pregnancy Stage: ${context.pregnancyStage}`,
      `- Tailor nutrition recommendations for this stage`
    );
  }

  if (context.region) {
    prompts.push(
      `- Region: ${context.region}`,
      `- Prioritize ingredients commonly available in this region`
    );
  }

  const confidencePercent = Math.round(context.confidenceLevel * 100);
  prompts.push(
    `\n(Personalization confidence: ${confidencePercent}% based on ${context.hasHistory ? 'user history' : 'default preferences'})`
  );

  return prompts.join('\n');
}

/**
 * Clean the Gemini response to extract pure JSON
 */
function cleanGeminiResponse(text: string): string {
  let cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  cleaned = cleaned.trim();

  const jsonStart = cleaned.indexOf('{');
  const jsonEnd = cleaned.lastIndexOf('}');

  if (jsonStart !== -1 && jsonEnd !== -1) {
    cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
  }

  return cleaned;
}

/**
 * Validate the meal suggestions response structure including nutrition
 */
function validateMealSuggestionsResponse(response: MealSuggestionsResponse): void {
  const requiredMealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
  const requiredFields = ['name', 'why', 'benefits', 'facts', 'steps', 'nutrition'];
  const requiredNutritionFields = [
    'calories',
    'protein',
    'carbohydrates',
    'fats',
    'fiber',
    'iron',
    'calcium',
    'servingSize',
  ];

  for (const mealType of requiredMealTypes) {
    if (!response[mealType as keyof MealSuggestionsResponse]) {
      throw new Error(`Missing meal type: ${mealType}`);
    }

    const meals = response[mealType as keyof MealSuggestionsResponse];
    if (!Array.isArray(meals) || meals.length !== 2) {
      throw new Error(`${mealType} must contain exactly 2 suggestions`);
    }

    meals.forEach((meal, index) => {
      for (const field of requiredFields) {
        if (!meal[field as keyof MealSuggestionContent]) {
          throw new Error(
            `Missing field '${field}' in ${mealType} suggestion ${index + 1}`
          );
        }
      }

      // Validate nutrition object
      const nutrition = meal.nutrition;
      if (typeof nutrition !== 'object') {
        throw new Error(
          `Nutrition must be an object in ${mealType} suggestion ${index + 1}`
        );
      }

      for (const nutriField of requiredNutritionFields) {
        if (nutrition[nutriField as keyof typeof nutrition] === undefined) {
          throw new Error(
            `Missing nutrition field '${nutriField}' in ${mealType} suggestion ${index + 1}`
          );
        }
      }
    });
  }
}
