import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import { User } from '../../types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Helper function to get user data from localStorage or JWT
const getUserFromStorage = (): User | null => {
  try {
    // First try to get from localStorage (more reliable)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    
    // Fallback: Try to decode from JWT token
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const payload = JSON.parse(jsonPayload);
    
    // Check if token is expired
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
    
    // Return user data from token payload
    return payload.user || payload;
  } catch (error) {
    console.error('Error loading user from storage:', error);
    return null;
  }
};

const initialState: AuthState = {
  user: getUserFromStorage(),
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

// Helper function to normalize user role from backend (DOCTOR/PATIENT) to frontend (doctor/patient)
const normalizeUserRole = (user: any): User => {
  return {
    ...user,
    role: user.role?.toLowerCase() as 'patient' | 'doctor',
  };
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      const { token, user } = response.data.data;
      
      // Normalize user role from backend format (DOCTOR) to frontend format (doctor)
      const normalizedUser = normalizeUserRole(user);
      
      // Persist both token and normalized user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      
      return { token, user: normalizedUser };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: 'patient' | 'doctor';
    profile?: any;
  }, { rejectWithValue }) => {
    try {
      // Convert role to uppercase for backend
      const backendData = {
        ...userData,
        role: userData.role.toUpperCase() as 'PATIENT' | 'DOCTOR',
      };
      
      // Use complete registration endpoint if profile data is provided
      const response = userData.profile 
        ? await authService.registerComplete(backendData as any)
        : await authService.register(backendData as any);
      
      const { token, user } = response.data.data;
      
      // Normalize user role from backend format (DOCTOR) to frontend format (doctor)
      const normalizedUser = normalizeUserRole(user);
      
      // Persist both token and normalized user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
        
      return { token, user: normalizedUser };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Registration failed. Please try again.');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { getState }) => {
    try {
      const state = getState() as any;
      const userId = state.auth.user?.id;
      
      console.log('🔄 [Logout] Starting logout process for user:', userId);
      
      // Unregister notification tokens before logout
      if (userId) {
        try {
          // Import dynamically to avoid circular dependencies
          const { default: notificationService } = await import('../../services/notificationService');
          console.log('🔄 [Logout] Calling unregisterUserDeviceTokens...');
          const success = await notificationService.unregisterUserDeviceTokens(userId);
          if (success) {
            console.log('✅ [Logout] Device tokens unregistered successfully');
          } else {
            console.warn('⚠️ [Logout] Device token unregistration returned false');
          }
        } catch (notifError) {
          console.error('❌ [Logout] Failed to unregister device tokens:', notifError);
          // Continue with logout even if this fails
        }
      } else {
        console.warn('⚠️ [Logout] No userId found, skipping token unregistration');
      }
      
      console.log('🔄 [Logout] Calling backend logout API...');
      await authService.logout();
      console.log('🔄 [Logout] Clearing local storage...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('✅ [Logout] Logout complete');
      return null;
    } catch (error: any) {
      console.error('❌ [Logout] Error during logout:', error);
      // Even if logout API fails, we should clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('✅ [Logout] Forced logout complete (after error)');
      return null;
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      // Normalize user role in case it comes from localStorage with uppercase
      const normalizedUser = normalizeUserRole(action.payload.user);
      state.user = normalizedUser;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        // Also store user in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        // Also store user in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
        localStorage.removeItem('user');
      });
  },
});

export const { clearError, setCredentials, clearCredentials } = authSlice.actions;
export { logoutUser as logout };
export default authSlice.reducer;
