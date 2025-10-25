import api from './authService';
import {
  Doctor,
  DoctorAvailability,
  Appointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  AppointmentFilter,
  DoctorStatistics,
  TimeSlot,
} from '../types/appointment';

const APPOINTMENTS_BASE = '/appointments';

export const appointmentService = {
  // Get available doctors
  async getAvailableDoctors(): Promise<{ success: boolean; data: Doctor[] }> {
    const response = await api.get(`${APPOINTMENTS_BASE}/doctors`);
    return response.data;
  },

  // Get doctor availability for a specific date
  async getDoctorAvailability(
    doctorId: string,
    date: string
  ): Promise<{ success: boolean; data: DoctorAvailability }> {
    const response = await api.get(`${APPOINTMENTS_BASE}/availability`, {
      params: { doctorId, date },
    });
    return response.data;
  },

  // Create a new appointment
  async createAppointment(
    data: CreateAppointmentRequest
  ): Promise<{ success: boolean; message: string; data: Appointment }> {
    const response = await api.post(APPOINTMENTS_BASE, data);
    return response.data;
  },

  // Get appointments with optional filters
  async getAppointments(
    filter?: AppointmentFilter
  ): Promise<{ success: boolean; data: Appointment[] }> {
    const response = await api.get(APPOINTMENTS_BASE, {
      params: filter,
    });
    return response.data;
  },

  // Get a single appointment by ID
  async getAppointmentById(id: string): Promise<{ success: boolean; data: Appointment }> {
    const response = await api.get(`${APPOINTMENTS_BASE}/${id}`);
    return response.data;
  },

  // Update an appointment
  async updateAppointment(
    id: string,
    data: UpdateAppointmentRequest
  ): Promise<{ success: boolean; message: string; data: Appointment }> {
    const response = await api.put(`${APPOINTMENTS_BASE}/${id}`, data);
    return response.data;
  },

  // Cancel an appointment
  async cancelAppointment(
    id: string
  ): Promise<{ success: boolean; message: string; data: Appointment }> {
    const response = await api.delete(`${APPOINTMENTS_BASE}/${id}`);
    return response.data;
  },

  // Update doctor availability (doctor only)
  async updateDoctorAvailability(
    slots: TimeSlot[]
  ): Promise<{ success: boolean; message: string; data: any }> {
    const response = await api.put(`${APPOINTMENTS_BASE}/doctor/availability`, { slots });
    return response.data;
  },

  // Get doctor statistics (doctor only)
  async getDoctorStatistics(): Promise<{ success: boolean; data: DoctorStatistics }> {
    const response = await api.get(`${APPOINTMENTS_BASE}/doctor/statistics`);
    return response.data;
  },

  // Get patient details (doctor only)
  async getPatientDetails(patientId: string): Promise<{ success: boolean; data: any }> {
    const response = await api.get(`${APPOINTMENTS_BASE}/patient/${patientId}`);
    return response.data;
  },
};

export default appointmentService;
