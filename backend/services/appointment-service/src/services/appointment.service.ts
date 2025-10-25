import { prisma } from '../config/database.config';
import axios from 'axios';
import {
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  AppointmentFilter,
  AppointmentStatus,
  DoctorAvailability,
  TimeSlot,
  NotificationPayload,
} from '../types/appointment.types';

const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3004';

class AppointmentService {
  /**
   * Get available doctors with their profiles
   */
  async getAvailableDoctors() {
    try {
      const doctors = await prisma.user.findMany({
        where: {
          role: 'DOCTOR',
          isActive: true,
          isVerified: true,
        },
        include: {
          doctorProfile: true,
        },
      });

      return doctors.map((doctor) => ({
        id: doctor.id,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
        phoneNumber: doctor.phoneNumber,
        profile: doctor.doctorProfile,
      }));
    } catch (error) {
      console.error('Error fetching available doctors:', error);
      throw error;
    }
  }

  /**
   * Get doctor availability for a specific date
   */
  async getDoctorAvailability(doctorId: string, date: string): Promise<DoctorAvailability> {
    try {
      // Get doctor profile to fetch available slots
      const doctorProfile = await prisma.doctorProfile.findUnique({
        where: { userId: doctorId },
      });

      if (!doctorProfile) {
        throw new Error('Doctor profile not found');
      }

      // Parse available slots from doctor profile
      const availableSlots = doctorProfile.availableSlots
        ? JSON.parse(doctorProfile.availableSlots)
        : this.getDefaultSlots();

      // Get existing appointments for the date
      const existingAppointments = await prisma.appointment.findMany({
        where: {
          doctorId: doctorProfile.id,
          appointmentDate: new Date(date),
          status: {
            in: ['SCHEDULED', 'RESCHEDULED'],
          },
        },
      });

      // Mark slots as unavailable if booked
      const bookedTimes = existingAppointments.map((apt) => apt.appointmentTime);
      const slots: TimeSlot[] = availableSlots.map((slot: any) => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
        duration: slot.duration || 30,
        isAvailable: !bookedTimes.includes(slot.startTime),
      }));

