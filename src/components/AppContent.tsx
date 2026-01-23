import React from 'react';
import { useAuth } from '../context/AuthContext';
import Login from './Login';
import SalespersonDashboard from './Dashboard/SalespersonDashboard';
import DistributorDashboard from './Dashboard/DistributorDashboard';
import AdminDashboard from './Dashboard/AdminDashboard';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  switch (user.role) {
    case 'salesperson':
      return <SalespersonDashboard />;
    case 'distributor':
      return <DistributorDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <Login />;
  }
};

export default AppContent;