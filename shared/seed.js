import { PrismaClient, UserRole, PregnancyStage } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Hash password for demo users
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create demo patients
  const patient1 = await prisma.user.create({
    data: {
      email: 'priya.sharma@example.com',
      password: hashedPassword,
      role: UserRole.PATIENT,
      firstName: 'Priya',
      lastName: 'Sharma',
      phoneNumber: '+91-9876543210',
      isVerified: true,
      profile: {
        create: {
          age: 28,
          pregnancyStage: PregnancyStage.SECOND_TRIMESTER,
          dueDate: new Date('2024-06-15'),
          village: 'Rampur',
          district: 'Sitapur',
          state: 'Uttar Pradesh',
          pincode: '261001',
          preferredLanguage: 'hi',
          hasSmartphone: true,
          internetAccess: 'poor',
          educationLevel: 'secondary',
          occupation: 'Housewife',
          familyIncome: 'low',
        },
      },
    },
  });

  const patient2 = await prisma.user.create({
    data: {
      email: 'sunita.devi@example.com',
      password: hashedPassword,
      role: UserRole.PATIENT,
      firstName: 'Sunita',
      lastName: 'Devi',
      phoneNumber: '+91-9123456789',
      isVerified: true,
      profile: {
        create: {
          age: 32,
          pregnancyStage: PregnancyStage.THIRD_TRIMESTER,
          dueDate: new Date('2024-04-20'),
          village: 'Mahalpur',
          district: 'Bhojpur',
          state: 'Bihar',
          pincode: '802301',
          preferredLanguage: 'hi',
          hasSmartphone: false,
          internetAccess: 'none',
          educationLevel: 'primary',
          occupation: 'Agricultural Worker',
          familyIncome: 'below_poverty',
        },
      },
    },
  });

  // Create demo doctors
  const doctor1 = await prisma.user.create({
    data: {
      email: 'dr.rajesh@example.com',
      password: hashedPassword,
      role: UserRole.DOCTOR,
      firstName: 'Dr. Rajesh',
      lastName: 'Kumar',
      phoneNumber: '+91-9988776655',
      isVerified: true,
      doctorProfile: {
        create: {
          licenseNumber: 'MCI-12345',
          specialization: 'Gynecology & Obstetrics',
          qualification: 'MBBS, MD (Gynecology)',
          experience: 15,
          hospitalName: 'Rural Health Center, Sitapur',
          consultationFee: 200.0,
          isVerified: true,
          rating: 4.5,
          totalRatings: 120,
          bio: 'Experienced gynecologist specializing in rural healthcare and maternal care.',
          languages: '["en", "hi"]',
          servesRuralAreas: true,
          telemedicineEnabled: true,
        },
      },
    },
  });

  // Create sample health content
  await prisma.healthContent.createMany({
    data: [
      {
        title: 'गर्भावस्था में पोषण की महत्ता',
        content: 'गर्भावस्था के दौरान सही पोषण माँ और बच्चे दोनों के लिए अत्यंत महत्वपूर्ण है...',
        category: 'nutrition',
        targetAudience: 'pregnant',
        language: 'hi',
        tags: '["pregnancy", "nutrition", "health"]',
      },
      {
        title: 'Essential Nutrients During Pregnancy',
        content: 'During pregnancy, your body needs extra nutrients to support your growing baby...',
        category: 'nutrition',
        targetAudience: 'pregnant',
        language: 'en',
        tags: '["pregnancy", "nutrition", "vitamins"]',
      },
      {
        title: 'Safe Exercises in Pregnancy',
        content: 'Regular, moderate exercise during pregnancy can help you stay healthy...',
        category: 'exercise',
        targetAudience: 'pregnant',
        language: 'en',
        tags: '["pregnancy", "exercise", "fitness"]',
      },
    ],
  });

  // Create system configuration
  await prisma.systemConfig.createMany({
    data: [
      {
        key: 'openai_api_key',
        value: 'your-openai-api-key-here',
        description: 'OpenAI API key for chat functionality',
      },
      {
        key: 'default_consultation_duration',
        value: '30',
        description: 'Default appointment duration in minutes',
      },
      {
        key: 'max_chat_history',
        value: '50',
        description: 'Maximum number of chat messages to retain per session',
      },
    ],
  });

  console.log('Database seeded successfully!');
  console.log('Demo patients created:', [patient1.email, patient2.email]);
  console.log('Demo doctor created:', doctor1.email);
  console.log('Default password for all demo users: password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
