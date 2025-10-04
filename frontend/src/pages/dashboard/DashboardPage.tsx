import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import WomenDashboard from './WomenDashboard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// Import other role-specific dashboards here when created
// import FamilyDashboard from './FamilyDashboard';
// import DoctorDashboard from './DoctorDashboard';
// import AshaDashboard from './AshaDashboard';

const DashboardPage: React.FC = () => {
  const { user, isLoading } = useSelector((state: RootState) => state.auth);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Route to appropriate dashboard based on user role
  const userRole = user?.role || 'patient';

  // For now, we're using WomenDashboard as default
  // Add role-based routing when other dashboards are created
  // switch(userRole) {
  //   case 'family':
  //     return <FamilyDashboard />;
  //   case 'doctor':
  //     return <DoctorDashboard />;
  //   case 'asha':
  //     return <AshaDashboard />;
  //   default:
  //     return <WomenDashboard />;
  // }

  return <WomenDashboard />;
};

export default DashboardPage;
