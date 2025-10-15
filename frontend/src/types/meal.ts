// Meal Planner Types
export interface NutritionInfo {
  calories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
  fiber: number;
  iron: number;
  calcium: number;
  folate: number;
  vitaminA: number;
  vitaminC: number;
  servingSize: string;
}

export interface MealDetails {
  name: string;
  why: string;
  benefits: string; // Backend returns string, not array
  facts: string; // Backend returns string, not array
  steps: string; // Backend returns string, not array
  nutrition: NutritionInfo;
}

export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';

export interface MealSuggestion {
  id: string;
  type: MealType;
  content: MealDetails; // Already parsed from backend
  orderIndex: number;
  isSelected: boolean;
  createdAt: string;
}

export interface GroupedMealSuggestions {
  breakfast: MealSuggestion[];
  lunch: MealSuggestion[];
  dinner: MealSuggestion[];
  snack: MealSuggestion[];
}

export interface MealPlan {
  id: string;
  userId: string;
  title: string;
  date: string;
  createdAt: string;
  suggestions: GroupedMealSuggestions; // Changed from MealSuggestion[] to grouped object
}

export interface DailyNutritionGoal {
  calories: number;
  protein: number;
  iron: number;
  calcium: number;
  folate: number;
  vitaminA: number;
  vitaminC: number;
}

export interface NutritionProgress {
  current: DailyNutritionGoal;
  goal: DailyNutritionGoal;
  percentage: {
    calories: number;
    protein: number;
    iron: number;
    calcium: number;
    folate: number;
    vitaminA: number;
    vitaminC: number;
  };
}