      return {
        doctorId,
        date,
        slots,
      };
    } catch (error) {
      console.error('Error fetching doctor availability:', error);
      throw error;
    }
  }

  /**
   * Get default time slots (9 AM - 5 PM, 30-min intervals)
   */
  private getDefaultSlots(): any[] {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const endMinute = minute + 30;
        const endHour = endMinute >= 60 ? hour + 1 : hour;
        const endTime = `${endHour.toString().padStart(2, '0')}:${(endMinute % 60).toString().padStart(2, '0')}`;
        slots.push({ startTime, endTime, duration: 30 });
      }
    }
    return slots;
  }

  /**
   * Create a new appointment (patient booking)
   */
  async createAppointment(data: CreateAppointmentRequest) {
    try {
      // Validate patient exists
      const patient = await prisma.user.findUnique({
        where: { id: data.patientId },
      });

      if (!patient) {
        throw new Error('Patient not found');
      }

      // Get doctor profile
      const doctorProfile = await prisma.doctorProfile.findUnique({
        where: { userId: data.doctorId },
        include: { user: true },
      });

      if (!doctorProfile) {
        throw new Error('Doctor not found');
      }

      // Check if slot is available
      const existingAppointment = await prisma.appointment.findFirst({
        where: {
          doctorId: doctorProfile.id,
          appointmentDate: new Date(data.appointmentDate),
          appointmentTime: data.appointmentTime,
          status: {
            in: ['SCHEDULED', 'RESCHEDULED'],
          },
        },
      });

      if (existingAppointment) {
        throw new Error('This time slot is already booked');
      }

      // Create appointment
      const appointment = await prisma.appointment.create({
        data: {
          patientId: data.patientId,
          doctorId: doctorProfile.id,
          appointmentDate: new Date(data.appointmentDate),
          appointmentTime: data.appointmentTime,
          duration: data.duration || 30,
          type: data.type,
          reason: data.reason,
          symptoms: data.symptoms ? JSON.stringify(data.symptoms) : null,
          isOnline: data.isOnline !== undefined ? data.isOnline : true,
          status: 'SCHEDULED',
        },
        include: {
          patient: true,
          doctor: {
            include: {
              user: true,
            },
          },
        },
      });

      // Send notification to doctor
      await this.sendNotification({
        userId: data.doctorId,
        title: 'New Appointment Booked',
        body: `${patient.firstName} ${patient.lastName} has booked an appointment on ${data.appointmentDate} at ${data.appointmentTime}`,
        type: 'appointment',
        data: {
          appointmentId: appointment.id,
          patientId: data.patientId,
        },
        actionUrl: `/doctor/appointments/${appointment.id}`,
      });

      // Send confirmation to patient
      await this.sendNotification({
        userId: data.patientId,
        title: 'Appointment Confirmed',
        body: `Your appointment with Dr. ${doctorProfile.user.firstName} ${doctorProfile.user.lastName} is confirmed for ${data.appointmentDate} at ${data.appointmentTime}`,
        type: 'appointment',
        data: {
          appointmentId: appointment.id,
          doctorId: data.doctorId,
        },
        actionUrl: `/appointments/${appointment.id}`,
      });

      return appointment;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  /**
   * Get appointments with filters
   */
  async getAppointments(filter: AppointmentFilter) {
    try {
      const where: any = {};

      if (filter.patientId) where.patientId = filter.patientId;
      if (filter.doctorId) {
        // Get doctor profile ID from user ID
        const doctorProfile = await prisma.doctorProfile.findUnique({
          where: { userId: filter.doctorId },
        });
        if (doctorProfile) {
          where.doctorId = doctorProfile.id;
        }
      }
      if (filter.status) where.status = filter.status;
      if (filter.type) where.type = filter.type;
      if (filter.isOnline !== undefined) where.isOnline = filter.isOnline;

      if (filter.startDate || filter.endDate) {
        where.appointmentDate = {};
        if (filter.startDate) where.appointmentDate.gte = new Date(filter.startDate);
        if (filter.endDate) where.appointmentDate.lte = new Date(filter.endDate);
      }

      const appointments = await prisma.appointment.findMany({
        where,
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phoneNumber: true,
            },
          },
          doctor: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  phoneNumber: true,
                },
              },
            },
          },
        },
        orderBy: [{ appointmentDate: 'asc' }, { appointmentTime: 'asc' }],
      });

      return appointments;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  }

  /**
   * Get a single appointment by ID
   */
  async getAppointmentById(id: string, userId: string, userRole: string) {
    try {
      const appointment = await prisma.appointment.findUnique({
        where: { id },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phoneNumber: true,
            },
          },
          doctor: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  phoneNumber: true,
                },
              },
            },
          },
        },
      });

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Authorization check
      if (userRole === 'PATIENT' && appointment.patientId !== userId) {
        throw new Error('Unauthorized access to this appointment');
      }

      if (userRole === 'DOCTOR' && appointment.doctor.userId !== userId) {
        throw new Error('Unauthorized access to this appointment');
      }

      return appointment;
    } catch (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
  }

  /**
   * Update appointment (reschedule, update status, add notes)
   */
  async updateAppointment(id: string, data: UpdateAppointmentRequest, userId: string, userRole: string) {
    try {
      const appointment = await this.getAppointmentById(id, userId, userRole);

      const updateData: any = {};

      if (data.appointmentDate) {
        updateData.appointmentDate = new Date(data.appointmentDate);
      }
      if (data.appointmentTime) {
        updateData.appointmentTime = data.appointmentTime;
      }
      if (data.status) {
        updateData.status = data.status;
        if (data.status === 'RESCHEDULED') {
          updateData.status = 'RESCHEDULED';
        }
      }
      if (data.diagnosis) {
        updateData.diagnosis = data.diagnosis;
      }
      if (data.prescription) {
        updateData.prescription = JSON.stringify(data.prescription);
      }
      if (data.notes) {
        updateData.notes = data.notes;
      }
      if (data.followUpDate) {
        updateData.followUpDate = new Date(data.followUpDate);
      }

      const updatedAppointment = await prisma.appointment.update({
        where: { id },
        data: updateData,
        include: {
          patient: true,
          doctor: {
            include: {
              user: true,
            },
          },
        },
      });

      // Send notification about update
      if (data.status === 'CANCELLED') {
        const notifyUserId = userRole === 'DOCTOR' ? appointment.patientId : appointment.doctor.userId;
        await this.sendNotification({
          userId: notifyUserId,
          title: 'Appointment Cancelled',
          body: `Your appointment on ${appointment.appointmentDate.toDateString()} at ${appointment.appointmentTime} has been cancelled`,
          type: 'appointment',
          data: { appointmentId: id },
        });
      } else if (data.appointmentDate || data.appointmentTime) {
        const notifyUserId = userRole === 'DOCTOR' ? appointment.patientId : appointment.doctor.userId;
        await this.sendNotification({
          userId: notifyUserId,
          title: 'Appointment Rescheduled',
          body: `Your appointment has been rescheduled to ${data.appointmentDate || appointment.appointmentDate.toDateString()} at ${data.appointmentTime || appointment.appointmentTime}`,
          type: 'appointment',
          data: { appointmentId: id },
        });
      }

      return updatedAppointment;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  }

  /**
   * Cancel appointment
   */
  async cancelAppointment(id: string, userId: string, userRole: string) {
    return this.updateAppointment(id, { status: AppointmentStatus.CANCELLED }, userId, userRole);
  }

  /**
   * Update doctor availability slots
   */
  async updateDoctorAvailability(doctorId: string, slots: any[]) {
    try {
      const doctorProfile = await prisma.doctorProfile.findUnique({
        where: { userId: doctorId },
      });

      if (!doctorProfile) {
        throw new Error('Doctor profile not found');
      }

      const updatedProfile = await prisma.doctorProfile.update({
        where: { id: doctorProfile.id },
        data: {
          availableSlots: JSON.stringify(slots),
        },
      });

      return updatedProfile;
    } catch (error) {
      console.error('Error updating doctor availability:', error);
      throw error;
    }
  }

  /**
   * Get patient details with profile
   */
  async getPatientDetails(patientId: string) {
    try {
      const patient = await prisma.user.findUnique({
        where: { id: patientId },
        include: {
          profile: true,
        },
      });

      if (!patient) {
        throw new Error('Patient not found');
      }

      return patient;
    } catch (error) {
      console.error('Error fetching patient details:', error);
      throw error;
    }
  }

  /**
   * Send notification via notification service
   */
  private async sendNotification(payload: NotificationPayload) {
    try {
      await axios.post(`${NOTIFICATION_SERVICE_URL}/send`, payload);
    } catch (error) {
      console.error('Error sending notification:', error);
      // Don't throw error, notification failure shouldn't stop the main operation
    }
  }

  /**
   * Get appointment statistics for doctor dashboard
   */
  async getDoctorStatistics(doctorId: string) {
    try {
      const doctorProfile = await prisma.doctorProfile.findUnique({
        where: { userId: doctorId },
      });

      if (!doctorProfile) {
        throw new Error('Doctor profile not found');
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [totalAppointments, todayAppointments, upcomingAppointments, completedAppointments] =
        await Promise.all([
          prisma.appointment.count({
            where: { doctorId: doctorProfile.id },
          }),
          prisma.appointment.count({
            where: {
              doctorId: doctorProfile.id,
              appointmentDate: today,
              status: { in: ['SCHEDULED', 'RESCHEDULED'] },
            },
          }),
          prisma.appointment.count({
            where: {
              doctorId: doctorProfile.id,
              appointmentDate: { gte: today },
              status: { in: ['SCHEDULED', 'RESCHEDULED'] },
            },
          }),
          prisma.appointment.count({
            where: {
              doctorId: doctorProfile.id,
              status: 'COMPLETED',
            },
          }),
        ]);

      return {
        totalAppointments,
        todayAppointments,
        upcomingAppointments,
        completedAppointments,
      };
    } catch (error) {
      console.error('Error fetching doctor statistics:', error);
      throw error;
    }
  }
}

export default new AppointmentService();
