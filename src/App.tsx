import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./hooks/useToast";
import Login from "./components/Login";
import Signup from "./components/Signup";
import SalespersonDashboard from "./components/Dashboard/SalespersonDashboard";
import DistributorDashboard from "./components/Dashboard/DistributorDashboard";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import { Button } from "./components/ui/button";
import { LogOut, LayoutDashboard, UserCircle, Zap } from "lucide-react";
import ProfileDrawer from "./components/ProfileDrawer";
// import { getAvatarUrl } from "./lib/getAvatarUrl";
import AppShellSkeleton from "./components/skeletons/AppShellSkeleton";
// import AppSkeleton from "./components/AppSkeleton";

const AppContent: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const [showSignup, setShowSignup] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  if (loading) {
    return <AppShellSkeleton />;
  }

  //   if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC]">
  //       <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
  //     </div>
  //   );
  // }

  // const { user, logout, loading } = useAuth();

  // if (loading) return null; // or global shell skeleton

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
    <div className="min-h-screen bg-[#020617] text-white">
      {/* Premium Sticky Header */}
      <header className="sticky top-0 z-40 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">
          {/* Left: Branding */}
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-black text-slate-900 uppercase tracking-tighter leading-none">
                B2B Order Hub
              </h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                Enterprise v2.0
              </span>
            </div>
          </div>

          {/* Right: User Profile & Logout */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 pr-6 border-r border-slate-100 hidden sm:flex">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 leading-none">
                  {user.name || user.email?.split("@")[0]}
                </p>
                <Badge className="mt-1 h-4 text-[9px] bg-slate-100 text-slate-500 border-none font-bold uppercase tracking-tight">
                  {user.role}
                </Badge>
              </div>
              <button
                onClick={() => setProfileOpen(true)}
                className="relative h-10 w-10 rounded-full overflow-hidden border border-slate-100 hover:ring-2 hover:ring-indigo-500 transition bg-slate-100 flex items-center justify-center"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserCircle className="w-6 h-6 text-indigo-500" />
                )}
              </button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="group text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-bold text-xs flex items-center gap-2"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {user.role === "Salesperson" && <SalespersonDashboard />}
        {user.role === "Distributor" && <DistributorDashboard />}
        {user.role === "Admin" && <AdminDashboard />}

        {/* Fallback */}
        {!["Salesperson", "Distributor", "Admin"].includes(user.role) && (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center p-10 bg-white rounded-3xl shadow-xl border border-red-50">
              <p className="text-red-500 font-black uppercase text-xs tracking-widest mb-2">
                Access Denied
              </p>
              <h2 className="text-2xl font-bold text-slate-900">
                Unknown Role: {String(user.role)}
              </h2>
              <p className="text-slate-500 mt-2">
                Please contact system administrator.
              </p>
            </div>
          </div>
        )}
      </main>
      {/* Profile Drawer */}
      <ProfileDrawer open={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
};

// Sub-component helper for the badge inside header if you don't want to import Badge from UI
const Badge = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 ${className}`}
  >
    {children}
  </span>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
    </AuthProvider>
  );
};

export default App;
