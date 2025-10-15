// Type definitions for Meal Planner Service

export interface NutritionInfo {
  calories: number; // Total calories in kcal
  protein: number; // Protein in grams
  carbohydrates: number; // Carbs in grams
  fats: number; // Fats in grams
  fiber: number; // Fiber in grams
  iron: number; // Iron in mg
  calcium: number; // Calcium in mg
  vitaminA?: number; // Vitamin A in mcg (optional)
  vitaminC?: number; // Vitamin C in mg (optional)
  folate?: number; // Folate in mcg (optional)
  servingSize: string; // e.g., "1 plate", "1 bowl", "100g"
}

export interface MealSuggestionContent {
  name: string;
  why: string;
  benefits: string;
  facts: string;
  steps: string;
  nutrition: NutritionInfo; // Detailed nutrition information
}

export interface MealSuggestionsResponse {
  breakfast: MealSuggestionContent[];
  lunch: MealSuggestionContent[];
  dinner: MealSuggestionContent[];
  snack: MealSuggestionContent[];
}

export interface GenerateMealPlanRequest {
  userId: string;
  userProfile?: string;
  title?: string;
}

export interface MealPlanResponse {
  id: string;
  userId: string;
  title: string;
  date: string;
  createdAt: string;
  suggestions: GroupedMealSuggestions;
}

export interface GroupedMealSuggestions {
  breakfast: MealSuggestionItem[];
  lunch: MealSuggestionItem[];
  dinner: MealSuggestionItem[];
  snack: MealSuggestionItem[];
}

export interface MealSuggestionItem {
  id: string;
  type: string;
  content: MealSuggestionContent;
  orderIndex: number;
  isSelected: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Learning and Personalization Types
export interface UserLearningContext {
  budgetPreference: number; // 0-1 scale: 0 = prefers normal, 1 = prefers budget
  topIngredients: string[]; // Most frequently selected ingredients
  mealTypeEngagement: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snack: number;
  };
  favoriteMeals: string[]; // Names of most selected meals
  averageCost: number; // Average cost of selected meals
  totalSelections: number; // Total number of selections made
  learningConfidence: number; // 0-1 scale: confidence in learned preferences
}

export interface PersonalizedContext {
  // User profile data (will be enhanced later)
  userProfile: string;
  pregnancyStage?: string;
  dietaryRestrictions?: string[];
  allergies?: string[];
  region?: string;
  
  // Learned preferences from history
  budgetPreference: 'high' | 'medium' | 'low'; // high = prefers budget options
  preferredIngredients: string[];
  avoidIngredients: string[];
  favoriteMealTypes: string[];
  averageBudget: number;
  
  // Personalization metadata
  hasHistory: boolean;
  confidenceLevel: number;
}
