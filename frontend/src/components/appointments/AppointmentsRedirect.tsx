import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';

export const AppointmentsRedirect: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  // Redirect doctors to their dashboard, patients to appointments list
  if (user?.role === 'doctor') {
    return <Navigate to="/doctor/appointments" replace />;
  }

  return <Navigate to="/appointments" replace />;
};

export default AppointmentsRedirect;
