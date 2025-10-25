import { Router } from 'express';
import axios from 'axios';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3004';

// Token management routes (public - for registration before authentication)
router.post('/tokens/register', async (req, res, next) => {
  try {
    const response = await axios.post(`${NOTIFICATION_SERVICE_URL}/tokens/register`, req.body);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      next(error);
    }
  }
});

router.post('/tokens/unregister', async (req, res, next) => {
  try {
    const response = await axios.post(`${NOTIFICATION_SERVICE_URL}/tokens/unregister`, req.body);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      next(error);
    }
  }
});

router.post('/tokens/unregister-user', async (req, res, next) => {
  try {
    console.log('[API Gateway] Forwarding unregister-user request to notification service:', req.body);
    const response = await axios.post(`${NOTIFICATION_SERVICE_URL}/tokens/unregister-user`, req.body);
    console.log('[API Gateway] Unregister-user response:', response.status);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[API Gateway] Error forwarding unregister-user:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      next(error);
    }
  }
});

// All other notification routes require authentication
router.use(authenticateToken);

// Send notifications
router.post('/send', async (req: AuthRequest, res, next) => {
  try {
    const response = await axios.post(`${NOTIFICATION_SERVICE_URL}/send`, req.body, {
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

router.post('/send/bulk', async (req: AuthRequest, res, next) => {
  try {
    const response = await axios.post(`${NOTIFICATION_SERVICE_URL}/send/bulk`, req.body, {
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

// Specialized notifications
router.post('/send/appointment-reminder', async (req: AuthRequest, res, next) => {
  try {
    const response = await axios.post(`${NOTIFICATION_SERVICE_URL}/send/appointment-reminder`, req.body, {
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

router.post('/send/doctor-message', async (req: AuthRequest, res, next) => {
  try {
    const response = await axios.post(`${NOTIFICATION_SERVICE_URL}/send/doctor-message`, req.body, {
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

// Get notifications
router.get('/user/:userId', async (req: AuthRequest, res, next) => {
  try {
    const { userId } = req.params;
    const response = await axios.get(`${NOTIFICATION_SERVICE_URL}/user/${userId}`, {
      headers: {
        Authorization: req.headers.authorization,
        'User-ID': req.user?.id,
      },
      params: req.query, // Forward query parameters for pagination, filtering, etc.
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

router.get('/user/:userId/unread-count', async (req: AuthRequest, res, next) => {
  try {
    const { userId } = req.params;
    const response = await axios.get(`${NOTIFICATION_SERVICE_URL}/user/${userId}/unread-count`, {
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

// Update notifications
router.patch('/:notificationId/read', async (req: AuthRequest, res, next) => {
  try {
    const { notificationId } = req.params;
    const response = await axios.patch(`${NOTIFICATION_SERVICE_URL}/${notificationId}/read`, req.body, {
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

router.patch('/read-all', async (req: AuthRequest, res, next) => {
  try {
    const response = await axios.patch(`${NOTIFICATION_SERVICE_URL}/read-all`, req.body, {
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

router.delete('/:notificationId', async (req: AuthRequest, res, next) => {
  try {
    const { notificationId } = req.params;
    const response = await axios.delete(`${NOTIFICATION_SERVICE_URL}/${notificationId}`, {
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

// Development test endpoint
if (process.env.NODE_ENV === 'development') {
  router.post('/test', async (req: AuthRequest, res, next) => {
    try {
      const response = await axios.post(`${NOTIFICATION_SERVICE_URL}/test`, req.body, {
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
}

export default router;
