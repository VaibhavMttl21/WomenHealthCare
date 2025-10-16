import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { bucket } from './src/config/firebase.config';
import { PrismaClient } from '@prisma/client';
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  maxHttpBufferSize: 10e6, // 10MB for file uploads
});
const prisma = new PrismaClient();

// Debug: Check if broadcastMessage exists
console.log('Prisma models available:', Object.keys(prisma).filter(key => !key.startsWith('_') && !key.startsWith('$')));
console.log('Has broadcastMessage?', 'broadcastMessage' in prisma);

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: "*",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Types
interface BroadcastMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  imageUrl?: string;
  timestamp: Date;
  edited?: boolean;
  editedAt?: Date;
}

interface OnlineUser {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  role?: string;
  joinedAt: Date;
}


// In-memory storage (replace with database in production)
const broadcastMessages: Map<string, BroadcastMessage> = new Map();
const onlineUsers: Map<string, OnlineUser> = new Map();
const typingUsers: Set<string> = new Set();

// Socket.IO connection handling
io.on('connection', (socket: Socket) => {
  console.log(`User connected: ${socket.id}`);

  // User joins broadcast room
  socket.on('join-broadcast', async (data: { userId: string; userName: string; userAvatar?: string; role?: string }) => {
    const { userId, userName, userAvatar, role } = data;

    // Add user to online users
    const onlineUser: OnlineUser = {
      id: socket.id,
      userId,
      userName,
      userAvatar,
      role,
      joinedAt: new Date(),
    };
    onlineUsers.set(socket.id, onlineUser);

    // Join broadcast room
    socket.join('broadcast-room');

    try {
      // Fetch recent messages from database
      const recentMessages = await prisma.broadcastMessage.findMany({
        orderBy: { timestamp: 'asc' },
        take: 50,
      });
      
      socket.emit('initial-messages', recentMessages);
    } catch (error) {
      console.error('Error fetching messages from database:', error);
      // Fallback to in-memory storage
      const recentMessages = Array.from(broadcastMessages.values())
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .slice(-50);
      socket.emit('initial-messages', recentMessages);
    }

    // Broadcast online users list to all users
    io.to('broadcast-room').emit('online-users', Array.from(onlineUsers.values()));

    // Notify others that a new user joined
    socket.to('broadcast-room').emit('user-joined', {
      userName,
      timestamp: new Date(),
    });

    console.log(`${userName} joined broadcast room`);
  });

  // Handle new message
  socket.on('send-message', async (data: { userId: string; userName: string; userAvatar?: string; content: string; imageUrl?: string }) => {
    try {
      // Save message to database
      const message = await prisma.broadcastMessage.create({
        data: {
          userId: data.userId,
          userName: data.userName,
          userAvatar: data.userAvatar,
          content: data.content,
          imageUrl: data.imageUrl || undefined,
        },
      });

      // Also keep in memory for quick access
      broadcastMessages.set(message.id, {
        id: message.id,
        userId: message.userId,
        userName: message.userName,
        userAvatar: message.userAvatar || undefined,
        content: message.content,
        imageUrl: message.imageUrl || undefined,
        timestamp: message.timestamp,
        edited: message.edited,
        editedAt: message.editedAt || undefined,
      });

      // Broadcast message to all users in the room
      io.to('broadcast-room').emit('new-message', message);

      console.log(`Message from ${data.userName}: ${data.content}`);
    } catch (error) {
      console.error('Error saving message to database:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle message edit
  socket.on('edit-message', async (data: { messageId: string; userId: string; newContent: string }) => {
    try {
      // Check if message exists and belongs to user
      const existingMessage = await prisma.broadcastMessage.findUnique({
        where: { id: data.messageId },
      });

      if (existingMessage && existingMessage.userId === data.userId) {
        // Update message in database
        const updatedMessage = await prisma.broadcastMessage.update({
          where: { id: data.messageId },
          data: {
            content: data.newContent,
            edited: true,
            editedAt: new Date(),
          },
        });

        // Update in-memory storage
        const message = broadcastMessages.get(data.messageId);
        if (message) {
          message.content = data.newContent;
          message.edited = true;
          message.editedAt = new Date();
          broadcastMessages.set(message.id, message);
        }

        // Broadcast updated message to all users
        io.to('broadcast-room').emit('message-edited', updatedMessage);

        console.log(`Message ${data.messageId} edited by ${data.userId}`);
      } else {
        socket.emit('error', { message: 'Cannot edit message' });
      }
    } catch (error) {
      console.error('Error editing message:', error);
      socket.emit('error', { message: 'Failed to edit message' });
    }
  });

  // Handle message delete
  socket.on('delete-message', async (data: { messageId: string; userId: string }) => {
    try {
      // Check if message exists and belongs to user
      const existingMessage = await prisma.broadcastMessage.findUnique({
        where: { id: data.messageId },
      });

      if (existingMessage && existingMessage.userId === data.userId) {
        // Delete message from database
        await prisma.broadcastMessage.delete({
          where: { id: data.messageId },
        });

        // Delete from in-memory storage
        broadcastMessages.delete(data.messageId);

        // Broadcast deletion to all users
        io.to('broadcast-room').emit('message-deleted', { messageId: data.messageId });

        console.log(`Message ${data.messageId} deleted by ${data.userId}`);
      } else {
        socket.emit('error', { message: 'Cannot delete message' });
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      socket.emit('error', { message: 'Failed to delete message' });
    }
  });

  // Handle typing indicator
  socket.on('typing-start', (data: { userId: string; userName: string }) => {
    typingUsers.add(data.userId);
    socket.to('broadcast-room').emit('user-typing', { userId: data.userId, userName: data.userName });
  });

  socket.on('typing-stop', (data: { userId: string }) => {
    typingUsers.delete(data.userId);
    socket.to('broadcast-room').emit('user-stopped-typing', { userId: data.userId });
  });

  // Handle reaction to message (optional feature)
  socket.on('add-reaction', (data: { messageId: string; userId: string; emoji: string }) => {
    io.to('broadcast-room').emit('message-reaction', data);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      onlineUsers.delete(socket.id);
      typingUsers.delete(user.userId);

      // Broadcast updated online users list
      io.to('broadcast-room').emit('online-users', Array.from(onlineUsers.values()));

      // Notify others that user left
      io.to('broadcast-room').emit('user-left', {
        userName: user.userName,
        timestamp: new Date(),
      });

      console.log(`${user.userName} left broadcast room`);
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

// REST API Endpoints
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    onlineUsers: onlineUsers.size,
    totalMessages: broadcastMessages.size,
  });
});

// Image upload endpoint with Firebase Storage
app.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Create unique filename
    const timestamp = Date.now();
    const uniqueSuffix = Math.round(Math.random() * 1E9);
    const filename = `chatimages/${timestamp}-${uniqueSuffix}${path.extname(req.file.originalname)}`;

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

// Get broadcast statistics
app.get('/stats', async (req, res) => {
  try {
    const totalMessagesInDb = await prisma.broadcastMessage.count();
    res.json({
      onlineUsers: Array.from(onlineUsers.values()),
      totalMessages: totalMessagesInDb,
      typingUsers: Array.from(typingUsers),
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.json({
      onlineUsers: Array.from(onlineUsers.values()),
      totalMessages: broadcastMessages.size,
      typingUsers: Array.from(typingUsers),
    });
  }
});

// Get message history with pagination
app.get('/messages', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const messages = await prisma.broadcastMessage.findMany({
      orderBy: { timestamp: 'desc' },
      take: limit,
      skip: skip,
    });

    const totalCount = await prisma.broadcastMessage.count();

    res.json({
      success: true,
      data: messages.reverse(), // Reverse to show oldest first
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
    });
  }
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || 3005;

httpServer.listen(PORT, () => {
  console.log(`🚀 Chat Service running on port ${PORT}`);
  console.log(`📡 Socket.IO server ready for connections`);
});

export default app;
