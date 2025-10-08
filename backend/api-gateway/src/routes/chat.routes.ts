import { Router } from 'express';
import axios from 'axios';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

const CHATBOT_SERVICE_URL = process.env.CHATBOT_SERVICE_URL || 'http://localhost:3003';

// All chat routes require authentication
router.use(authenticateToken);

// Send message to chatbot
router.post('/message', async (req: AuthRequest, res, next) => {
  try {
    const response = await axios.post(`${CHATBOT_SERVICE_URL}/message`, {
      ...req.body,
      userId: req.user?.id,
    }, {
      headers: {
        Authorization: req.headers.authorization,
        'User-ID': req.user?.id,
      },
    });
    res.status(response.status).json(response.data);
  } catch (error: any) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      next(error);
    }
  }
});

// Get chat history for a session
router.get('/history/:sessionId', async (req: AuthRequest, res, next) => {
  try {
    const { sessionId } = req.params;
    const response = await axios.get(`${CHATBOT_SERVICE_URL}/history/${sessionId}`, {
      headers: {
        Authorization: req.headers.authorization,
        'User-ID': req.user?.id,
      },
    });
    res.status(response.status).json(response.data);
  } catch (error: any) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      next(error);
    }
  }
});

// Delete chat history for a session
router.delete('/history/:sessionId', async (req: AuthRequest, res, next) => {
  try {
    const { sessionId } = req.params;
    const response = await axios.delete(`${CHATBOT_SERVICE_URL}/history/${sessionId}`, {
      headers: {
        Authorization: req.headers.authorization,
        'User-ID': req.user?.id,
      },
    });
    res.status(response.status).json(response.data);
  } catch (error: any) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      next(error);
    }
  }
});

// Get all chat sessions for user
router.get('/sessions', async (req: AuthRequest, res, next) => {
  try {
    const response = await axios.get(`${CHATBOT_SERVICE_URL}/sessions`, {
      headers: {
        Authorization: req.headers.authorization,
        'User-ID': req.user?.id,
      },
    });
    res.status(response.status).json(response.data);
  } catch (error: any) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      next(error);
    }
  }
});

export default router;
