import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { OrderProvider } from "./context/OrderContext";
import { ToastProvider } from "./hooks/useToast";
import Login from "./components/Login";
import Signup from "./components/Signup";
import SalespersonDashboard from "./components/Dashboard/SalespersonDashboard";
import DistributorDashboard from "./components/Dashboard/DistributorDashboard";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import { Button } from "./components/ui/button";
import { LogOut } from "lucide-react";

const AppContent: React.FC = () => {
  const { user, logout } = useAuth();
  const [showSignup, setShowSignup] = useState(false);

  // Not logged in → show Login or Signup
  if (!user) {
    return showSignup ? (
      <Signup onBackToLogin={() => setShowSignup(false)} />
    ) : (
      <Login onShowSignup={() => setShowSignup(true)} />
    );
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: App name + role badge */}
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-gray-900">
              B2B Order Management
            </h1>

            <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
              {user.role}
            </span>
          </div>

          {/* Right: User info + logout */}
          <div className="flex items-center gap-4">
            <div className="text-right leading-tight hidden sm:block">
              <p className="text-sm font-medium text-gray-800">
                {user.name || user.email}
              </p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* <pre className="bg-yellow-100 p-4 rounded mb-4">
          DEBUG ROLE: {JSON.stringify(user, null, 2)}
        </pre> */}

        {user.role === "Salesperson" && <SalespersonDashboard />}
        {user.role === "Distributor" && <DistributorDashboard />}
        {user.role === "Admin" && <AdminDashboard />}

        {/* Fallback if role doesn't match */}
        {!["Salesperson", "Distributor", "Admin"].includes(user.role) && (
          <div className="text-red-600 font-bold">
            Unknown role: {String(user.role)}
          </div>
        )}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <OrderProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </OrderProvider>
    </AuthProvider>
  );
};

export default App;
