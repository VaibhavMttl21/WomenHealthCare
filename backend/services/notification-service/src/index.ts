import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import notificationRoutes from './routes/notification.routes';
import { errorHandler } from './middleware/errorHandler';
import { initializeCronJobs } from './cron/scheduler';
import './config/firebase.config'; // Initialize Firebase

// Debug BEFORE loading dotenv
console.log('🔍 NOTIFICATION DEBUG BEFORE DOTENV: process.env.PORT =', process.env.PORT);

// Load .env from the service directory with override
dotenv.config({ 
  path: path.resolve(__dirname, '../.env'),
  override: true 
});

// Debug AFTER loading dotenv
console.log('🔍 NOTIFICATION DEBUG AFTER DOTENV: process.env.PORT =', process.env.PORT);
console.log('🔍 NOTIFICATION DEBUG: __dirname =', __dirname);
console.log('🔍 NOTIFICATION DEBUG: .env path =', path.resolve(__dirname, '../.env'));

const app: Application = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'notification-service',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/', notificationRoutes);

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Notification Service running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Initialize cron jobs
  initializeCronJobs();
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

export default app;
