import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '../../types/user';

interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isEditing: boolean;
}

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  error: null,
  isEditing: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
      state.error = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
      state.isLoading = false;
      state.isEditing = false;
    },
  },
});

export const {
  setProfile,
  updateProfile,
  setLoading,
  setError,
  setEditing,
  clearProfile,
} = profileSlice.actions;

export default profileSlice.reducer;
