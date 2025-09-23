export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED' | 'NO_SHOW';
  type: 'CONSULTATION' | 'CHECKUP' | 'EMERGENCY' | 'FOLLOW_UP';
  reason?: string;
  symptoms?: string;
  diagnosis?: string;
  prescription?: string;
  notes?: string;
  followUpDate?: string;
  fees?: number;
  isPaid: boolean;
  isOnline: boolean;
  meetingLink?: string;
  createdAt: string;
  updatedAt: string;
  doctor?: {
    id: string;
    firstName: string;
    lastName: string;
    specialization: string;
    rating?: number;
  };
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    age?: number;
  };
}

export interface AppointmentSlot {
  date: string;
  time: string;
  available: boolean;
  doctorId: string;
}

export interface CreateAppointmentRequest {
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  type: Appointment['type'];
  reason?: string;
  symptoms?: string;
  isOnline: boolean;
}
