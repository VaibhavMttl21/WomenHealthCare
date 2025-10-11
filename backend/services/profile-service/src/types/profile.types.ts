export interface PersonalInfo {
  age?: number;
  heightCm?: number;
  weightKg?: number;
  bloodGroup?: string;
  bmi?: number;
  maritalStatus?: string;
  childrenCount?: number;
  occupation?: string;
  dietaryPreference?: string;
  exerciseHabits?: string;
  sleepHours?: number;
  smoking?: boolean;
  alcohol?: boolean;
}

export interface ReproductiveInfo {
  lastPeriodDate?: string;
  averageCycleLength?: number;
  pastPregnancies?: number;
  miscarriages?: number;
  pregnancyType?: string;
  expectedDueDate?: string;
  doctorName?: string;
  hospital?: string;
  bloodPressure?: string;
  sugarLevel?: string;
  trimester?: number;
  complications?: string[];
}

export interface HealthPreferences {
  preferredLanguage?: string;
  notificationTime?: string;
  stressLevel?: string;
  sleepQuality?: string;
  waterIntakeLiters?: number;
  supportPreferences?: string[];
}

export interface NutritionInfo {
  dietaryRestrictions?: string[];
  favoriteFoods?: string[];
  deficiencies?: string[];
  supplements?: string[];
}

export interface FamilySupport {
  spouse?: {
    name: string;
    phone: string;
    bloodGroup: string;
  };
  familyHistory?: string[];
  primaryCaregiverContact?: string;
  dependentsCount?: number;
}

export interface CompleteProfileData {
  personalInfo?: PersonalInfo;
  reproductiveInfo?: ReproductiveInfo;
  healthPreferences?: HealthPreferences;
  nutritionInfo?: NutritionInfo;
  familySupport?: FamilySupport;
  address?: string;
  village?: string;
  district?: string;
  state?: string;
  pincode?: string;
  medicalHistory?: any[];
  allergies?: string[];
  currentMedications?: string[];
}

export interface ProfileResponse {
  success: boolean;
  data?: any;
  message?: string;
  completionPercentage?: number;
}
