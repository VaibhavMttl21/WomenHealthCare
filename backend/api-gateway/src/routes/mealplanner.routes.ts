import { Router } from 'express';
import axios from 'axios';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Function to get the service URL dynamically (to ensure .env is loaded)
const getMealPlannerServiceUrl = () => {
  return process.env.MEAL_PLANNER_SERVICE_URL || 'http://localhost:3007';
};

// All meal planner routes require authentication
router.use(authenticateToken);

// Generate new meal plan
router.post('/generate', async (req: AuthRequest, res, next) => {
  try {
    const serviceUrl = getMealPlannerServiceUrl();
    console.log('🔍 API Gateway - Meal Planner Service URL:', serviceUrl);
    console.log('🔍 API Gateway - Forwarding to:', `${serviceUrl}/generate`);
    console.log('🔍 API Gateway - Request body:', JSON.stringify(req.body));
    console.log('🔍 API Gateway - User ID:', req.user?.id);
    
    const response = await axios.post(`${serviceUrl}/generate`, {
      ...req.body,
      userId: req.user?.id, // Use authenticated user ID
    }, {
      headers: {
        Authorization: req.headers.authorization,
        'User-ID': req.user?.id,
        'Content-Type': 'application/json',
      },
      timeout: 60000, // 60 second timeout
    });
    
    console.log('✅ API Gateway - Response received:', response.status);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('❌ API Gateway - Error forwarding request:', error.message);
    if (error.code) {
      console.error('❌ API Gateway - Error code:', error.code);
    }
    if (error.response) {
      console.error('❌ API Gateway - Error response:', error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error('❌ API Gateway - No response from service');
      res.status(503).json({
        success: false,
        message: 'Meal planner service unavailable',
        error: error.message,
      });
    }
  }
});

// Auto-generate today's meal plan (checks if exists first)
router.post('/auto-generate', async (req: AuthRequest, res, next) => {
  try {
    const serviceUrl = getMealPlannerServiceUrl();
    console.log('🔍 API Gateway - Auto-generating meal plan for user:', req.user?.id);
    console.log('🔍 API Gateway - Forwarding to:', `${serviceUrl}/auto-generate`);
    
    const response = await axios.post(`${serviceUrl}/auto-generate`, {
      ...req.body,
      userId: req.user?.id, // Use authenticated user ID
    }, {
      headers: {
        Authorization: req.headers.authorization,
        'User-ID': req.user?.id,
        'Content-Type': 'application/json',
      },
      timeout: 60000, // 60 second timeout
    });
    
    console.log('✅ API Gateway - Auto-generate response received:', response.status);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('❌ API Gateway - Error auto-generating:', error.message);
    if (error.code) {
      console.error('❌ API Gateway - Error code:', error.code);
    }
    if (error.response) {
      console.error('❌ API Gateway - Error response:', error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error('❌ API Gateway - No response from service');
      res.status(503).json({
        success: false,
        message: 'Meal planner service unavailable',
        error: error.message,
      });
    }
  }
});

// Get specific meal plan by ID
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const serviceUrl = getMealPlannerServiceUrl();
    console.log('🔍 API Gateway - Fetching meal plan:', id);
    console.log('🔍 API Gateway - Forwarding to:', `${serviceUrl}/${id}`);
    
    const response = await axios.get(`${serviceUrl}/${id}`, {
      headers: {
        Authorization: req.headers.authorization,
        'User-ID': req.user?.id,
      },
      timeout: 30000,
    });
    
    console.log('✅ API Gateway - Response received:', response.status);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('❌ API Gateway - Error fetching meal plan:', error.message);
    if (error.code) {
      console.error('❌ API Gateway - Error code:', error.code);
    }
    if (error.response) {
      console.error('❌ API Gateway - Error response:', error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error('❌ API Gateway - No response from service');
      res.status(503).json({
        success: false,
        message: 'Meal planner service unavailable',
        error: error.message,
      });
    }
  }
});

// Get all meal plans for user
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const serviceUrl = getMealPlannerServiceUrl();
    console.log('🔍 API Gateway - Fetching user meal plans for:', req.user?.id);
    console.log('🔍 API Gateway - Forwarding to:', `${serviceUrl}/user/${req.user?.id}`);
    
    const response = await axios.get(`${serviceUrl}/user/${req.user?.id}`, {
      headers: {
        Authorization: req.headers.authorization,
        'User-ID': req.user?.id,
      },
      params: req.query, // Forward query parameters (e.g., limit)
      timeout: 30000, // 30 second timeout
    });
    
    console.log('✅ API Gateway - Response received:', response.status);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('❌ API Gateway - Error fetching user meals:', error.message);
    if (error.code) {
      console.error('❌ API Gateway - Error code:', error.code);
    }
    if (error.response) {
      console.error('❌ API Gateway - Error response:', error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error('❌ API Gateway - No response from service');
      res.status(503).json({
        success: false,
        message: 'Meal planner service unavailable',
        error: error.message,
      });
    }
  }
});

// Update meal suggestion selection
router.put('/suggestion/:suggestionId', async (req: AuthRequest, res, next) => {
  try {
    const { suggestionId } = req.params;
    const serviceUrl = getMealPlannerServiceUrl();
    console.log('🔍 API Gateway - Updating suggestion:', suggestionId);
    
    const response = await axios.put(`${serviceUrl}/suggestion/${suggestionId}`, req.body, {
      headers: {
        Authorization: req.headers.authorization,
        'User-ID': req.user?.id,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
    
    console.log('✅ API Gateway - Response received:', response.status);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('❌ API Gateway - Error updating suggestion:', error.message);
    if (error.response) {
      console.error('❌ API Gateway - Error response:', error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error('❌ API Gateway - No response from service');
      res.status(503).json({
        success: false,
        message: 'Meal planner service unavailable',
        error: error.message,
      });
    }
  }
});

// Delete meal plan
router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const serviceUrl = getMealPlannerServiceUrl();
    console.log('🔍 API Gateway - Deleting meal plan:', id);
    
    const response = await axios.delete(`${serviceUrl}/${id}`, {
      headers: {
        Authorization: req.headers.authorization,
        'User-ID': req.user?.id,
      },
      timeout: 30000,
    });
    
    console.log('✅ API Gateway - Response received:', response.status);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('❌ API Gateway - Error deleting meal plan:', error.message);
    if (error.response) {
      console.error('❌ API Gateway - Error response:', error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error('❌ API Gateway - No response from service');
      res.status(503).json({
        success: false,
        message: 'Meal planner service unavailable',
        error: error.message,
      });
    }
  }
});

export default router;
