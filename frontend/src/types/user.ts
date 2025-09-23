export interface User {
  id: string;
  email: string;
  role: 'patient' | 'doctor';
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  age?: number;
  dateOfBirth?: string;
  pregnancyStage?: 'FIRST_TRIMESTER' | 'SECOND_TRIMESTER' | 'THIRD_TRIMESTER' | 'POSTPARTUM' | 'NOT_PREGNANT';
  dueDate?: string;
  lastPeriodDate?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  address?: string;
  village?: string;
  district?: string;
  state?: string;
  pincode?: string;
  medicalHistory?: string;
  allergies?: string;
  currentMedications?: string;
  preferredLanguage: string;
  hasSmartphone: boolean;
  internetAccess?: 'good' | 'poor' | 'none';
  educationLevel?: 'none' | 'primary' | 'secondary' | 'higher';
  occupation?: string;
  familyIncome?: 'below_poverty' | 'low' | 'middle' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface DoctorProfile {
  id: string;
  userId: string;
  licenseNumber: string;
  specialization: string;
  qualification: string;
  experience: number;
  hospitalName?: string;
  clinicAddress?: string;
  consultationFee?: number;
  availableSlots?: string;
  isVerified: boolean;
  rating?: number;
  totalRatings: number;
  bio?: string;
  languages?: string;
  servesRuralAreas: boolean;
  telemedicineEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: any;
  };
  message?: string;
}
