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

export interface CreateAppointmentRequest {
  patientId: string;
  doctorId: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:mm
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

export interface DoctorAvailability {
  doctorId: string;
  date: string; // YYYY-MM-DD
  slots: TimeSlot[];
}

export interface TimeSlot {
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isAvailable: boolean;
  duration: number; // minutes
}

export interface AppointmentFilter {
  patientId?: string;
  doctorId?: string;
  status?: AppointmentStatus;
  type?: AppointmentType;
  startDate?: string;
  endDate?: string;
  isOnline?: boolean;
}

export interface NotificationPayload {
  userId: string;
  title: string;
  body: string;
  type: string;
  data?: any;
  actionUrl?: string;
}
