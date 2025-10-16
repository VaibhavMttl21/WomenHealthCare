import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import {
  setConnected,
  setInitialMessages,
  addMessage,
  updateMessage,
  deleteMessage,
  setOnlineUsers,
  addTypingUser,
  removeTypingUser,
  BroadcastMessage,
  OnlineUser,
} from '../store/slices/broadcastSlice';
import toast from 'react-hot-toast';

const SOCKET_URL = import.meta.env.VITE_CHAT_SERVICE_URL || 'http://localhost:3002';

export const useBroadcastSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (!user) return;

    if (socketRef.current?.connected) {
      console.log('Socket already connected');
      return;
    }

    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Connected to broadcast room');
      dispatch(setConnected(true));
      
      // Join broadcast room
      socket.emit('join-broadcast', {
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        role: user.role,
      });
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from broadcast room');
      dispatch(setConnected(false));
    });

    socket.on('initial-messages', (messages: BroadcastMessage[]) => {
      dispatch(setInitialMessages(messages));
    });

    socket.on('new-message', (message: BroadcastMessage) => {
      dispatch(addMessage(message));
    });

    socket.on('message-edited', (message: BroadcastMessage) => {
      dispatch(updateMessage(message));
    });

    socket.on('message-deleted', (data: { messageId: string }) => {
      dispatch(deleteMessage(data.messageId));
    });

    socket.on('online-users', (users: OnlineUser[]) => {
      dispatch(setOnlineUsers(users));
    });

    socket.on('user-joined', (data: { userName: string; timestamp: string }) => {
      toast.success(`${data.userName} joined the broadcast`, {
        duration: 2000,
        position: 'top-right',
      });
    });

    socket.on('user-left', (data: { userName: string; timestamp: string }) => {
      toast(`${data.userName} left the broadcast`, {
        duration: 2000,
        position: 'top-right',
        icon: '👋',
      });
    });

    socket.on('user-typing', (data: { userId: string; userName: string }) => {
      dispatch(addTypingUser(data));
    });

    socket.on('user-stopped-typing', (data: { userId: string }) => {
      dispatch(removeTypingUser(data.userId));
    });

    socket.on('error', (error: { message: string }) => {
      toast.error(error.message);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      toast.error('Failed to connect to broadcast room');
    });
  }, [user, dispatch]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      dispatch(setConnected(false));
    }
  }, [dispatch]);

  const sendMessage = useCallback((content: string, imageUrl?: string) => {
    if (!socketRef.current || !user) return;

    socketRef.current.emit('send-message', {
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      content,
      imageUrl,
    });
  }, [user]);

  const editMessage = useCallback((messageId: string, newContent: string) => {
    if (!socketRef.current || !user) return;

    socketRef.current.emit('edit-message', {
      messageId,
      userId: user.id,
      newContent,
    });
  }, [user]);

  const deleteMessageById = useCallback((messageId: string) => {
    if (!socketRef.current || !user) return;

    socketRef.current.emit('delete-message', {
      messageId,
      userId: user.id,
    });
  }, [user]);

  const startTyping = useCallback(() => {
    if (!socketRef.current || !user) return;

    socketRef.current.emit('typing-start', {
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
    });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Auto-stop typing after 3 seconds
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  }, [user]);

  const stopTyping = useCallback(() => {
    if (!socketRef.current || !user) return;

    socketRef.current.emit('typing-stop', {
      userId: user.id,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [user]);

  useEffect(() => {
    return () => {
      disconnect();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [disconnect]);

  return {
    connect,
    disconnect,
    sendMessage,
    editMessage,
    deleteMessage: deleteMessageById,
    startTyping,
    stopTyping,
  };
};
