import { PrismaClient } from '@prisma/client';
import { CompleteProfileData } from '../types/profile.types';

const prisma = new PrismaClient();

export class ProfileService {
  /**
   * Calculate profile completion percentage
   */
  calculateCompletionPercentage(profile: any): number {
    const fields = [
      // Personal Info (20%)
      'age', 'heightCm', 'weightKg', 'bloodGroup', 'maritalStatus', 
      'occupation', 'dietaryPreference', 'exerciseHabits',
      
      // Reproductive Info (25%)
      'lastPeriodDate', 'expectedDueDate', 'doctorName', 'hospital', 
      'bloodPressure', 'trimester',
      
      // Health Preferences (15%)
      'preferredLanguage', 'stressLevel', 'sleepQuality', 'waterIntakeLiters',
      
      // Nutrition (15%)
      'dietaryRestrictions', 'supplements',
      
      // Family Support (15%)
      'spouseName', 'spousePhone', 'primaryCaregiverContact',
      
      // Location (10%)
      'village', 'district', 'state', 'pincode'
    ];

    const filledFields = fields.filter(field => {
      const value = profile[field];
      return value !== null && value !== undefined && value !== '';
    }).length;

    return Math.round((filledFields / fields.length) * 100);
  }

  /**
   * Get user profile by user ID
   */
  async getProfile(userId: string) {
    try {
      const profile = await prisma.userProfile.findUnique({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phoneNumber: true,
            }
          }
        }
      });

      if (!profile) {
        return null;
      }

      // Parse JSON fields
      const parsedProfile = {
        ...profile,
        complications: profile.complications ? JSON.parse(profile.complications) : [],
        supportPreferences: profile.supportPreferences ? JSON.parse(profile.supportPreferences) : [],
        dietaryRestrictions: profile.dietaryRestrictions ? JSON.parse(profile.dietaryRestrictions) : [],
        favoriteFoods: profile.favoriteFoods ? JSON.parse(profile.favoriteFoods) : [],
        deficiencies: profile.deficiencies ? JSON.parse(profile.deficiencies) : [],
        supplements: profile.supplements ? JSON.parse(profile.supplements) : [],
        familyHistory: profile.familyHistory ? JSON.parse(profile.familyHistory) : [],
        allergies: profile.allergies ? JSON.parse(profile.allergies) : [],
        medicalHistory: profile.medicalHistory ? JSON.parse(profile.medicalHistory) : [],
        currentMedications: profile.currentMedications ? JSON.parse(profile.currentMedications) : [],
      };

      return parsedProfile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  /**
   * Create or update complete user profile
   */
  async updateCompleteProfile(userId: string, profileData: CompleteProfileData) {
    try {
      const {
        personalInfo,
        reproductiveInfo,
        healthPreferences,
        nutritionInfo,
        familySupport,
        address,
        village,
        district,
        state,
        pincode,
        medicalHistory,
        allergies,
        currentMedications
      } = profileData;

      // Build update data
      const updateData: any = {};

      // Personal Information
      if (personalInfo) {
        Object.assign(updateData, {
          age: personalInfo.age,
          heightCm: personalInfo.heightCm,
          weightKg: personalInfo.weightKg,
          bloodGroup: personalInfo.bloodGroup,
          bmi: personalInfo.bmi,
          maritalStatus: personalInfo.maritalStatus,
          childrenCount: personalInfo.childrenCount,
          occupation: personalInfo.occupation,
          dietaryPreference: personalInfo.dietaryPreference,
          exerciseHabits: personalInfo.exerciseHabits,
          sleepHours: personalInfo.sleepHours,
          smoking: personalInfo.smoking,
          alcohol: personalInfo.alcohol,
        });
      }

      // Reproductive Information
      if (reproductiveInfo) {
        Object.assign(updateData, {
          lastPeriodDate: reproductiveInfo.lastPeriodDate ? new Date(reproductiveInfo.lastPeriodDate) : undefined,
          averageCycleLength: reproductiveInfo.averageCycleLength,
          pastPregnancies: reproductiveInfo.pastPregnancies,
          miscarriages: reproductiveInfo.miscarriages,
          pregnancyType: reproductiveInfo.pregnancyType,
          expectedDueDate: reproductiveInfo.expectedDueDate ? new Date(reproductiveInfo.expectedDueDate) : undefined,
          dueDate: reproductiveInfo.expectedDueDate ? new Date(reproductiveInfo.expectedDueDate) : undefined,
          doctorName: reproductiveInfo.doctorName,
          hospital: reproductiveInfo.hospital,
          bloodPressure: reproductiveInfo.bloodPressure,
          sugarLevel: reproductiveInfo.sugarLevel,
          trimester: reproductiveInfo.trimester,
          complications: reproductiveInfo.complications ? JSON.stringify(reproductiveInfo.complications) : undefined,
        });
      }

      // Health Preferences
      if (healthPreferences) {
        Object.assign(updateData, {
          preferredLanguage: healthPreferences.preferredLanguage,
          notificationTime: healthPreferences.notificationTime,
          stressLevel: healthPreferences.stressLevel,
          sleepQuality: healthPreferences.sleepQuality,
          waterIntakeLiters: healthPreferences.waterIntakeLiters,
          supportPreferences: healthPreferences.supportPreferences ? JSON.stringify(healthPreferences.supportPreferences) : undefined,
        });
      }

      // Nutrition Information
      if (nutritionInfo) {
        Object.assign(updateData, {
          dietaryRestrictions: nutritionInfo.dietaryRestrictions ? JSON.stringify(nutritionInfo.dietaryRestrictions) : undefined,
          favoriteFoods: nutritionInfo.favoriteFoods ? JSON.stringify(nutritionInfo.favoriteFoods) : undefined,
          deficiencies: nutritionInfo.deficiencies ? JSON.stringify(nutritionInfo.deficiencies) : undefined,
          supplements: nutritionInfo.supplements ? JSON.stringify(nutritionInfo.supplements) : undefined,
        });
      }

      // Family Support
      if (familySupport) {
        Object.assign(updateData, {
          spouseName: familySupport.spouse?.name,
          spousePhone: familySupport.spouse?.phone,
          spouseBloodGroup: familySupport.spouse?.bloodGroup,
          familyHistory: familySupport.familyHistory ? JSON.stringify(familySupport.familyHistory) : undefined,
          primaryCaregiverContact: familySupport.primaryCaregiverContact,
          dependentsCount: familySupport.dependentsCount,
        });
      }

      // Location and Other Info
      Object.assign(updateData, {
        address,
        village,
        district,
        state,
        pincode,
        medicalHistory: medicalHistory ? JSON.stringify(medicalHistory) : undefined,
        allergies: allergies ? JSON.stringify(allergies) : undefined,
        currentMedications: currentMedications ? JSON.stringify(currentMedications) : undefined,
      });

      // Remove undefined values
      Object.keys(updateData).forEach(key => 
        updateData[key] === undefined && delete updateData[key]
      );

      // Upsert profile
      const profile = await prisma.userProfile.upsert({
        where: { userId },
        update: updateData,
        create: {
          userId,
          ...updateData,
        },
      });

      // Calculate completion percentage
      const completionPercentage = this.calculateCompletionPercentage(profile);

      // Update completion status
      const updatedProfile = await prisma.userProfile.update({
        where: { userId },
        data: {
          completionPercentage,
          profileCompleted: completionPercentage >= 80,
        },
      });

      return {
        profile: updatedProfile,
        completionPercentage,
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  /**
   * Get profile completion status
   */
  async getProfileCompletionStatus(userId: string) {
    try {
      const profile = await prisma.userProfile.findUnique({
        where: { userId },
        select: {
          completionPercentage: true,
          profileCompleted: true,
        }
      });

      if (!profile) {
        return {
          completionPercentage: 0,
          profileCompleted: false,
        };
      }

      return profile;
    } catch (error) {
      console.error('Error fetching completion status:', error);
      throw error;
    }
  }
}

export default new ProfileService();
