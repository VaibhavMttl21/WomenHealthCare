import { Request, Response, NextFunction } from 'express';
import * as mealPlannerService from '../services/mealPlannerService';
import { ApiResponse } from '../types/mealPlanner.types';

/**
 * Generate a new daily meal plan for the user
 */
export async function generateMealPlan(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { userId, userProfile, title } = req.body;

    // Validate required fields
    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'User ID is required',
      } as ApiResponse<null>);
      return;
    }

    console.log(`Generating meal plan for user: ${userId}`);

    // Generate the meal plan
    const mealPlan = await mealPlannerService.generateDailyMealPlan(
      userId,
      userProfile || ''
    );

    console.log(`Meal plan generated successfully: ${mealPlan.id}`);

    res.status(201).json({
      success: true,
      data: mealPlan,
      message: 'Meal plan generated successfully',
    } as ApiResponse<typeof mealPlan>);
  } catch (error: any) {
    console.error('Error in generateMealPlan controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate meal plan',
      error: error.message,
    } as ApiResponse<null>);
  }
}

/**
 * Get a specific meal plan by ID
 */
export async function getMealPlan(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Meal plan ID is required',
      } as ApiResponse<null>);
      return;
    }

    console.log(`Fetching meal plan: ${id}`);

    const mealPlan = await mealPlannerService.getMealPlanById(id);

    res.status(200).json({
      success: true,
      data: mealPlan,
    } as ApiResponse<typeof mealPlan>);
  } catch (error: any) {
    console.error('Error in getMealPlan controller:', error);

    if (error.message.includes('not found')) {
      res.status(404).json({
        success: false,
        message: 'Meal plan not found',
        error: error.message,
      } as ApiResponse<null>);
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch meal plan',
      error: error.message,
    } as ApiResponse<null>);
  }
}

/**
 * Get all meal plans for a user
 */
export async function getUserMealPlans(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Get userId from params (matches route pattern)
    const { userId } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'User ID is required',
      } as ApiResponse<null>);
      return;
    }

    console.log(`Fetching meal plans for user: ${userId}`);

    const mealPlans = await mealPlannerService.getUserMealPlans(userId, limit);

    res.status(200).json({
      success: true,
      data: mealPlans,
    } as ApiResponse<typeof mealPlans>);
  } catch (error: any) {
    console.error('Error in getUserMealPlans controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch meal plans',
      error: error.message,
    } as ApiResponse<null>);
  }
}

/**
 * Update a meal suggestion's selected status
 */
export async function updateSuggestionSelection(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { suggestionId } = req.params;
    const { isSelected } = req.body;

    if (!suggestionId) {
      res.status(400).json({
        success: false,
        message: 'Suggestion ID is required',
      } as ApiResponse<null>);
      return;
    }

    if (typeof isSelected !== 'boolean') {
      res.status(400).json({
        success: false,
        message: 'isSelected must be a boolean value',
      } as ApiResponse<null>);
      return;
    }

    console.log(`Updating suggestion ${suggestionId} selection to: ${isSelected}`);

    await mealPlannerService.updateSuggestionSelection(suggestionId, isSelected);

    res.status(200).json({
      success: true,
      message: 'Suggestion updated successfully',
    } as ApiResponse<null>);
  } catch (error: any) {
    console.error('Error in updateSuggestionSelection controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update suggestion',
      error: error.message,
    } as ApiResponse<null>);
  }
}

/**
 * Delete a meal plan
 */
export async function deleteMealPlan(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Meal plan ID is required',
      } as ApiResponse<null>);
      return;
    }

    console.log(`Deleting meal plan: ${id}`);

    await mealPlannerService.deleteMealPlan(id);

    res.status(200).json({
      success: true,
      message: 'Meal plan deleted successfully',
    } as ApiResponse<null>);
  } catch (error: any) {
    console.error('Error in deleteMealPlan controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete meal plan',
      error: error.message,
    } as ApiResponse<null>);
  }
}

/**
 * Auto-generate today's meal plan
 * Checks if a plan exists for today, if not generates one automatically
 */
export async function autoGenerateTodayPlan(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { userId, userProfile } = req.body;

    // Validate required fields
    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'User ID is required',
      } as ApiResponse<null>);
      return;
    }

    console.log(`Auto-generating meal plan for user: ${userId}`);

    // Check if today's plan already exists
    const existingPlan = await mealPlannerService.getTodayMealPlan(userId);

    if (existingPlan) {
      console.log(`Today's meal plan already exists: ${existingPlan.id}`);
      res.status(200).json({
        success: true,
        data: existingPlan,
        message: 'Today\'s meal plan loaded',
      } as ApiResponse<typeof existingPlan>);
      return;
    }

    // No plan exists, generate a new one
    console.log('No plan exists for today, generating new one...');
    const newPlan = await mealPlannerService.generateDailyMealPlan(
      userId,
      userProfile || ''
    );

    console.log(`New meal plan generated successfully: ${newPlan.id}`);

    res.status(201).json({
      success: true,
      data: newPlan,
      message: 'Daily meal plan generated automatically',
    } as ApiResponse<typeof newPlan>);
  } catch (error: any) {
    console.error('Error in autoGenerateTodayPlan controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to auto-generate meal plan',
      error: error.message,
    } as ApiResponse<null>);
  }
}
