import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from './hooks/useAppSelector';
import { useNotifications } from './hooks/useNotifications';
import { useAuthRestore } from './hooks/useAuthRestore';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

// Lazy load pages for better performance
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage'));
const OnboardingPage = React.lazy(() => import('./pages/auth/OnboardingPage'));
const DashboardPage = React.lazy(() => import('./pages/dashboard/DashboardPage'));
const ProfilePage = React.lazy(() => import('./pages/profile/ProfilePage'));
const CompleteProfilePage = React.lazy(() => import('./pages/profile/CompleteProfilePage'));
const ChatPage = React.lazy(() => import('./pages/chat/ChatBotPage'));
const AppointmentsPage = React.lazy(() => import('./pages/appointments/AppointmentsPage'));
const MapPage = React.lazy(() => import('./pages/map/MapPage'));
const MealPlannerPage = React.lazy(() => import('./pages/meal/MealPlannerPage'));
const BroadcastPage = React.lazy(() => import('./pages/broadcast/BroadcastPage'));
const NotificationsPage = React.lazy(() => import('./pages/notifications/NotificationsPage'));
const SendNotificationsPage = React.lazy(() => import('./pages/notifications/SendNotificationsPage'));
const DebugAuthPage = React.lazy(() => import('./pages/DebugAuthPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public Route Component (redirect to dashboard if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Loading component for Suspense
const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

function App() {
  const { i18n } = useTranslation();
  
  // Restore auth state from localStorage on app load
  const { isRestoring } = useAuthRestore();
  
  // Initialize notifications when user is authenticated
  useNotifications();

  // Set the HTML lang attribute based on current language
  React.useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  // Show loading screen while restoring auth
  if (isRestoring) {
    return <PageLoader />;
  }

  return (
    <ErrorBoundary>
      <div className="App min-h-screen bg-gray-50">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />
            <Route
              path="/onboarding"
              element={
                <PublicRoute>
                  <OnboardingPage />
                </PublicRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/complete"
              element={
                <ProtectedRoute>
                  <CompleteProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <ProtectedRoute>
                  <AppointmentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/map"
              element={
                <ProtectedRoute>
                  <MapPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meal-planner"
              element={
                <ProtectedRoute>
                  <MealPlannerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/broadcast"
              element={
                <ProtectedRoute>
                  <BroadcastPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications/send"
              element={
                <ProtectedRoute> 
                  <SendNotificationsPage />
                 </ProtectedRoute>
              }
            />

            {/* Debug Route (for development only) */}
            <Route
              path="/debug-auth"
              element={
                <ProtectedRoute>
                  <DebugAuthPage />
                </ProtectedRoute>
              }
            />

            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* 404 Not Found */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}

export default App;
