/**
 * Personalization Service
 * 
 * Builds personalized context for AI meal generation by combining:
 * - User profile data (pregnancy stage, dietary restrictions, etc.)
 * - Learned preferences from historical selections
 * - Confidence-weighted recommendations
 */

import { UserLearningContext, PersonalizedContext } from '../types/mealPlanner.types';

/**
 * Build enhanced context combining profile + learned preferences
 * 
 * This function combines:
 * 1. User profile data (pregnancy stage, dietary restrictions, etc.)
 * 2. Learned preferences from history analysis
 * 3. Confidence-weighted recommendations
 * 
 * @param userProfile - Raw user profile string (will be structured object later)
 * @param learningContext - Analyzed learning data from user history
 * @returns PersonalizedContext for AI prompt enhancement
 */
export function buildPersonalizedContext(
  userProfile: string,
  learningContext: UserLearningContext
): PersonalizedContext {
  // Determine budget preference level
  let budgetPreference: 'high' | 'medium' | 'low' = 'medium';
  if (learningContext.learningConfidence > 0.5) {
    if (learningContext.budgetPreference > 0.7) {
      budgetPreference = 'high'; // User strongly prefers budget options
    } else if (learningContext.budgetPreference < 0.3) {
      budgetPreference = 'low'; // User prefers normal options
    }
  }

  // Build ingredient preferences
  const preferredIngredients = learningContext.topIngredients.slice(0, 5);
  
  // PLACEHOLDER: In future, we'll extract from user profile:
  // - pregnancyStage from UserProfile.pregnancyStage
  // - dietaryRestrictions from UserProfile.dietaryPreferences
  // - allergies from UserProfile.allergies or foodAllergies
  // - region from UserProfile.village/district/state
  
  return {
    userProfile,
    // TODO: Extract from structured UserProfile later
    pregnancyStage: undefined, // Will be: userProfileData.pregnancyStage
    dietaryRestrictions: undefined, // Will be: JSON.parse(userProfileData.dietaryPreferences)
    allergies: undefined, // Will be: JSON.parse(userProfileData.foodAllergies)
    region: undefined, // Will be: userProfileData.district + ', ' + userProfileData.state
    
    // Learned preferences
    budgetPreference,
    preferredIngredients,
    avoidIngredients: [], // TODO: Can be learned from non-selected items
    favoriteMealTypes: learningContext.favoriteMeals,
    averageBudget: learningContext.averageCost,
    
    // Metadata
    hasHistory: learningContext.totalSelections > 0,
    confidenceLevel: learningContext.learningConfidence,
  };
}
