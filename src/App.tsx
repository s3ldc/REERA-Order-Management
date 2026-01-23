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
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                B2B Order Management
              </h1>
              <p className="text-sm text-gray-500">
                Welcome, {user.name} ({user.role.charAt(0).toUpperCase() + user.role.slice(1)})
              </p>
            </div>
            <Button
              variant="outline"
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
  <pre className="bg-yellow-100 p-4 rounded mb-4">
    DEBUG ROLE: {JSON.stringify(user, null, 2)}
  </pre>

  {user.role === "salesperson" && <SalespersonDashboard />}
  {user.role === "distributor" && <DistributorDashboard />}
  {user.role === "admin" && <AdminDashboard />}

  {/* Fallback if role doesn't match */}
  {!["salesperson", "distributor", "admin"].includes(user.role) && (
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
