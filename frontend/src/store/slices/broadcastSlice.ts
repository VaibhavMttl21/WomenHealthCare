import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BroadcastMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  imageUrl?: string;
  timestamp: string;
  edited?: boolean;
  editedAt?: string;
}

export interface OnlineUser {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  role?: string;
  joinedAt: string;
}

export interface TypingUser {
  userId: string;
  userName: string;
}

interface BroadcastState {
  messages: BroadcastMessage[];
  onlineUsers: OnlineUser[];
  typingUsers: TypingUser[];
  isConnected: boolean;
  totalMembers: number;
}

const initialState: BroadcastState = {
  messages: [],
  onlineUsers: [],
  typingUsers: [],
  isConnected: false,
  totalMembers: 0,
};

const broadcastSlice = createSlice({
  name: 'broadcast',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setInitialMessages: (state, action: PayloadAction<BroadcastMessage[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<BroadcastMessage>) => {
      state.messages.push(action.payload);
    },
    updateMessage: (state, action: PayloadAction<BroadcastMessage>) => {
      const index = state.messages.findIndex((msg) => msg.id === action.payload.id);
      if (index !== -1) {
        state.messages[index] = action.payload;
      }
    },
    deleteMessage: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter((msg) => msg.id !== action.payload);
    },
    setOnlineUsers: (state, action: PayloadAction<OnlineUser[]>) => {
      state.onlineUsers = action.payload;
      state.totalMembers = action.payload.length;
    },
    addTypingUser: (state, action: PayloadAction<TypingUser>) => {
      if (!state.typingUsers.find((user) => user.userId === action.payload.userId)) {
        state.typingUsers.push(action.payload);
      }
    },
    removeTypingUser: (state, action: PayloadAction<string>) => {
      state.typingUsers = state.typingUsers.filter((user) => user.userId !== action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const {
  setConnected,
  setInitialMessages,
  addMessage,
  updateMessage,
  deleteMessage,
  setOnlineUsers,
  addTypingUser,
  removeTypingUser,
  clearMessages,
} = broadcastSlice.actions;

export default broadcastSlice.reducer;
