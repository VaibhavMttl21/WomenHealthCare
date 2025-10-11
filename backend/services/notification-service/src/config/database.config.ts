// Import Prisma client from local generated client
import { PrismaClient } from '@prisma/client';

// Create Prisma Client instance with proper error handling
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
});

// Test database connection on startup
prisma.$connect()
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error);
    console.error('❌ Check your DATABASE_URL or DIRECT_URL environment variable');
  });

// Handle graceful shutdown
process.on('beforeExit', async () => {
  console.log('🔄 Disconnecting from database...');
  await prisma.$disconnect();
});

process.on('SIGINT', async () => {
  console.log('🔄 SIGINT received, disconnecting from database...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🔄 SIGTERM received, disconnecting from database...');
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;
