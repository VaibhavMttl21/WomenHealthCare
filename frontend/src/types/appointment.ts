export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  RESCHEDULED = 'RESCHEDULED',
  NO_SHOW = 'NO_SHOW',
}

export enum AppointmentType {
  CONSULTATION = 'CONSULTATION',
  CHECKUP = 'CHECKUP',
  EMERGENCY = 'EMERGENCY',
  FOLLOW_UP = 'FOLLOW_UP',
}

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  profile?: DoctorProfile;
}

export interface DoctorProfile {
  id: string;
  specialization: string;
  qualification: string;
  experience: number;
  hospitalName?: string;
  clinicAddress?: string;
  consultationFee?: number;
  rating?: number;
  totalRatings: number;
  bio?: string;
  languages?: string[];
  servesRuralAreas: boolean;
  telemedicineEnabled: boolean;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  duration: number;
  isAvailable: boolean;
}

export interface DoctorAvailability {
  doctorId: string;
  date: string;
  slots: TimeSlot[];
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
}

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
    user?: Patient;
  };
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
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
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  duration?: number;
  type: AppointmentType;
  reason?: string;
  symptoms?: string[];
  isOnline?: boolean;
}

export interface UpdateAppointmentRequest {
  appointmentDate?: string;
  appointmentTime?: string;
  status?: AppointmentStatus;
  diagnosis?: string;
  prescription?: any[];
  notes?: string;
  followUpDate?: string;
}

export interface AppointmentFilter {
  status?: AppointmentStatus;
  type?: AppointmentType;
  startDate?: string;
  endDate?: string;
  isOnline?: boolean;
}

export interface DoctorStatistics {
  totalAppointments: number;
  todayAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
}

