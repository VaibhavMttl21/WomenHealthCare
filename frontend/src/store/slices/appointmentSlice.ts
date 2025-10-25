import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import appointmentService from '../../services/appointmentService';
import {
  Appointment,
  Doctor,
  DoctorAvailability,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  AppointmentFilter,
  DoctorStatistics,
} from '../../types/appointment';

interface AppointmentState {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  doctors: Doctor[];
  availability: DoctorAvailability | null;
  statistics: DoctorStatistics | null;
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: AppointmentState = {
  appointments: [],
  selectedAppointment: null,
  doctors: [],
  availability: null,
  statistics: null,
  loading: false,
  error: null,
  success: null,
};

// Async thunks
export const fetchDoctors = createAsyncThunk(
  'appointments/fetchDoctors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getAvailableDoctors();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch doctors');
    }
  }
);

export const fetchDoctorAvailability = createAsyncThunk(
  'appointments/fetchDoctorAvailability',
  async ({ doctorId, date }: { doctorId: string; date: string }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getDoctorAvailability(doctorId, date);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch availability');
    }
  }
);

export const createAppointment = createAsyncThunk(
  'appointments/create',
  async (data: CreateAppointmentRequest, { rejectWithValue }) => {
    try {
      const response = await appointmentService.createAppointment(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create appointment');
    }
  }
);

export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAll',
  async (filter: AppointmentFilter | undefined, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getAppointments(filter);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointments');
    }
  }
);

export const fetchAppointmentById = createAsyncThunk(
  'appointments/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getAppointmentById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointment');
    }
  }
);

export const updateAppointment = createAsyncThunk(
  'appointments/update',
  async ({ id, data }: { id: string; data: UpdateAppointmentRequest }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.updateAppointment(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update appointment');
    }
  }
);

export const cancelAppointment = createAsyncThunk(
  'appointments/cancel',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await appointmentService.cancelAppointment(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel appointment');
    }
  }
);

export const fetchDoctorStatistics = createAsyncThunk(
  'appointments/fetchStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getDoctorStatistics();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch statistics');
    }
  }
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    clearSelectedAppointment: (state) => {
      state.selectedAppointment = null;
    },
    clearAvailability: (state) => {
      state.availability = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch doctors
    builder.addCase(fetchDoctors.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDoctors.fulfilled, (state, action) => {
      state.loading = false;
      state.doctors = action.payload;
    });
    builder.addCase(fetchDoctors.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch doctor availability
    builder.addCase(fetchDoctorAvailability.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDoctorAvailability.fulfilled, (state, action) => {
      state.loading = false;
      state.availability = action.payload;
    });
    builder.addCase(fetchDoctorAvailability.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create appointment
    builder.addCase(createAppointment.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(createAppointment.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
      state.appointments.push(action.payload.data);
    });
    builder.addCase(createAppointment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch appointments
    builder.addCase(fetchAppointments.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAppointments.fulfilled, (state, action) => {
      state.loading = false;
      state.appointments = action.payload;
    });
    builder.addCase(fetchAppointments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch appointment by ID
    builder.addCase(fetchAppointmentById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAppointmentById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedAppointment = action.payload;
    });
    builder.addCase(fetchAppointmentById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update appointment
    builder.addCase(updateAppointment.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(updateAppointment.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
      const index = state.appointments.findIndex((apt) => apt.id === action.payload.data.id);
      if (index !== -1) {
        state.appointments[index] = action.payload.data;
      }
      if (state.selectedAppointment?.id === action.payload.data.id) {
        state.selectedAppointment = action.payload.data;
      }
    });
    builder.addCase(updateAppointment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Cancel appointment
    builder.addCase(cancelAppointment.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(cancelAppointment.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
      const index = state.appointments.findIndex((apt) => apt.id === action.payload.data.id);
      if (index !== -1) {
        state.appointments[index] = action.payload.data;
      }
      if (state.selectedAppointment?.id === action.payload.data.id) {
        state.selectedAppointment = action.payload.data;
      }
    });
    builder.addCase(cancelAppointment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch doctor statistics
    builder.addCase(fetchDoctorStatistics.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDoctorStatistics.fulfilled, (state, action) => {
      state.loading = false;
      state.statistics = action.payload;
    });
    builder.addCase(fetchDoctorStatistics.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError, clearSuccess, clearSelectedAppointment, clearAvailability } =
  appointmentSlice.actions;

export default appointmentSlice.reducer;
