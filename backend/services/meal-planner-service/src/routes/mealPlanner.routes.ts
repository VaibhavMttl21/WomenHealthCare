import express from 'express';
import * as mealPlannerController from '../controllers/mealPlanner.controller';

const router = express.Router();

/**
 * @route   POST /generate
 * @desc    Generate a new daily meal plan
 * @access  Private (via API Gateway)
 * @body    { userId: string, userProfile?: string, title?: string }
 */
router.post('/generate', mealPlannerController.generateMealPlan);

/**
 * @route   POST /auto-generate
 * @desc    Auto-generate today's meal plan (checks if exists first)
 * @access  Private (via API Gateway)
 * @body    { userId: string, userProfile?: string }
 */
router.post('/auto-generate', mealPlannerController.autoGenerateTodayPlan);

/**
 * @route   GET /:id
 * @desc    Get a specific meal plan by ID
 * @access  Private (via API Gateway)
 * @params  id - Meal plan ID
 */
router.get('/:id', mealPlannerController.getMealPlan);

/**
 * @route   GET /user/:userId
 * @desc    Get all meal plans for a user
 * @access  Private (via API Gateway)
 * @params  userId - User ID
 * @query   limit - Maximum number of plans to return (default: 10)
 */
router.get('/user/:userId', mealPlannerController.getUserMealPlans);

/**
 * @route   PUT /suggestion/:suggestionId
 * @desc    Update a meal suggestion's selected status
 * @access  Private (via API Gateway)
 * @params  suggestionId - Suggestion ID
 * @body    { isSelected: boolean }
 */
router.put('/suggestion/:suggestionId', mealPlannerController.updateSuggestionSelection);

/**
 * @route   DELETE /:id
 * @desc    Delete a meal plan (soft delete)
 * @access  Private (via API Gateway)
 * @params  id - Meal plan ID
 */
router.delete('/:id', mealPlannerController.deleteMealPlan);

export default router;
