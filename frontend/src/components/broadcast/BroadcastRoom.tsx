import React, { useEffect, useRef } from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useBroadcastSocket } from '../../hooks/useBroadcastSocket';
import { MessageItem } from './MessageItem';
import { MessageInput } from './MessageInput';
import { OnlineMembers } from './OnlineMembers';
import { Radio, AlertCircle } from '../ui/Icons';
import axios from 'axios';

const CHAT_SERVICE_URL = import.meta.env.VITE_CHAT_SERVICE_URL || 'http://localhost:3002';

export const BroadcastRoom: React.FC = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, onlineUsers, typingUsers, isConnected, totalMembers } = useAppSelector(
    (state) => state.broadcast
  );
  const { user } = useAppSelector((state) => state.auth);
  const {
    connect,
    disconnect,
    sendMessage,
    editMessage,
    deleteMessage,
    startTyping,
    stopTyping,
  } = useBroadcastSocket();

  // Connect to broadcast room on mount
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleImageUpload = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(`${CHAT_SERVICE_URL}/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        return response.data.imageUrl;
      }
      return null;
    } catch (error) {
      console.error('Image upload error:', error);
      return null;
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Please log in to access the broadcast room</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
      {/* Main Chat Area */}
      <div className="lg:col-span-3 flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-maroon to-accent-skyblue p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Radio className="w-6 h-6 text-white" />
              <div>
                <h2 className="text-xl font-bold text-white">Broadcast Room</h2>
                <p className="text-sm text-white/90">Community Health Discussion</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white text-sm font-medium">Connected</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-red-400 rounded-full" />
                  <span className="text-white text-sm font-medium">Connecting...</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Radio className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No messages yet. Start the conversation!</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  isOwnMessage={message.userId === user.id}
                  onEdit={editMessage}
                  onDelete={deleteMessage}
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-500 italic px-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span>
                {typingUsers.length === 1
                  ? `${typingUsers[0].userName} is typing...`
                  : `${typingUsers.length} people are typing...`}
              </span>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200">
          <MessageInput
            onSendMessage={sendMessage}
            onTypingStart={startTyping}
            onTypingStop={stopTyping}
            onImageUpload={handleImageUpload}
            disabled={!isConnected}
          />
        </div>
      </div>

      {/* Online Members Sidebar */}
      <div className="lg:col-span-1">
        <OnlineMembers members={onlineUsers} totalCount={totalMembers} />
      </div>
    </div>
  );
};
