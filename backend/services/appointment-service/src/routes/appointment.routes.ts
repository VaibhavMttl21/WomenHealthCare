import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import * as appointmentController from '../controllers/appointment.controller';

const router = Router();

// Public routes (require authentication but no role restriction)
router.get('/doctors', authenticateToken, appointmentController.getAvailableDoctors);
router.get('/availability', authenticateToken, appointmentController.getDoctorAvailability);

// Patient routes
router.post(
  '/',
  authenticateToken,
  authorizeRoles('PATIENT', 'ADMIN'),
  appointmentController.createAppointment
);

// Shared routes (both patient and doctor)
router.get('/', authenticateToken, appointmentController.getAppointments);
router.get('/:id', authenticateToken, appointmentController.getAppointmentById);
router.put('/:id', authenticateToken, appointmentController.updateAppointment);
router.delete('/:id', authenticateToken, appointmentController.cancelAppointment);

// Doctor-only routes
router.put(
  '/doctor/availability',
  authenticateToken,
  authorizeRoles('DOCTOR'),
  appointmentController.updateDoctorAvailability
);

router.get(
  '/doctor/statistics',
  authenticateToken,
  authorizeRoles('DOCTOR'),
  appointmentController.getDoctorStatistics
);

router.get(
  '/patient/:patientId',
  authenticateToken,
  authorizeRoles('DOCTOR', 'ADMIN'),
  appointmentController.getPatientDetails
);

export default router;
