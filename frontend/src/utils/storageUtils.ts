// Local storage utility functions for onboarding form data

const STORAGE_KEY = 'onboarding_form_data';
const EXPIRY_KEY = 'onboarding_form_expiry';
const EXPIRY_HOURS = 24; // Form data expires after 24 hours

export interface OnboardingFormData {
  step: number;
  role: 'patient' | 'doctor';
  basicInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
  };
  patientProfile?: {
    dateOfBirth: string;
    pregnancyStage: string;
    dueDate: string;
    lastPeriodDate: string;
    emergencyContact: string;
    emergencyPhone: string;
    address: string;
    village: string;
    district: string;
    state: string;
    pincode: string;
    preferredLanguage: string;
    hasSmartphone: boolean;
    internetAccess: string;
    educationLevel: string;
    occupation: string;
    familyIncome: string;
  };
  doctorProfile?: {
    licenseNumber: string;
    specialization: string;
    qualification: string;
    experience: string;
    hospitalName: string;
    clinicAddress: string;
    consultationFee: string;
    bio: string;
    languages: string[];
    servesRuralAreas: boolean;
    telemedicineEnabled: boolean;
  };
  medicalInfo?: {
    medicalHistory: string[];
    allergies: string[];
    currentMedications: string[];
  };
}

export const saveFormData = (data: Partial<OnboardingFormData>): void => {
  try {
    const existingData = getFormData();
    const mergedData = { ...existingData, ...data };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedData));
    
    // Set expiry timestamp
    const expiryTime = new Date().getTime() + (EXPIRY_HOURS * 60 * 60 * 1000);
    localStorage.setItem(EXPIRY_KEY, expiryTime.toString());
  } catch (error) {
    console.error('Error saving form data to localStorage:', error);
  }
};

export const getFormData = (): Partial<OnboardingFormData> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const expiry = localStorage.getItem(EXPIRY_KEY);
    
    if (!data) {
      return {};
    }
    
    // Check if data has expired
    if (expiry && new Date().getTime() > parseInt(expiry)) {
      clearFormData();
      return {};
    }
    
    return JSON.parse(data);
  } catch (error) {
    console.error('Error retrieving form data from localStorage:', error);
    return {};
  }
};

export const clearFormData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(EXPIRY_KEY);
  } catch (error) {
    console.error('Error clearing form data from localStorage:', error);
  }
};

export const hasStoredFormData = (): boolean => {
  const data = getFormData();
  return Object.keys(data).length > 0;
};
