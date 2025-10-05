import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient, UserRole } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { 
  registerSchema, 
  loginSchema, 
  refreshTokenSchema,
  patientProfileSchema,
  doctorProfileSchema,
  type PatientProfileInput,
  type DoctorProfileInput
} from '../utils/validation';
import { generateToken, hashPassword, comparePassword } from '../utils/auth.utils';

const router = Router();

// Initialize Prisma with Accelerate
const prisma = new PrismaClient().$extends(withAccelerate());

// Helper function to calculate age from date of birth
const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Register endpoint - Basic registration only
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Register request body:', req.body);
    
    // Validate input
    const validatedData = registerSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: { message: 'An account with this email already exists. Please login instead.' },
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role as UserRole,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phoneNumber: validatedData.phoneNumber,
      },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        isVerified: true,
        createdAt: true,
      },
    });

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      success: true,
      data: {
        user,
        token,
      },
      message: 'Account created successfully! Welcome to Rural Health Care.',
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Please check your information and try again.',
          details: error.errors,
        },
      });
    }
    return next(error);
  }
});

// Complete registration with profile - For onboarding flow
router.post('/register/complete', async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Complete registration request body:', req.body);
    
    const { email, password, role, firstName, lastName, phoneNumber, profile } = req.body;
    
    // Validate basic user data
    const validatedUserData = registerSchema.parse({
      email,
      password,
      role,
      firstName,
      lastName,
      phoneNumber,
    });
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedUserData.email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: { message: 'An account with this email already exists. Please login instead.' },
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedUserData.password);

    // Create user with profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email: validatedUserData.email,
          password: hashedPassword,
          role: validatedUserData.role as UserRole,
          firstName: validatedUserData.firstName,
          lastName: validatedUserData.lastName,
          phoneNumber: validatedUserData.phoneNumber,
        },
      });

      // Create profile based on role
      if (profile) {
        if (validatedUserData.role === 'PATIENT' && profile.dateOfBirth) {
          // Validate patient profile
          const validatedProfile = patientProfileSchema.parse(profile) as PatientProfileInput;
          
          // Prepare profile data, filtering out undefined values
          const profileData: any = {
            userId: user.id,
            preferredLanguage: validatedProfile.preferredLanguage || 'en',
            hasSmartphone: validatedProfile.hasSmartphone,
          };

          // Add optional fields only if they have values
          if (validatedProfile.dateOfBirth) {
            profileData.dateOfBirth = new Date(validatedProfile.dateOfBirth);
            profileData.age = calculateAge(validatedProfile.dateOfBirth);
          }
          if (validatedProfile.pregnancyStage) profileData.pregnancyStage = validatedProfile.pregnancyStage;
          if (validatedProfile.dueDate) profileData.dueDate = new Date(validatedProfile.dueDate);
          if (validatedProfile.lastPeriodDate) profileData.lastPeriodDate = new Date(validatedProfile.lastPeriodDate);
          if (validatedProfile.emergencyContact) profileData.emergencyContact = validatedProfile.emergencyContact;
          if (validatedProfile.emergencyPhone) profileData.emergencyPhone = validatedProfile.emergencyPhone;
          if (validatedProfile.address) profileData.address = validatedProfile.address;
          if (validatedProfile.village) profileData.village = validatedProfile.village;
          if (validatedProfile.district) profileData.district = validatedProfile.district;
          if (validatedProfile.state) profileData.state = validatedProfile.state;
          if (validatedProfile.pincode) profileData.pincode = validatedProfile.pincode;
          if (validatedProfile.medicalHistory && validatedProfile.medicalHistory.length > 0) {
            profileData.medicalHistory = JSON.stringify(validatedProfile.medicalHistory);
          }
          if (validatedProfile.allergies && validatedProfile.allergies.length > 0) {
            profileData.allergies = JSON.stringify(validatedProfile.allergies);
          }
          if (validatedProfile.currentMedications && validatedProfile.currentMedications.length > 0) {
            profileData.currentMedications = JSON.stringify(validatedProfile.currentMedications);
          }
          if (validatedProfile.internetAccess) profileData.internetAccess = validatedProfile.internetAccess;
          if (validatedProfile.educationLevel) profileData.educationLevel = validatedProfile.educationLevel;
          if (validatedProfile.occupation) profileData.occupation = validatedProfile.occupation;
          if (validatedProfile.familyIncome) profileData.familyIncome = validatedProfile.familyIncome;
          
          // Create patient profile
          await tx.userProfile.create({ data: profileData });
        } else if (validatedUserData.role === 'DOCTOR' && profile.licenseNumber) {
          // Validate doctor profile
          const validatedProfile = doctorProfileSchema.parse({
            ...profile,
            experience: typeof profile.experience === 'string' ? parseInt(profile.experience) : profile.experience,
            consultationFee: profile.consultationFee ? parseFloat(profile.consultationFee) : undefined,
          }) as DoctorProfileInput;
          
          // Prepare doctor profile data, filtering out undefined values
          const doctorData: any = {
            userId: user.id,
            licenseNumber: validatedProfile.licenseNumber,
            specialization: validatedProfile.specialization,
            qualification: validatedProfile.qualification,
            experience: validatedProfile.experience,
            servesRuralAreas: validatedProfile.servesRuralAreas,
            telemedicineEnabled: validatedProfile.telemedicineEnabled,
          };

          // Add optional fields only if they have values
          if (validatedProfile.hospitalName) doctorData.hospitalName = validatedProfile.hospitalName;
          if (validatedProfile.clinicAddress) doctorData.clinicAddress = validatedProfile.clinicAddress;
          if (validatedProfile.consultationFee) doctorData.consultationFee = validatedProfile.consultationFee;
          if (validatedProfile.bio) doctorData.bio = validatedProfile.bio;
          if (validatedProfile.languages && validatedProfile.languages.length > 0) {
            doctorData.languages = JSON.stringify(validatedProfile.languages);
          }
          
          // Create doctor profile
          await tx.doctorProfile.create({ data: doctorData });
        }
      }

      // Fetch complete user data with profile
      const completeUser = await tx.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          isVerified: true,
          createdAt: true,
          profile: true,
          doctorProfile: true,
        },
      });

      return completeUser;
    });

    // Generate JWT token
    const token = generateToken({
      id: result!.id,
      email: result!.email,
      role: result!.role,
    });

    res.status(201).json({
      success: true,
      data: {
        user: result,
        token,
      },
      message: result!.role === 'PATIENT' 
        ? 'Welcome to Rural Health Care! Your health profile has been created.' 
        : 'Welcome Dr. ' + result!.lastName + '! Your professional profile is now active.',
    });
  } catch (error: any) {
    console.error('Complete registration error:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Please check your information and try again.',
          details: error.errors,
        },
      });
    }
    return next(error);
  }
});

