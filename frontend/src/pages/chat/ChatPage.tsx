import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MessageCircle, Send, Heart, Plus, Trash2 } from '../../components/ui/Icons';
import { chatService, ChatSession } from '../../services/chatService';
import { useAppSelector } from '../../hooks/useAppSelector';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatPage: React.FC = () => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = useAppSelector((state) => state.auth.user);

  // Debug: Log user info
  useEffect(() => {
    console.log('Current user:', user);
    console.log('User ID:', user?.id);
  }, [user]);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize new session on component mount
  useEffect(() => {
    initializeNewSession();
    loadChatSessions();
  }, []);

  const initializeNewSession = () => {
    const sessionId = chatService.generateSessionId();
    setCurrentSessionId(sessionId);
    setMessages([
      {
        id: '1',
        sender: 'assistant',
        content: 'Hello! I\'m your health assistant. How can I help you today?',
        timestamp: new Date(),
      },
    ]);
  };

  const loadChatSessions = async () => {
    if (!user?.id) return;
    
    try {
      const fetchedSessions = await chatService.getChatSessions(user.id);
      setSessions(fetchedSessions);
    } catch (err: any) {
      console.error('Failed to load sessions:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    // Check if user is logged in
    if (!user || !user.id) {
      setError('Please log in to send messages');
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: message.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    setError(null);

    try {
      console.log('Sending message with userId:', user.id);
      const response = await chatService.sendMessage(
        currentSessionId,
        userMessage.content,
        user.id
      );

      const aiMessage: Message = {
        id: response.message.id,
        sender: 'assistant',
        content: response.message.content,
        timestamp: new Date(response.message.timestamp),
      };

      setMessages((prev) => [...prev, aiMessage]);
      loadChatSessions(); // Refresh sessions list
    } catch (err: any) {
      setError(err.message || 'Failed to get response. Please try again.');
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    initializeNewSession();
    setError(null);
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await chatService.deleteChatHistory(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (sessionId === currentSessionId) {
        initializeNewSession();
      }
    } catch (err: any) {
      console.error('Failed to delete session:', err);
    }
  };

  const handleLoadSession = async (sessionId: string) => {
    setIsLoadingHistory(true);
    try {
      const response = await chatService.getChatHistory(sessionId);
      const loadedMessages: Message[] = response.messages.map((msg) => ({
        id: msg.id,
        sender: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
        timestamp: new Date(msg.timestamp),
      }));
      setMessages(loadedMessages);
      setCurrentSessionId(sessionId);
      setError(null);
    } catch (err: any) {
      setError('Failed to load chat history');
      console.error('Error loading session:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const suggestedQuestions = [
    'What should I eat during pregnancy?',
    'How often should I visit the doctor?',
    'What are normal pregnancy symptoms?',
    'How to manage pregnancy discomfort?',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50">
      <div className="w-full h-full">
        <div className="flex items-center px-4 py-4 lg:px-6 lg:py-6">
          <Heart className="h-8 w-8 text-pink-500 mr-3" />
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">{t('chat.healthAssistant')}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 px-4 lg:px-6 pb-4 lg:pb-6">
          {/* Chat History Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t('chat.chatHistory')}</span>
                <Button size="sm" variant="ghost" onClick={handleNewChat}>
                  <Plus className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {sessions.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No chat history</p>
                ) : (
                  sessions.map((session) => (
                    <div
                      key={session.id}
                      className={`p-3 rounded-lg cursor-pointer group relative ${
                        session.id === currentSessionId
                          ? 'bg-blue-50'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleLoadSession(session.id)}
                    >
                      <div className="font-medium text-sm pr-6">
                        Chat Session
                      </div>
                      <div className="text-xs text-gray-600">
                        {new Date(session.createdAt).toLocaleDateString()} • {session.messageCount} messages
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSession(session.id);
                        }}
                        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Main Chat Area */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-500" />
                AI Health Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Messages Area */}
              <div className="h-96 overflow-y-auto p-6 space-y-4">
                {isLoadingHistory ? (
                  <div className="flex justify-center items-center h-full">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            msg.sender === 'user'
                              ? 'bg-pink-500 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.sender === 'user' ? 'text-pink-100' : 'text-gray-500'
                            }`}
                          >
                            {msg.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 px-4 py-2 rounded-lg">
                          <LoadingSpinner />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="px-6 py-2 bg-red-50 border-t border-red-200">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Suggested Questions */}
              <div className="px-6 py-4 border-t">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {t('chat.suggestedQuestions')}:
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setMessage(question)}
                      className="text-xs"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="p-6 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                    placeholder={t('chat.typeMessage')}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isLoading}
                    className="bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <LoadingSpinner />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
