import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './routes/auth.routes';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

// Debug BEFORE loading dotenv
console.log('🔍 DEBUG BEFORE DOTENV: process.env.PORT =', process.env.PORT);

// Load .env from the service directory with override
dotenv.config({ 
  path: path.resolve(__dirname, '../.env'),
  override: true  // Override any existing environment variables
});

// Debug AFTER loading dotenv
console.log('🔍 DEBUG AFTER DOTENV: process.env.PORT =', process.env.PORT);
console.log('🔍 DEBUG: __dirname =', __dirname);
console.log('🔍 DEBUG: .env path =', path.resolve(__dirname, '../.env'));

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: "*",
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
    service: 'auth-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/', authRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🔐 Auth Service running on port ${PORT}`);
  console.log(`📡 Health check available at http://localhost:${PORT}/health`);
});

export default app;
