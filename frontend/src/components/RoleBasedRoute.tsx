import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppSelector';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: ('patient' | 'doctor' | 'admin')[];
  redirectTo?: string;
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo,
}) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !allowedRoles.includes(user.role as any)) {
    // If redirect path is specified, use it; otherwise redirect based on role
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    
    // Default redirects based on user role
    if (user?.role === 'doctor') {
      return <Navigate to="/doctor/appointments" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
