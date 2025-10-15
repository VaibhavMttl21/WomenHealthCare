import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import mealPlannerRoutes from './routes/mealPlanner.routes';
import { errorHandler, notFound } from './middleware/errorHandler';

// Debug BEFORE loading dotenv
console.log('🔍 MEAL PLANNER DEBUG BEFORE DOTENV: process.env.PORT =', process.env.PORT);

// Load .env from the service directory with override
dotenv.config({ 
  path: path.resolve(__dirname, '../.env'),
  override: true 
});

// Debug AFTER loading dotenv
console.log('🔍 MEAL PLANNER DEBUG AFTER DOTENV: process.env.PORT =', process.env.PORT);
console.log('🔍 MEAL PLANNER DEBUG: __dirname =', __dirname);
console.log('🔍 MEAL PLANNER DEBUG: .env path =', path.resolve(__dirname, '../.env'));

// Initialize Prisma Client
const prisma = new PrismaClient();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3007;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(compression()); // Compress responses
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging middleware (for development)
if (process.env.NODE_ENV === 'development') {
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    service: 'meal-planner-service',
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// API Routes (no /api prefix - handled by API Gateway)
app.use('/', mealPlannerRoutes);

// Root endpoint info (for direct service access)
app.get('/info', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Meal Planner Service API',
    version: '2.0.0',
    endpoints: {
      health: 'GET /health',
      generate: 'POST /generate',
      getMealPlan: 'GET /:id',
      getUserPlans: 'GET /user/:userId',
      updateSelection: 'PUT /suggestion/:suggestionId',
      deletePlan: 'DELETE /:id',
    },
    note: 'This service is accessed through API Gateway at /api/mealplanner',
  });
});

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown handler
const gracefulShutdown = async () => {
  console.log('\n🛑 Shutting down gracefully...');
  
  try {
    // Disconnect Prisma
    await prisma.$disconnect();
    console.log('✅ Database disconnected');
    
    // Exit process
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't crash the server, just log
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown();
});

// Start server
app.listen(PORT, async () => {
  console.log('='.repeat(50));
  console.log('🍽️  Meal Planner Service');
  console.log('='.repeat(50));
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`📋 API docs: http://localhost:${PORT}/`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Test database connection
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.error('⚠️  Please check your DIRECT_URL in .env file');
  }
  
  // Check for Gemini API key
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  WARNING: GEMINI_API_KEY not set!');
    console.warn('   Please add it to your .env file for meal generation to work');
  } else {
    console.log('✅ Gemini API key configured');
  }
  
  console.log('='.repeat(50));
});

export default app;
