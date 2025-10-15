import axios, { AxiosError } from 'axios';
import { MealPlan } from '../types/meal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const MEAL_API_URL = `${API_BASE_URL}/mealplanner`;

// API Response type
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Helper to get auth token from localStorage
const getAuthToken = (): string | null => {
  try {
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No authentication token found in localStorage');
      return null;
    }
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Helper to get user ID from localStorage
const getUserId = (): string | null => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      return null;
    }
    const user = JSON.parse(userStr);
    return user?.id || null;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
};

// Helper to get authorization headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token found');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

/**
 * Generate a new daily meal plan
 * Note: userId is automatically extracted from JWT token by API Gateway
 */
export const generateMealPlan = async (
  userProfile?: string
): Promise<MealPlan> => {
  try {
    const userId = getUserId();
    if (!userId) {
      throw new Error('User not authenticated. Please login again.');
    }

    const response = await axios.post<ApiResponse<MealPlan>>(
      `${MEAL_API_URL}/generate`,
      { 
        userId, // Still send it for backend validation
        userProfile: userProfile || 'Pregnant woman' 
      },
      { headers: getAuthHeaders() }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to generate meal plan');
    }

    // Backend already returns parsed content in grouped format
    const mealPlan = response.data.data;
    return mealPlan;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to generate meal plan';
      throw new Error(errorMsg);
    }
    throw error;
  }
};

/**
 * Get a specific meal plan by ID
 */
export const getMealPlanById = async (id: string): Promise<MealPlan> => {
  try {
    const response = await axios.get<ApiResponse<MealPlan>>(
      `${MEAL_API_URL}/${id}`,
      { headers: getAuthHeaders() }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch meal plan');
    }

    // Backend already returns parsed content in grouped format
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Failed to fetch meal plan');
    }
    throw error;
  }
};

/**
 * Get all meal plans for the authenticated user
 */
export const getUserMealPlans = async (limit: number = 30): Promise<MealPlan[]> => {
  try {
    const response = await axios.get<ApiResponse<MealPlan[]>>(
      `${MEAL_API_URL}`,
      {
        headers: getAuthHeaders(),
        params: { limit },
      }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch meal plans');
    }

    // Backend already returns parsed content in grouped format
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Failed to fetch meal plans');
    }
    throw error;
  }
};

/**
 * Get today's meal plan for the authenticated user
 */
export const getTodayMealPlan = async (): Promise<MealPlan | null> => {
  try {
    const allPlans = await getUserMealPlans(7); // Get last 7 days
    
    // Find today's plan
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayPlan = allPlans.find((plan) => {
      const planDate = new Date(plan.date);
      planDate.setHours(0, 0, 0, 0);
      return planDate.getTime() === today.getTime();
    });

    return todayPlan || null;
  } catch (error) {
    console.error('Error fetching today\'s meal plan:', error);
    return null;
  }
};

/**
 * Update a meal suggestion's selected status
 */
export const updateSuggestionSelection = async (
  suggestionId: string,
  isSelected: boolean
): Promise<void> => {
  try {
    const response = await axios.put<ApiResponse<null>>(
      `${MEAL_API_URL}/suggestion/${suggestionId}`,
      { isSelected },
      { headers: getAuthHeaders() }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to update suggestion');
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Failed to update suggestion');
    }
    throw error;
  }
};

/**
 * Delete a meal plan (soft delete)
 */
export const deleteMealPlan = async (id: string): Promise<void> => {
  try {
    const response = await axios.delete<ApiResponse<null>>(
      `${MEAL_API_URL}/${id}`,
      { headers: getAuthHeaders() }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete meal plan');
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Failed to delete meal plan');
    }
    throw error;
  }
};

/**
 * Check if user needs a new meal plan for today
 */
export const needsDailyRecommendation = async (): Promise<boolean> => {
  try {
    const todayPlan = await getTodayMealPlan();
    return !todayPlan; // Returns true if no plan exists for today
  } catch (error) {
    console.error('Error checking daily recommendation:', error);
    return true; // Assume needs recommendation on error
  }
};

/**
 * Auto-generate today's meal plan if needed
 */
export const autoGenerateTodayPlan = async (
  userProfile?: string
): Promise<MealPlan | null> => {
  try {
    const userId = getUserId();
    if (!userId) {
      throw new Error('User not authenticated. Please login again.');
    }

    const response = await axios.post<ApiResponse<MealPlan>>(
      `${MEAL_API_URL}/auto-generate`,
      { 
        userId,
        userProfile: userProfile || 'Pregnant woman' 
      },
      { headers: getAuthHeaders() }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to auto-generate meal plan');
    }

    // Backend already returns parsed content in grouped format
    const mealPlan = response.data.data;
    return mealPlan;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to auto-generate meal plan';
      throw new Error(errorMsg);
    }
    throw error;
  }
};

// Export default object
export default {
  generateMealPlan,
  getMealPlanById,
  getUserMealPlans,
  getTodayMealPlan,
  updateSuggestionSelection,
  deleteMealPlan,
  needsDailyRecommendation,
  autoGenerateTodayPlan,
  getUserId, // Export helper for use in components
};
