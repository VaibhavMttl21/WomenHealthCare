import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import uiReducer from './slices/uiSlice';
import notificationReducer from './slices/notificationSlice';
import broadcastReducer from './slices/broadcastSlice';
import appointmentReducer from './slices/appointmentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    ui: uiReducer,
    notification: notificationReducer,
    broadcast: broadcastReducer,
    appointments: appointmentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Enable listener behavior for RTK Query
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
