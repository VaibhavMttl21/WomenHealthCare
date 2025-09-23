import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Language = 'en' | 'hi' | 'ta';
type Theme = 'light' | 'dark' | 'system';

interface UIState {
  language: Language;
  theme: Theme;
  sidebarOpen: boolean;
  isHighContrast: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  notifications: Notification[];
  isOnline: boolean;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  createdAt: number;
}

const initialState: UIState = {
  language: (localStorage.getItem('language') as Language) || 'en',
  theme: (localStorage.getItem('theme') as Theme) || 'system',
  sidebarOpen: false,
  isHighContrast: localStorage.getItem('highContrast') === 'true',
  fontSize: (localStorage.getItem('fontSize') as UIState['fontSize']) || 'normal',
  notifications: [],
  isOnline: navigator.onLine,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
      localStorage.setItem('language', action.payload);
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleHighContrast: (state) => {
      state.isHighContrast = !state.isHighContrast;
      localStorage.setItem('highContrast', state.isHighContrast.toString());
    },
    setFontSize: (state, action: PayloadAction<UIState['fontSize']>) => {
      state.fontSize = action.payload;
      localStorage.setItem('fontSize', action.payload);
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'createdAt'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: Date.now(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
  },
});

export const {
  setLanguage,
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  toggleHighContrast,
  setFontSize,
  addNotification,
  removeNotification,
  clearNotifications,
  setOnlineStatus,
} = uiSlice.actions;

export default uiSlice.reducer;
