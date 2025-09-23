import { Router } from 'express';
import axios from 'axios';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

const PROFILE_SERVICE_URL = process.env.PROFILE_SERVICE_URL || 'http://localhost:3002';

// All profile routes require authentication
router.use(authenticateToken);

router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const response = await axios.get(`${PROFILE_SERVICE_URL}/profile`, {
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

router.put('/', async (req: AuthRequest, res, next) => {
  try {
    const response = await axios.put(`${PROFILE_SERVICE_URL}/profile`, req.body, {
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

router.get('/doctors', async (req: AuthRequest, res, next) => {
  try {
    const response = await axios.get(`${PROFILE_SERVICE_URL}/doctors`, {
      headers: {
        Authorization: req.headers.authorization,
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
