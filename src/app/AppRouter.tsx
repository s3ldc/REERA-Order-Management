import React from "react";
import { useAuth } from "../context/AuthContext";
import SalespersonDashboard from "../components/Dashboard/SalespersonDashboard";
import DistributorDashboard from "../features/distributor-dashboard/DistributorDashboard";
import AdminDashboard from "../features/admin-dashboard/AdminDashboard";

const AppRouter: React.FC = () => {
  const { user } = useAuth();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {user?.role === "Salesperson" && <SalespersonDashboard />}
      {user?.role === "Distributor" && <DistributorDashboard />}
      {user?.role === "Admin" && <AdminDashboard />}
    </main>
  );
};

export default AppRouter;