import { Router } from 'express';
import axios from 'axios';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

const CHAT_SERVICE_URL = process.env.CHAT_SERVICE_URL || 'http://localhost:3003';

// All chat routes require authentication
router.use(authenticateToken);

router.post('/message', async (req: AuthRequest, res, next) => {
  try {
    const response = await axios.post(`${CHAT_SERVICE_URL}/message`, req.body, {
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

router.get('/history', async (req: AuthRequest, res, next) => {
  try {
    const response = await axios.get(`${CHAT_SERVICE_URL}/history`, {
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

router.delete('/history', async (req: AuthRequest, res, next) => {
  try {
    const response = await axios.delete(`${CHAT_SERVICE_URL}/history`, {
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
