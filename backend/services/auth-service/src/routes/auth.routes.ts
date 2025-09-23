import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { registerSchema, loginSchema, refreshTokenSchema } from '../utils/validation';
import { generateToken, hashPassword, comparePassword } from '../utils/auth.utils';

const router = Router();

// Initialize Prisma with Accelerate
const prisma = new PrismaClient().$extends(withAccelerate());

// Register endpoint
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const validatedData = registerSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: { message: 'User with this email already exists' },
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phoneNumber: validatedData.phoneNumber,
      },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        createdAt: true,
      },
    });

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      success: true,
      data: {
        user,
        token,
      },
      message: 'User registered successfully',
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: error.errors,
        },
      });
    }
    return next(error);
  }
});

// Login endpoint
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const validatedData = loginSchema.parse(req.body);
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid email or password' },
      });
    }
    
    // Check password
    const isPasswordValid = await comparePassword(validatedData.password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid email or password' },
      });
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });
    
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
        },
        token,
      },
      message: 'Login successful',
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: error.errors,
        },
      });
    }
    return next(error);
    
  }
});

// Refresh token endpoint (placeholder for future implementation)
router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = refreshTokenSchema.parse(req.body);
    
    // For now, just return success
    // In production, implement proper refresh token logic
    res.status(200).json({
      success: true,
      message: 'Refresh token endpoint - to be implemented',
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: error.errors,
        },
      });
    }
    return next(error);
    
  }
});

// Logout endpoint (placeholder)
router.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // In production, implement token blacklisting
    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
