import { z } from 'zod';

// Basic registration schema - for initial user creation
export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  role: z.enum(['PATIENT', 'DOCTOR', 'ADMIN'], {
    required_error: 'Please select your role',
    invalid_type_error: 'Invalid role selected',
  }),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phoneNumber: z.string().regex(/^[+]?[\d\s\-\(\)]+$/, 'Please enter a valid phone number'),
});

// Patient profile schema
export const patientProfileSchema = z.object({
  dateOfBirth: z.string().optional(),
  pregnancyStage: z.enum(['FIRST_TRIMESTER', 'SECOND_TRIMESTER', 'THIRD_TRIMESTER', 'POSTPARTUM', 'NOT_PREGNANT']).optional(),
  dueDate: z.string().optional(),
  lastPeriodDate: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  address: z.string().optional(),
  village: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits').optional().or(z.literal('')),
  medicalHistory: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  currentMedications: z.array(z.string()).optional(),
  preferredLanguage: z.string().default('en'),
  hasSmartphone: z.boolean().default(false),
  internetAccess: z.enum(['good', 'poor', 'none']).optional(),
  educationLevel: z.string().optional(),
  occupation: z.string().optional(),
  familyIncome: z.string().optional(),
});

// Doctor profile schema
export const doctorProfileSchema = z.object({
  licenseNumber: z.string().min(1, 'Medical license number is required'),
  specialization: z.string().min(1, 'Specialization is required'),
  qualification: z.string().min(1, 'Qualification is required'),
  experience: z.number().min(0, 'Experience must be a positive number'),
  hospitalName: z.string().optional(),
  clinicAddress: z.string().optional(),
  consultationFee: z.number().optional(),
  bio: z.string().optional(),
  languages: z.array(z.string()).optional(),
  servesRuralAreas: z.boolean().default(false),
  telemedicineEnabled: z.boolean().default(true),
});

// Complete registration schema with profile data
export const completeRegistrationSchema = z.object({
  // Basic info
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['PATIENT', 'DOCTOR', 'ADMIN']),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phoneNumber: z.string(),
  
  // Optional profile data
  profile: z.union([patientProfileSchema, doctorProfileSchema]).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type PatientProfileInput = z.infer<typeof patientProfileSchema>;
export type DoctorProfileInput = z.infer<typeof doctorProfileSchema>;
export type CompleteRegistrationInput = z.infer<typeof completeRegistrationSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
