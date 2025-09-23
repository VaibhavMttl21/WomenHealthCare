export interface ChatSession {
  id: string;
  userId: string;
  title?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  userId: string;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
  metadata?: string;
  timestamp: string;
}

export interface ChatResponse {
  message: ChatMessage;
  suggestions?: string[];
  isTyping?: boolean;
}

export interface SendMessageRequest {
  sessionId: string;
  content: string;
  context?: {
    userProfile?: any;
    symptoms?: string[];
    urgency?: 'low' | 'medium' | 'high';
  };
}
