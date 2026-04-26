import React from 'react';
import type { UserRole } from '../../types/roles';
import BureauLeaderDashboard from '../../pages/dashboard/BureauLeaderDashboard';
import TreatmentDirectorDashboard from '../../pages/dashboard/TreatmentDirectorDashboard';
import FundSupervisorDashboard from '../../pages/dashboard/FundSupervisorDashboard';
import MedicalServiceDashboard from '../../pages/dashboard/MedicalServiceDashboard';
import Dashboard from '../../pages/Dashboard';

interface RoleBasedDashboardProps {
  userRole: UserRole;
}

export default function RoleBasedDashboard({ userRole }: RoleBasedDashboardProps) {
  switch (userRole) {
    case 'bureau_leader':
      return <BureauLeaderDashboard />;
    case 'treatment_director':
      return <TreatmentDirectorDashboard />;
    case 'fund_supervisor':
      return <FundSupervisorDashboard />;
    case 'medical_service_director':
      return <MedicalServiceDashboard />;
    default:
      return <Dashboard />;
  }
}
