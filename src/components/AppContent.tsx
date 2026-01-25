import React from "react";
import { useAuth } from "../context/AuthContext";
import Login from "./Login";
import SalespersonDashboard from "./Dashboard/SalespersonDashboard";
import DistributorDashboard from "./Dashboard/DistributorDashboard";
import AdminDashboard from "./Dashboard/AdminDashboard";

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  // 🔴 CRITICAL: Wait until session restore finishes
  if (loading) {
    return null; // or a spinner later
  }

  if (!user) {
    return <Login />;
  }

  switch (user.role) {
    case "Salesperson":
      return <SalespersonDashboard />;
    case "Distributor":
      return <DistributorDashboard />;
    case "Admin":
      return <AdminDashboard />;
    default:
      return <Login />;
  }
};

export default AppContent;
