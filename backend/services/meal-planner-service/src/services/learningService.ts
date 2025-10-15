/**
 * Learning Service
 * 
 * Analyzes user behavior and learns preferences from meal selection history.
 * This service implements the intelligent learning system that:
 * - Tracks which meal suggestions users select
 * - Identifies budget preferences (normal vs cost-effective)
 * - Discovers favorite ingredients and meals
 * - Measures engagement with different meal types
 * - Calculates confidence levels for personalization
 */

import { PrismaClient } from '@prisma/client';
import { UserLearningContext } from '../types/mealPlanner.types';

const prisma = new PrismaClient();

/**
 * Analyze user's past selections to learn preferences
 * 
 * This function implements the core learning mechanism:
 * 1. Fetches user's meal plan history (last 30 days)
 * 2. Analyzes which suggestions were marked as selected
 * 3. Calculates budget preference (normal vs cost-effective)
 * 4. Identifies favorite ingredients and meals
 * 5. Measures engagement with different meal types
 * 6. Computes confidence level based on data volume
 * 
 * @param userId - The user whose preferences to analyze
 * @returns UserLearningContext with learned preferences
 */
export async function analyzeUserPreferences(userId: string): Promise<UserLearningContext> {
  try {
    // Fetch user's meal plan history (last 30 days for relevant patterns)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const userMealPlans = await (prisma as any).mealPlan.findMany({
      where: {
        userId,
        isActive: true,
        createdAt: { gte: thirtyDaysAgo },
      },
      include: {
        suggestions: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // If no history, return default neutral context
    if (userMealPlans.length === 0) {
      return {
        budgetPreference: 0.5, // Neutral
        topIngredients: [],
        mealTypeEngagement: { breakfast: 0, lunch: 0, dinner: 0, snack: 0 },
        favoriteMeals: [],
        averageCost: 15, // Default middle-range budget
        totalSelections: 0,
        learningConfidence: 0, // No confidence without data
      };
    }

    // Extract all suggestions
    const allSuggestions = userMealPlans.flatMap((plan: any) => plan.suggestions);
    const selectedSuggestions = allSuggestions.filter((sugg: any) => sugg.isSelected);

    // 1. LEARN BUDGET PREFERENCE
    // orderIndex: 0 = Normal option, 1 = Budget option
    const budgetSelections = selectedSuggestions.filter((s: any) => s.orderIndex === 1);
    const normalSelections = selectedSuggestions.filter((s: any) => s.orderIndex === 0);
    const totalSelections = selectedSuggestions.length;
    
    let budgetPreference = 0.5; // Default neutral
    if (totalSelections > 0) {
      budgetPreference = budgetSelections.length / totalSelections;
      
      console.log(`Learning: User selected ${budgetSelections.length} budget options vs ${normalSelections.length} normal options`);
    }

    // 2. LEARN FAVORITE INGREDIENTS
    const ingredientFrequency: { [key: string]: number } = {};
    const mealFrequency: { [key: string]: number } = {};
    let totalCost = 0;
    let costCount = 0;

    selectedSuggestions.forEach((sugg: any) => {
      try {
        const content = JSON.parse(sugg.content);
        const mealName = content.name || '';
        
        // Track meal frequency
        mealFrequency[mealName] = (mealFrequency[mealName] || 0) + 1;
        
        // Extract ingredients (words in brackets - Hinglish names)
        const ingredientMatches = mealName.match(/\(([^)]+)\)/g);
        if (ingredientMatches) {
          ingredientMatches.forEach((match: string) => {
            const ingredient = match.replace(/[()]/g, '');
            ingredientFrequency[ingredient] = (ingredientFrequency[ingredient] || 0) + 1;
          });
        }
        
        // Extract cost if mentioned in benefits or facts
        const costMatch = (content.benefits + ' ' + content.facts).match(/₹(\d+)/);
        if (costMatch) {
          totalCost += parseInt(costMatch[1]);
          costCount++;
        }
      } catch (e) {
        // Skip malformed content
      }
    });

    // Get top 10 ingredients
    const topIngredients = Object.entries(ingredientFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([ingredient]) => ingredient);

    // Get top 5 favorite meals
    const favoriteMeals = Object.entries(mealFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([meal]) => meal);

    // 3. LEARN MEAL TYPE ENGAGEMENT
    const mealTypeStats = {
      breakfast: { selected: 0, total: 0 },
      lunch: { selected: 0, total: 0 },
      dinner: { selected: 0, total: 0 },
      snack: { selected: 0, total: 0 },
    };

    allSuggestions.forEach((sugg: any) => {
      const type = sugg.type.toLowerCase() as keyof typeof mealTypeStats;
      if (mealTypeStats[type]) {
        mealTypeStats[type].total++;
        if (sugg.isSelected) {
          mealTypeStats[type].selected++;
        }
      }
    });

    const mealTypeEngagement = {
      breakfast: mealTypeStats.breakfast.total > 0 ? mealTypeStats.breakfast.selected / mealTypeStats.breakfast.total : 0,
      lunch: mealTypeStats.lunch.total > 0 ? mealTypeStats.lunch.selected / mealTypeStats.lunch.total : 0,
      dinner: mealTypeStats.dinner.total > 0 ? mealTypeStats.dinner.selected / mealTypeStats.dinner.total : 0,
      snack: mealTypeStats.snack.total > 0 ? mealTypeStats.snack.selected / mealTypeStats.snack.total : 0,
    };

    // 4. CALCULATE CONFIDENCE
    // More selections = higher confidence (max out at 20 selections = 100% confidence)
    const learningConfidence = Math.min(totalSelections / 20, 1);

    const averageCost = costCount > 0 ? totalCost / costCount : 15;

    return {
      budgetPreference,
      topIngredients,
      mealTypeEngagement,
      favoriteMeals,
      averageCost,
      totalSelections,
      learningConfidence,
    };
  } catch (error: any) {
    console.error('Error analyzing user preferences:', error);
    // Return default context on error
    return {
      budgetPreference: 0.5,
      topIngredients: [],
      mealTypeEngagement: { breakfast: 0, lunch: 0, dinner: 0, snack: 0 },
      favoriteMeals: [],
      averageCost: 15,
      totalSelections: 0,
      learningConfidence: 0,
    };
  }
}
