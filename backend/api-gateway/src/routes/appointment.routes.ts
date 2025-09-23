import { Router } from 'express';
import axios from 'axios';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

const APPOINTMENT_SERVICE_URL = process.env.APPOINTMENT_SERVICE_URL || 'http://localhost:3004';

// All appointment routes require authentication
router.use(authenticateToken);

router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const response = await axios.post(`${APPOINTMENT_SERVICE_URL}/appointments`, req.body, {
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

router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const response = await axios.get(`${APPOINTMENT_SERVICE_URL}/appointments`, {
      headers: {
        Authorization: req.headers.authorization,
        'User-ID': req.user?.id,
      },
      params: req.query,
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

router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const response = await axios.get(`${APPOINTMENT_SERVICE_URL}/appointments/${req.params.id}`, {
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

router.put('/:id', async (req: AuthRequest, res, next) => {
  try {
    const response = await axios.put(`${APPOINTMENT_SERVICE_URL}/appointments/${req.params.id}`, req.body, {
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

router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const response = await axios.delete(`${APPOINTMENT_SERVICE_URL}/appointments/${req.params.id}`, {
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
