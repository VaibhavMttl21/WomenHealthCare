import axios, { AxiosResponse } from 'axios';
import { AuthResponse, ApiResponse } from '../types/user';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(credentials: { email: string; password: string }): Promise<AxiosResponse<AuthResponse>> {
    return api.post('/auth/login', credentials);
  },

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: 'patient' | 'doctor';
  }): Promise<AxiosResponse<AuthResponse>> {
    return api.post('/auth/register', userData);
  },

  async logout(): Promise<AxiosResponse<ApiResponse>> {
    return api.post('/auth/logout');
  },

  async refreshToken(): Promise<AxiosResponse<AuthResponse>> {
    return api.post('/auth/refresh');
  },

  async forgotPassword(email: string): Promise<AxiosResponse<ApiResponse>> {
    return api.post('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, password: string): Promise<AxiosResponse<ApiResponse>> {
    return api.post('/auth/reset-password', { token, password });
  },
};

export default api;
