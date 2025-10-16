import { Router } from 'express';
import axios from 'axios';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Function to get the service URL dynamically (to ensure .env is loaded)
const getChatbotServiceUrl = () => {
  return process.env.CHATBOT_SERVICE_URL || 'http://localhost:3003';
};

// All chatbot routes require authentication
router.use(authenticateToken);

// Send message to chatbot
router.post('/message', async (req: AuthRequest, res, next) => {
  try {
    const serviceUrl = getChatbotServiceUrl();
    console.log('🔍 API Gateway - Chatbot Service URL:', serviceUrl);
    console.log('🔍 API Gateway - Forwarding to:', `${serviceUrl}/message`);
    console.log('🔍 API Gateway - Request body:', JSON.stringify(req.body));
    console.log('🔍 API Gateway - User ID:', req.user?.id);
    
    const response = await axios.post(`${serviceUrl}/message`, {
      ...req.body,
      userId: req.user?.id, // Use authenticated user ID
    }, {
      headers: {
        Authorization: req.headers.authorization,
        'User-ID': req.user?.id,
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 second timeout
    });
    
    console.log('✅ API Gateway - Response received:', response.status);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('❌ API Gateway - Error forwarding chatbot message:', error.message);
    if (error.code) {
      console.error('❌ API Gateway - Error code:', error.code);
    }
    if (error.response) {
      console.error('❌ API Gateway - Error response:', error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error('❌ API Gateway - No response from chatbot service');
      res.status(503).json({
        success: false,
        message: 'Chatbot service unavailable',
        error: error.message,
      });
    }
  }
});

// Get chat history for a session
router.get('/history/:sessionId', async (req: AuthRequest, res, next) => {
  try {
    const { sessionId } = req.params;
    const serviceUrl = getChatbotServiceUrl();
    console.log('🔍 API Gateway - Fetching chatbot history for session:', sessionId);
    console.log('🔍 API Gateway - Forwarding to:', `${serviceUrl}/history/${sessionId}`);
    
    const response = await axios.get(`${serviceUrl}/history/${sessionId}`, {
      headers: {
        Authorization: req.headers.authorization,
        'User-ID': req.user?.id,
      },
      timeout: 30000,
    });
    
    console.log('✅ API Gateway - Response received:', response.status);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('❌ API Gateway - Error fetching chatbot history:', error.message);
    if (error.code) {
      console.error('❌ API Gateway - Error code:', error.code);
    }
    if (error.response) {
      console.error('❌ API Gateway - Error response:', error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error('❌ API Gateway - No response from chatbot service');
      res.status(503).json({
        success: false,
        message: 'Chatbot service unavailable',
        error: error.message,
      });
    }
  }
});

// Delete chat history for a session
router.delete('/history/:sessionId', async (req: AuthRequest, res, next) => {
  try {
    const { sessionId } = req.params;
    const serviceUrl = getChatbotServiceUrl();
    console.log('🔍 API Gateway - Deleting chatbot history for session:', sessionId);
    console.log('🔍 API Gateway - Forwarding to:', `${serviceUrl}/history/${sessionId}`);
    
    const response = await axios.delete(`${serviceUrl}/history/${sessionId}`, {
      headers: {
        Authorization: req.headers.authorization,
        'User-ID': req.user?.id,
      },
      timeout: 30000,
    });
    
    console.log('✅ API Gateway - Response received:', response.status);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('❌ API Gateway - Error deleting chatbot history:', error.message);
    if (error.code) {
      console.error('❌ API Gateway - Error code:', error.code);
    }
    if (error.response) {
      console.error('❌ API Gateway - Error response:', error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error('❌ API Gateway - No response from chatbot service');
      res.status(503).json({
        success: false,
        message: 'Chatbot service unavailable',
        error: error.message,
      });
    }
  }
});

// Get all chat sessions for user
router.get('/sessions', async (req: AuthRequest, res, next) => {
  try {
    const serviceUrl = getChatbotServiceUrl();
    console.log('🔍 API Gateway - Fetching chatbot sessions for user:', req.user?.id);
    console.log('🔍 API Gateway - Forwarding to:', `${serviceUrl}/sessions`);
    
    const response = await axios.get(`${serviceUrl}/sessions`, {
      headers: {
        Authorization: req.headers.authorization,
        'User-ID': req.user?.id,
      },
      timeout: 30000,
    });
    
    console.log('✅ API Gateway - Response received:', response.status);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('❌ API Gateway - Error fetching chatbot sessions:', error.message);
    if (error.code) {
      console.error('❌ API Gateway - Error code:', error.code);
    }
    if (error.response) {
      console.error('❌ API Gateway - Error response:', error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error('❌ API Gateway - No response from chatbot service');
      res.status(503).json({
        success: false,
        message: 'Chatbot service unavailable',
        error: error.message,
      });
    }
  }
});

export default router;
