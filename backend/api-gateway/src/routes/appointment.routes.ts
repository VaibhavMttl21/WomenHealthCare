import { Router } from 'express';
import axios from 'axios';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

const APPOINTMENT_SERVICE_URL = process.env.APPOINTMENT_SERVICE_URL || 'http://localhost:3005';

// All appointment routes require authentication
router.use(authenticateToken);

// Get available doctors
router.get('/doctors', async (req: AuthRequest, res, next) => {
  try {
    const response = await axios.get(`${APPOINTMENT_SERVICE_URL}/doctors`, {
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

// Get doctor availability
router.get('/availability', async (req: AuthRequest, res, next) => {
  try {
    const response = await axios.get(`${APPOINTMENT_SERVICE_URL}/availability`, {
      headers: {
        Authorization: req.headers.authorization,
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

// Update doctor availability
router.put('/doctor/availability', async (req: AuthRequest, res, next) => {
  try {
    const response = await axios.put(`${APPOINTMENT_SERVICE_URL}/doctor/availability`, req.body, {
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

// Get doctor statistics
router.get('/doctor/statistics', async (req: AuthRequest, res, next) => {
  try {
    const response = await axios.get(`${APPOINTMENT_SERVICE_URL}/doctor/statistics`, {
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

// Get patient details (doctor only)
router.get('/patient/:patientId', async (req: AuthRequest, res, next) => {
  try {
    const response = await axios.get(`${APPOINTMENT_SERVICE_URL}/patient/${req.params.patientId}`, {
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

// Create appointment
router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const response = await axios.post(`${APPOINTMENT_SERVICE_URL}/`, req.body, {
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

// Get appointments
router.get('/', async (req: AuthRequest, res, next) => {
  console.log("In appointment creation route");
  try {
    const response = await axios.get(`${APPOINTMENT_SERVICE_URL}/`, {
      headers: {
        Authorization: req.headers.authorization,
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

// Get appointment by ID
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const response = await axios.get(`${APPOINTMENT_SERVICE_URL}/${req.params.id}`, {
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

// Update appointment
router.put('/:id', async (req: AuthRequest, res, next) => {
  try {
    const response = await axios.put(`${APPOINTMENT_SERVICE_URL}/${req.params.id}`, req.body, {
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

// Cancel appointment
router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const response = await axios.delete(`${APPOINTMENT_SERVICE_URL}/${req.params.id}`, {
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
