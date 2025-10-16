import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';

// Debug BEFORE loading dotenv
console.log('🔍 API GATEWAY DEBUG BEFORE DOTENV: process.env.PORT =', process.env.PORT);

// Load .env from the gateway directory with override - MUST BE BEFORE ROUTE IMPORTS
dotenv.config({ 
  path: path.resolve(__dirname, '../.env'),
  override: true 
});

// Debug AFTER loading dotenv
console.log('🔍 API GATEWAY DEBUG AFTER DOTENV: process.env.PORT =', process.env.PORT);
console.log('🔍 API GATEWAY DEBUG AFTER DOTENV: process.env.MEAL_PLANNER_SERVICE_URL =', process.env.MEAL_PLANNER_SERVICE_URL);
console.log('🔍 API GATEWAY DEBUG: __dirname =', __dirname);
console.log('🔍 API GATEWAY DEBUG: .env path =', path.resolve(__dirname, '../.env'));

// Import routes AFTER dotenv is configured
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import chatRoutes from './routes/chat.routes';
import chatbotRoutes from './routes/chatbot.routes';
import appointmentRoutes from './routes/appointment.routes';
import notificationRoutes from './routes/notifications.route';
import mealPlannerRoutes from './routes/mealplanner.routes';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: "*",
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100000, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Parsing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Debug endpoint to test token validation
import { authenticateToken, AuthRequest } from './middleware/auth';
app.get('/api/debug/token', authenticateToken, (req: AuthRequest, res) => {
  res.status(200).json({
    success: true,
    message: 'Token is valid',
    user: req.user,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/mealplanner', mealPlannerRoutes);
// Error handling middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📡 Health check available at http://localhost:${PORT}/health`);
});

export default app;
