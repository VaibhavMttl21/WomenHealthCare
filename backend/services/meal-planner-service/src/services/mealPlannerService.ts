/**
 * Meal Planner Service - Main Orchestrator
 * 
 * This is the main service that orchestrates all meal planning operations.
 * It coordinates between different specialized services:
 * - geminiService: AI meal generation
 * - learningService: User preference analysis
 * - personalizationService: Context building
 * - databaseService: Data persistence
 */

import { MealPlanResponse } from '../types/mealPlanner.types';
import { generateMealSuggestionsWithGemini } from './geminiService';
import { analyzeUserPreferences } from './learningService';
import { buildPersonalizedContext } from './personalizationService';
import {
  createMealPlanWithSuggestions,
  getMealPlanById as dbGetMealPlanById,
  getUserMealPlans as dbGetUserMealPlans,
  getTodayMealPlan as dbGetTodayMealPlan,
  updateSuggestionSelection as dbUpdateSuggestionSelection,
  deleteMealPlan as dbDeleteMealPlan,
} from './databaseService';

/**
 * GENERATE (CREATE) - Generate a fresh daily meal plan using Gemini AI with learning
 * 
 * Purpose: Creates a new personalized meal plan for the user with AI-generated suggestions.
 * Each plan includes 8 suggestions (2 alternatives for breakfast, lunch, dinner, snack).
 * 
 * Why needed: Users need fresh recommendations daily/weekly to:
 * - Avoid meal monotony
 * - Get variety in nutrition
 * - Adapt to changing pregnancy stages
 * - Consider budget and seasonal ingredients
 * 
 * Learning Features:
 * - Analyzes past selections to understand preferences
 * - Learns budget vs normal preference patterns
 * - Identifies favorite ingredients from history
 * - Adapts to meal type engagement levels
 * - Personalizes based on selection history
 * 
 * @param userId - The user ID for whom to generate the meal plan
 * @param userProfile - Optional user profile for personalization (pregnancy stage, diet preferences, etc.)
 * @returns Complete meal plan with grouped suggestions ready for frontend consumption
 */
export async function generateDailyMealPlan(
  userId: string,
  userProfile: string = ''
): Promise<MealPlanResponse> {
  try {
    // Step 1: LEARN from user history (analyze past selections)
    const learningContext = await analyzeUserPreferences(userId);
    
    // Step 2: Build enhanced context combining user profile + learned preferences
    const enhancedContext = buildPersonalizedContext(userProfile, learningContext);
    
    // Step 3: Generate meal suggestions using Gemini AI with personalization
    const mealSuggestions = await generateMealSuggestionsWithGemini(enhancedContext);

    // Step 4: Save meal plan and suggestions to database
    const mealPlanId = await createMealPlanWithSuggestions(userId, mealSuggestions);

    // Step 5: Fetch and return the complete meal plan with grouped suggestions
    const completeMealPlan = await dbGetMealPlanById(mealPlanId);

    return completeMealPlan;
  } catch (error: any) {
    console.error('Error generating daily meal plan:', error);
    throw new Error(`Failed to generate meal plan: ${error.message}`);
  }
}

/**
 * READ (GET ONE) - Fetch a specific meal plan by ID
 * 
 * Purpose: Retrieve a saved meal plan with all its suggestions.
 * Used when user wants to:
 * - View today's meal plan while cooking
 * - Review preparation steps
 * - Share plan with family
 * - Show nutritionist/doctor their eating plan
 * 
 * @param mealPlanId - The unique ID of the meal plan
 * @returns Complete meal plan with suggestions grouped by meal type (breakfast, lunch, dinner, snack)
 */
export async function getMealPlanById(mealPlanId: string): Promise<MealPlanResponse> {
  return dbGetMealPlanById(mealPlanId);
}

/**
 * READ (GET MANY) - Fetch all meal plans for a user
 * 
 * Purpose: Retrieve user's meal plan history.
 * Use cases:
 * - Browse past week's meals
 * - Find favorite recipes tried before
 * - Track eating patterns over time
 * - Review nutrition variety
 * - Prepare for doctor appointment (show what you've been eating)
 * - Make shopping list based on common ingredients
 * 
 * @param userId - The user ID whose plans to fetch
 * @param limit - Maximum number of plans to return (default: 10)
 * @returns Array of meal plans, most recent first
 */
export async function getUserMealPlans(
  userId: string,
  limit: number = 10
): Promise<MealPlanResponse[]> {
  return dbGetUserMealPlans(userId, limit);
}

/**
 * READ (GET TODAY) - Fetch today's meal plan for a user
 * 
 * Purpose: Get the current day's meal plan if it exists.
 * Use cases:
 * - Check if user already has a plan for today
 * - Auto-load today's recommendations on page load
 * - Avoid duplicate plan generation
 * 
 * @param userId - The user ID whose today's plan to fetch
 * @returns Today's meal plan or null if not found
 */
export async function getTodayMealPlan(userId: string): Promise<MealPlanResponse | null> {
  return dbGetTodayMealPlan(userId);
}

/**
 * UPDATE - Mark a meal suggestion as selected/preferred
 * 
 * Purpose: Track which meal alternatives the user actually chose.
 * Why this matters:
 * - User tries both breakfast options → likes Option 2 → marks it selected
 * - System learns user preferences (budget-friendly vs normal)
 * - Future AI recommendations can be personalized
 * - Analytics: Which meals are most popular?
 * - Family preferences: Track what the family enjoys
 * 
 * Example Flow:
 * User sees: "Poha with vegetables (₹20)" vs "Ragi porridge (₹10)"
 * User tries: Ragi porridge
 * User likes it: Marks as selected ✓
 * Next generation: AI prioritizes similar budget-friendly options
 * 
 * @param suggestionId - The ID of the suggestion to update
 * @param isSelected - true if user selected this option, false otherwise
 */
export async function updateSuggestionSelection(
  suggestionId: string,
  isSelected: boolean
): Promise<void> {
  return dbUpdateSuggestionSelection(suggestionId, isSelected);
}

/**
 * DELETE (SOFT DELETE) - Remove/Archive a meal plan
 * 
 * Purpose: Clean up old or unwanted meal plans while preserving data.
 * Use cases:
 * - Monthly cleanup: Archive plans older than 30 days
 * - Mistake: User generated plan by accident then delete it
 * - Privacy: User wants to clear history
 * - Database optimization: Keep only recent active plans
 * 
 * Technical Detail: This is a soft delete (isActive = false)
 * - Data is NOT permanently deleted
 * - Preserved for analytics and reporting
 * - Can be recovered if needed
 * - Will not show in users active meal list
 * 
 * @param mealPlanId - The ID of the meal plan to delete or archive
 */
export async function deleteMealPlan(mealPlanId: string): Promise<void> {
  return dbDeleteMealPlan(mealPlanId);
}

export default {
  generateDailyMealPlan,
  getMealPlanById,
  getUserMealPlans,
  getTodayMealPlan,
  updateSuggestionSelection,
  deleteMealPlan,
};
