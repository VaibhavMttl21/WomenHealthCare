import axios from 'axios';

const CHATBOT_API_URL = import.meta.env.VITE_CHATBOT_API_URL || 'http://localhost:3003';

// Create axios instance for chatbot service
const chatApi = axios.create({
  baseURL: CHATBOT_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface SendMessageResponse {
  success: boolean;
  message: {
    id: string;
    sessionId: string;
    role: 'assistant' | 'user';
    content: string;
    timestamp: string;
  };
}

export interface ChatHistoryResponse {
  success: boolean;
  messages: Array<{
    id: string;
    sessionId: string;
    role: 'assistant' | 'user';
    content: string;
    timestamp: string;
  }>;
}

export interface ChatSession {
  id: string;
  userId: string;
  createdAt: string;
  messageCount: number;
}

export interface SessionsResponse {
  success: boolean;
  sessions: ChatSession[];
}

export const chatService = {
  /**
   * Send a message to the chatbot and get AI response
   */
  async sendMessage(
    sessionId: string,
    content: string,
    userId?: string
  ): Promise<SendMessageResponse> {
    try {
      const response = await chatApi.post<SendMessageResponse>(
        '/message',
        {
          sessionId,
          content,
          userId,
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error sending message:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to send message'
      );
    }
  },

  /**
   * Get chat history for a specific session
   */
  async getChatHistory(sessionId: string): Promise<ChatHistoryResponse> {
    try {
      const response = await chatApi.get<ChatHistoryResponse>(
        `/history/${sessionId}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error fetching chat history:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch chat history'
      );
    }
  },

  /**
   * Delete chat history for a specific session
   */
  async deleteChatHistory(sessionId: string): Promise<{ success: boolean }> {
    try {
      const response = await chatApi.delete<{ success: boolean; message: string }>(
        `/history/${sessionId}`
      );
      return { success: response.data.success };
    } catch (error: any) {
      console.error('Error deleting chat history:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to delete chat history'
      );
    }
  },

  /**
   * Get all chat sessions for the current user
   */
  async getChatSessions(userId: string): Promise<ChatSession[]> {
    try {
      const response = await chatApi.get<SessionsResponse>(
        '/sessions',
        {
          headers: {
            'user-id': userId,
          },
        }
      );
      return response.data.sessions;
    } catch (error: any) {
      console.error('Error fetching chat sessions:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch chat sessions'
      );
    }
  },

  /**
   * Generate a unique session ID
   */
  generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },
};

export default chatService;
