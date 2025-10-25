import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import appointmentRoutes from './routes/appointment.routes';
import { errorHandler } from './middleware/errorHandler';
import './config/database.config'; // Initialize database

// Load .env from the service directory with override
dotenv.config({
  path: path.resolve(__dirname, '../.env'),
  override: true,
});

const app: Application = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(cors({
  origin: "*",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    service: 'appointment-service',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/', appointmentRoutes);

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Appointment Service running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
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
