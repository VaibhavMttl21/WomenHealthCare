import express, { Request, Response, NextFunction } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient, MessageRole } from '@prisma/client';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import multer from 'multer';
import { bucket } from './src/config/firebase.config';

// Debug BEFORE loading dotenv
console.log('🔍 CHATBOT DEBUG BEFORE DOTENV: process.env.PORT =', process.env.PORT);

// Load .env from the service directory with override
dotenv.config({ 
  path: path.resolve(__dirname, '.env'),
  override: true 
});

// Debug AFTER loading dotenv
console.log('🔍 CHATBOT DEBUG AFTER DOTENV: process.env.PORT =', process.env.PORT);
console.log('🔍 CHATBOT DEBUG: __dirname =', __dirname);
console.log('🔍 CHATBOT DEBUG: .env path =', path.resolve(__dirname, '.env'));

// Initialize Prisma Client
const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3003;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Middleware
app.use(helmet());
app.use(cors({
  origin: "*",
  credentials: true,
}));

app.use(compression());
app.use(express.json());

// Multer configuration for Firebase Storage
const upload = multer({
  storage: multer.memoryStorage(), // Store in memory for Firebase upload
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
  },
});

// System instruction for health context
const SYSTEM_INSTRUCTION = `You are a compassionate and knowledgeable women's health assistant for a rural healthcare platform. 
Your role is to provide helpful, accurate, and culturally sensitive information about:
- Pregnancy and maternal health
- Menstrual health
- General women's wellness
- Nutrition and diet during pregnancy
- Common health concerns

Important guidelines:
1. Always be supportive and non-judgmental
2. Provide clear, simple explanations
3. Encourage users to seek professional medical help for serious concerns
4. Respect cultural sensitivities
5. Never provide diagnoses or prescriptions
6. Keep responses concise and easy to understand (3-5 sentences max unless more detail is requested)
7. Use simple language suitable for rural communities

Format your responses in clean, readable text without excessive formatting.`;

// Helper function to clean and format AI response
function cleanAIResponse(text: string): string {
  // Remove markdown bold/italic markers
  let cleaned = text.replace(/\*\*/g, '').replace(/\*/g, '');
  
  // Remove excessive newlines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  // Trim whitespace
  cleaned = cleaned.trim();
  
  return cleaned;
}

// Helper function to generate response with Gemini
async function generateChatResponse(
  message: string,
  sessionId: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 500,
      },
    });

    // Build conversation history from database
    const dbMessages = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { timestamp: 'asc' },
      take: 20, // Limit to last 20 messages for context
    });

    const conversationHistory = dbMessages.map((msg) => ({
      role: msg.role === MessageRole.USER ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // Start chat with history
    const chat = model.startChat({
      history: conversationHistory,
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    // Add system instruction as context
    const contextualMessage = `${SYSTEM_INSTRUCTION}\n\nUser question: ${message}`;
    
    const result = await chat.sendMessage(contextualMessage);
    const response = await result.response;
    const responseText = response.text();

    // Clean the response
    const cleanedResponse = cleanAIResponse(responseText);

    return cleanedResponse;
  } catch (error: any) {
    console.error('Error generating response:', error);
    throw new Error('Failed to generate response. Please try again.');
  }
}

// Routes

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'chatbot-service' });
});

// Send message and get AI response
app.post('/message', async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Request body:', req.body);
    const { sessionId, content, userId } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required',
      });
    }

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required',
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    // Initialize session if it doesn't exist in database
    let session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      session = await prisma.chatSession.create({
        data: {
          id: sessionId,
          userId: userId,
          title: 'Health Consultation',
          isActive: true,
        },
      });
    }

    // Store user message in database
    const userMessage = await prisma.chatMessage.create({
      data: {
        sessionId: sessionId,
        userId: userId,
        role: MessageRole.USER,
        content: content.trim(),
      },
    });

    // Generate AI response
    const aiResponseText = await generateChatResponse(content, sessionId);

    // Store AI response in database
    const aiMessage = await prisma.chatMessage.create({
      data: {
        sessionId: sessionId,
        userId: userId,
        role: MessageRole.ASSISTANT,
        content: aiResponseText,
      },
    });

    // Return response
    res.json({
      success: true,
      message: {
        id: aiMessage.id,
        sessionId,
        role: 'assistant',
        content: aiResponseText,
        timestamp: aiMessage.timestamp.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Error in /message endpoint:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process message',
    });
  }
});

// Get chat history for a session
app.get('/history/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    // Get messages from database
    const dbMessages = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { timestamp: 'asc' },
    });

    const messages = dbMessages.map((msg) => ({
      id: msg.id,
      sessionId: msg.sessionId,
      role: msg.role === MessageRole.USER ? 'user' : 'assistant',
      content: msg.content,
      timestamp: msg.timestamp.toISOString(),
    }));

    res.json({
      success: true,
      messages,
    });
  } catch (error: any) {
    console.error('Error in /history endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve history',
    });
  }
});

// Delete chat history for a session
app.delete('/history/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    // Delete all messages for this session (cascade delete)
    await prisma.chatMessage.deleteMany({
      where: { sessionId },
    });

    // Delete the session itself
    await prisma.chatSession.delete({
      where: { id: sessionId },
    });

    res.json({
      success: true,
      message: 'Chat history deleted successfully',
    });
  } catch (error: any) {
    console.error('Error in /history DELETE endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete history',
    });
  }
});

// Get all sessions for a user
app.get('/sessions', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['user-id'] as string;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    // Get all sessions for this user with message count
    const dbSessions = await prisma.chatSession.findMany({
      where: { 
        userId,
        isActive: true,
      },
      include: {
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const sessions = dbSessions.map((session) => ({
      id: session.id,
      userId: session.userId,
      title: session.title,
      createdAt: session.createdAt.toISOString(),
      messageCount: session._count.messages,
    }));

    res.json({
      success: true,
      sessions,
    });
  } catch (error: any) {
    console.error('Error in /sessions endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve sessions',
    });
  }
});

// Image upload endpoint with Firebase Storage
app.post('/upload-image', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Create unique filename
    const timestamp = Date.now();
    const uniqueSuffix = Math.round(Math.random() * 1E9);
    const filename = `chatbotimages/${timestamp}-${uniqueSuffix}${path.extname(req.file.originalname)}`;

    // Create file in Firebase Storage
    const file = bucket.file(filename);
    
    // Upload file buffer to Firebase Storage
    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype,
      },
      public: true, // Make file publicly accessible
    });

    // Get public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

    res.json({
      success: true,
      imageUrl: publicUrl,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload image' });
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, async () => {
  console.log(`🤖 Chatbot service running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  
  // Test database connection
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
  
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  WARNING: GEMINI_API_KEY not set. Please add it to your .env file');
  }
});

export default app;
