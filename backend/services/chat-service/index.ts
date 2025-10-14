import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

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

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving for uploaded images
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
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

interface TypingUser {
  userId: string;
  userName: string;
}

// In-memory storage (replace with database in production)
const broadcastMessages: Map<string, BroadcastMessage> = new Map();
const onlineUsers: Map<string, OnlineUser> = new Map();
const typingUsers: Set<string> = new Set();

// Socket.IO connection handling
io.on('connection', (socket: Socket) => {
  console.log(`User connected: ${socket.id}`);

  // User joins broadcast room
  socket.on('join-broadcast', (data: { userId: string; userName: string; userAvatar?: string; role?: string }) => {
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

    // Send recent messages to the newly joined user
    const recentMessages = Array.from(broadcastMessages.values())
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .slice(-50); // Last 50 messages
    socket.emit('initial-messages', recentMessages);

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
  socket.on('send-message', (data: { userId: string; userName: string; userAvatar?: string; content: string; imageUrl?: string }) => {
    const message: BroadcastMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: data.userId,
      userName: data.userName,
      userAvatar: data.userAvatar,
      content: data.content,
      imageUrl: data.imageUrl,
      timestamp: new Date(),
    };

    broadcastMessages.set(message.id, message);

    // Broadcast message to all users in the room
    io.to('broadcast-room').emit('new-message', message);

    console.log(`Message from ${data.userName}: ${data.content}`);
  });

  // Handle message edit
  socket.on('edit-message', (data: { messageId: string; userId: string; newContent: string }) => {
    const message = broadcastMessages.get(data.messageId);

    if (message && message.userId === data.userId) {
      message.content = data.newContent;
      message.edited = true;
      message.editedAt = new Date();

      broadcastMessages.set(message.id, message);

      // Broadcast updated message to all users
      io.to('broadcast-room').emit('message-edited', message);

      console.log(`Message ${data.messageId} edited by ${data.userId}`);
    } else {
      socket.emit('error', { message: 'Cannot edit message' });
    }
  });

  // Handle message delete
  socket.on('delete-message', (data: { messageId: string; userId: string }) => {
    const message = broadcastMessages.get(data.messageId);

    if (message && message.userId === data.userId) {
      broadcastMessages.delete(data.messageId);

      // Broadcast deletion to all users
      io.to('broadcast-room').emit('message-deleted', { messageId: data.messageId });

      console.log(`Message ${data.messageId} deleted by ${data.userId}`);
    } else {
      socket.emit('error', { message: 'Cannot delete message' });
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

// Image upload endpoint
app.post('/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      imageUrl: `${req.protocol}://${req.get('host')}${imageUrl}`,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload image' });
  }
});

// Get broadcast statistics
app.get('/stats', (req, res) => {
  res.json({
    onlineUsers: Array.from(onlineUsers.values()),
    totalMessages: broadcastMessages.size,
    typingUsers: Array.from(typingUsers),
  });
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
