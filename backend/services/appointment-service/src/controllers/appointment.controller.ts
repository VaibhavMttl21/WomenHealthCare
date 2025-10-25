import { Request, Response } from 'express';
import appointmentService from '../services/appointment.service';
import { AuthRequest } from '../middleware/auth';
import {
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  AppointmentFilter,
} from '../types/appointment.types';

/**
 * Get available doctors
 */
export const getAvailableDoctors = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctors = await appointmentService.getAvailableDoctors();
    res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (error: any) {
    console.error('Error fetching available doctors:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch available doctors',
    });
  }
};

/**
 * Get doctor availability for a specific date
 */
export const getDoctorAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      res.status(400).json({
        success: false,
        message: 'Doctor ID and date are required',
      });
      return;
    }

    const availability = await appointmentService.getDoctorAvailability(
      doctorId as string,
      date as string
    );

    res.status(200).json({
      success: true,
      data: availability,
    });
  } catch (error: any) {
    console.error('Error fetching doctor availability:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch doctor availability',
    });
  }
};

/**
 * Create a new appointment (patient booking)
 */
export const createAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log("Creating appointment with body:", req.body);
    const data: CreateAppointmentRequest = req.body;

    // Ensure patient can only book for themselves
    if (req.user?.role === 'PATIENT' && data.patientId !== req.user.id) {
      res.status(403).json({
        success: false,
        message: 'You can only book appointments for yourself',
      });
      return;
    }

    const appointment = await appointmentService.createAppointment(data);

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: appointment,
    });
  } catch (error: any) {
    console.error('Error creating appointment:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create appointment',
    });
  }
};

/**
 * Get appointments (filtered by user role)
 */
export const getAppointments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter: AppointmentFilter = {
      status: req.query.status as any,
      type: req.query.type as any,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      isOnline: req.query.isOnline === 'true' ? true : req.query.isOnline === 'false' ? false : undefined,
    };

    // Filter by user role
    if (req.user?.role === 'PATIENT') {
      filter.patientId = req.user.id;
    } else if (req.user?.role === 'DOCTOR') {
      filter.doctorId = req.user.id;
    }

    const appointments = await appointmentService.getAppointments(filter);

    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error: any) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch appointments',
    });
  }
};

/**
 * Get a single appointment by ID
 */
export const getAppointmentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    console.log("Fetching appointment with ID:", id,req.user);
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const appointment = await appointmentService.getAppointmentById(
      id,
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error: any) {
    console.error('Error fetching appointment:', error);
    const statusCode = error.message.includes('Unauthorized') ? 403 : 
                       error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to fetch appointment',
    });
  }
};

/**
 * Update an appointment
 */
export const updateAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data: UpdateAppointmentRequest = req.body;

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const appointment = await appointmentService.updateAppointment(
      id,
      data,
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment,
    });
  } catch (error: any) {
    console.error('Error updating appointment:', error);
    const statusCode = error.message.includes('Unauthorized') ? 403 : 
                       error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to update appointment',
    });
  }
};

/**
 * Cancel an appointment
 */
export const cancelAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const appointment = await appointmentService.cancelAppointment(
      id,
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment,
    });
  } catch (error: any) {
    console.error('Error cancelling appointment:', error);
    const statusCode = error.message.includes('Unauthorized') ? 403 : 
                       error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to cancel appointment',
    });
  }
};

/**
 * Update doctor availability (doctor only)
 */
export const updateDoctorAvailability = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'DOCTOR') {
      res.status(403).json({
        success: false,
        message: 'Only doctors can update availability',
      });
      return;
    }

    const { slots } = req.body;

    if (!slots || !Array.isArray(slots)) {
      res.status(400).json({
        success: false,
        message: 'Invalid slots format',
      });
      return;
    }

    const updatedProfile = await appointmentService.updateDoctorAvailability(
      req.user.id,
      slots
    );

    res.status(200).json({
      success: true,
      message: 'Availability updated successfully',
      data: updatedProfile,
    });
  } catch (error: any) {
    console.error('Error updating doctor availability:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update availability',
    });
  }
};

/**
 * Get patient details (doctor only)
 */
export const getPatientDetails = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'DOCTOR') {
      res.status(403).json({
        success: false,
        message: 'Only doctors can view patient details',
      });
      return;
    }

    const { patientId } = req.params;

    const patient = await appointmentService.getPatientDetails(patientId);

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error: any) {
    console.error('Error fetching patient details:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch patient details',
    });
  }
};

/**
 * Get doctor statistics (doctor only)
 */
export const getDoctorStatistics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'DOCTOR') {
      res.status(403).json({
        success: false,
        message: 'Only doctors can view statistics',
      });
      return;
    }

    const statistics = await appointmentService.getDoctorStatistics(req.user.id);

    res.status(200).json({
      success: true,
      data: statistics,
    });
  } catch (error: any) {
    console.error('Error fetching doctor statistics:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch statistics',
    });
  }
};
