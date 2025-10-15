/**
 * Database Service
 * 
 * Handles all database operations for meal plans and suggestions.
 * This service provides CRUD operations with proper error handling
 * and data transformation for the meal planner.
 */

import { PrismaClient } from '@prisma/client';
import {
  MealPlanResponse,
  GroupedMealSuggestions,
  MealSuggestionsResponse,
} from '../types/mealPlanner.types';

const prisma = new PrismaClient();

// Meal type enum
enum MealType {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  SNACK = 'SNACK',
}

/**
 * Create a new meal plan with suggestions
 * 
 * @param userId - The user ID
 * @param mealSuggestions - AI-generated meal suggestions
 * @returns Created meal plan with ID
 */
export async function createMealPlanWithSuggestions(
  userId: string,
  mealSuggestions: MealSuggestionsResponse
): Promise<string> {
  try {
    // Create meal plan
    const mealPlan = await (prisma as any).mealPlan.create({
      data: {
        userId,
        title: 'Daily Meal Plan',
        date: new Date(),
        isActive: true,
      },
    });

    // Save all meal suggestions to the database
    const suggestionPromises: Promise<any>[] = [];

    // Process breakfast suggestions (2 alternatives)
    mealSuggestions.breakfast.forEach((meal, index) => {
      suggestionPromises.push(
        (prisma as any).mealSuggestion.create({
          data: {
            mealPlanId: mealPlan.id,
            type: MealType.BREAKFAST,
            content: JSON.stringify(meal),
            orderIndex: index,
            isSelected: false,
          },
        })
      );
    });

    // Process lunch suggestions (2 alternatives)
    mealSuggestions.lunch.forEach((meal, index) => {
      suggestionPromises.push(
        (prisma as any).mealSuggestion.create({
          data: {
            mealPlanId: mealPlan.id,
            type: MealType.LUNCH,
            content: JSON.stringify(meal),
            orderIndex: index,
            isSelected: false,
          },
        })
      );
    });

    // Process dinner suggestions (2 alternatives)
    mealSuggestions.dinner.forEach((meal, index) => {
      suggestionPromises.push(
        (prisma as any).mealSuggestion.create({
          data: {
            mealPlanId: mealPlan.id,
            type: MealType.DINNER,
            content: JSON.stringify(meal),
            orderIndex: index,
            isSelected: false,
          },
        })
      );
    });

    // Process snack suggestions (2 alternatives)
    mealSuggestions.snack.forEach((meal, index) => {
      suggestionPromises.push(
        (prisma as any).mealSuggestion.create({
          data: {
            mealPlanId: mealPlan.id,
            type: MealType.SNACK,
            content: JSON.stringify(meal),
            orderIndex: index,
            isSelected: false,
          },
        })
      );
    });

    // Wait for all 8 suggestions to be saved (2 × 4 meal types)
    await Promise.all(suggestionPromises);

    return mealPlan.id;
  } catch (error: any) {
    console.error('Error creating meal plan with suggestions:', error);
    throw new Error(`Failed to create meal plan: ${error.message}`);
  }
}

/**
 * Fetch a specific meal plan by ID with grouped suggestions
 * 
 * @param mealPlanId - The unique ID of the meal plan
 * @returns Complete meal plan with suggestions grouped by meal type
 */
export async function getMealPlanById(mealPlanId: string): Promise<MealPlanResponse> {
  try {
    const mealPlan = await (prisma as any).mealPlan.findUnique({
      where: { id: mealPlanId },
      include: {
        suggestions: {
          orderBy: [{ type: 'asc' }, { orderIndex: 'asc' }],
        },
      },
    });

    if (!mealPlan) {
      throw new Error('Meal plan not found');
    }

    return transformMealPlan(mealPlan);
  } catch (error: any) {
    console.error('Error fetching meal plan:', error);
    throw new Error(`Failed to fetch meal plan: ${error.message}`);
  }
}

/**
 * Fetch all meal plans for a user
 * 
 * @param userId - The user ID whose plans to fetch
 * @param limit - Maximum number of plans to return
 * @returns Array of meal plans, most recent first
 */
export async function getUserMealPlans(
  userId: string,
  limit: number = 10
): Promise<MealPlanResponse[]> {
  try {
    const mealPlans = await (prisma as any).mealPlan.findMany({
      where: { userId, isActive: true },
      include: {
        suggestions: {
          orderBy: [{ type: 'asc' }, { orderIndex: 'asc' }],
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return mealPlans.map((plan: any) => transformMealPlan(plan));
  } catch (error: any) {
    console.error('Error fetching user meal plans:', error);
    throw new Error(`Failed to fetch meal plans: ${error.message}`);
  }
}

/**
 * Fetch today's meal plan for a user
 * 
 * @param userId - The user ID whose today's plan to fetch
 * @returns Today's meal plan or null if not found
 */
export async function getTodayMealPlan(userId: string): Promise<MealPlanResponse | null> {
  try {
    // Get start and end of today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const mealPlan = await (prisma as any).mealPlan.findFirst({
      where: {
        userId,
        isActive: true,
        date: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
      include: {
        suggestions: {
          orderBy: [{ type: 'asc' }, { orderIndex: 'asc' }],
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!mealPlan) {
      return null;
    }

    return transformMealPlan(mealPlan);
  } catch (error: any) {
    console.error('Error fetching today\'s meal plan:', error);
    throw new Error(`Failed to fetch today's meal plan: ${error.message}`);
  }
}

/**
 * Update a meal suggestion's selection status
 * 
 * @param suggestionId - The ID of the suggestion to update
 * @param isSelected - Whether the suggestion is selected
 */
export async function updateSuggestionSelection(
  suggestionId: string,
  isSelected: boolean
): Promise<void> {
  try {
    await (prisma as any).mealSuggestion.update({
      where: { id: suggestionId },
      data: { isSelected },
    });
  } catch (error: any) {
    console.error('Error updating suggestion selection:', error);
    throw new Error(`Failed to update selection: ${error.message}`);
  }
}

/**
 * Soft delete a meal plan (set isActive to false)
 * 
 * @param mealPlanId - The ID of the meal plan to delete
 */
export async function deleteMealPlan(mealPlanId: string): Promise<void> {
  try {
    await (prisma as any).mealPlan.update({
      where: { id: mealPlanId },
      data: { isActive: false },
    });
  } catch (error: any) {
    console.error('Error deleting meal plan:', error);
    throw new Error(`Failed to delete meal plan: ${error.message}`);
  }
}

/**
 * Transform raw meal plan data to grouped response format
 * 
 * @param mealPlan - Raw meal plan from database
 * @returns Transformed meal plan with grouped suggestions
 */
function transformMealPlan(mealPlan: any): MealPlanResponse {
  const groupedSuggestions: GroupedMealSuggestions = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
  };

  mealPlan.suggestions.forEach((suggestion: any) => {
    const mealType = suggestion.type.toLowerCase() as keyof GroupedMealSuggestions;
    const parsedContent = JSON.parse(suggestion.content);

    groupedSuggestions[mealType].push({
      id: suggestion.id,
      type: suggestion.type,
      content: parsedContent,
      orderIndex: suggestion.orderIndex,
      isSelected: suggestion.isSelected,
      createdAt: suggestion.createdAt.toISOString(),
    });
  });

  return {
    id: mealPlan.id,
    userId: mealPlan.userId,
    title: mealPlan.title,
    date: mealPlan.date.toISOString(),
    createdAt: mealPlan.createdAt.toISOString(),
    suggestions: groupedSuggestions,
  };
}
