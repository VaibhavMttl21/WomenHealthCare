import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

import profileRoutes from './routes/profile.routes';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

// Load .env from the service directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3002;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'profile-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/profile', profileRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`👤 Profile Service running on port ${PORT}`);
  console.log(`📡 Health check available at http://localhost:${PORT}/health`);
});

export default app;