// Login endpoint
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const validatedData = loginSchema.parse(req.body);
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid email or password' },
      });
    }
    
    // Check password
    const isPasswordValid = await comparePassword(validatedData.password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid email or password' },
      });
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Update last login and fetch complete user data with profile
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const completeUserData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        isVerified: true,
        profile: {
          select: {
            pregnancyStage: true,
            dueDate: true,
            preferredLanguage: true,
            hasSmartphone: true,
            village: true,
            district: true,
            state: true,
          },
        },
        doctorProfile: {
          select: {
            specialization: true,
            qualification: true,
            experience: true,
            isVerified: true,
            rating: true,
          },
        },
      },
    });
    
    res.status(200).json({
      success: true,
      data: {
        user: completeUserData,
        token,
      },
      message: user.role === 'PATIENT' 
        ? 'Welcome back! Hope you\'re doing well.' 
        : 'Welcome back, Dr. ' + user.lastName + '!',
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: error.errors,
        },
      });
    }
    return next(error);
    
  }
});

// Refresh token endpoint (placeholder for future implementation)
router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = refreshTokenSchema.parse(req.body);
    
    // For now, just return success
    // In production, implement proper refresh token logic
    res.status(200).json({
      success: true,
      message: 'Refresh token endpoint - to be implemented',
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: error.errors,
        },
      });
    }
    return next(error);
    
  }
});

// Logout endpoint (placeholder)
router.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // In production, implement token blacklisting
    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
