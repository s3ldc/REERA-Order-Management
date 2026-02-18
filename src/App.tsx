import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./hooks/useToast";
import Login from "./components/Login";
import Signup from "./components/Signup";
import SalespersonDashboard from "./components/Dashboard/SalespersonDashboard";
import DistributorDashboard from "./components/Dashboard/DistributorDashboard";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import { Button } from "./components/ui/button";
import { LogOut, UserCircle, Zap } from "lucide-react";
import ProfileDrawer from "./components/ProfileDrawer";
// import { getAvatarUrl } from "./lib/getAvatarUrl";
import AppShellSkeleton from "./components/skeletons/AppShellSkeleton";
// import AppSkeleton from "./components/AppSkeleton";
import { Sun, Moon } from "lucide-react";
import { useEffect } from "react";

const AppContent: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const [showSignup, setShowSignup] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;

    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      document.documentElement.classList.add("dark"); // default dark
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";

    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  if (loading) {
    return <AppShellSkeleton />;
  }


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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Premium Sticky Header */}
      <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">
          {/* Left: Branding */}
          <div className="flex items-center gap-4">
            <div className="bg-primary p-2 rounded-xl">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>

            <div className="flex flex-col">
              <h1 className="text-sm font-black text-foreground uppercase tracking-tighter leading-none">
                B2B Order Hub
              </h1>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
                Enterprise v2.0
              </span>
            </div>
          </div>

          {/* Right: User Profile & Logout */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 pr-6 border-r border-border hidden sm:flex">
              <div className="text-right">
                <p className="text-sm font-bold text-foreground leading-none">
                  {user.name || user.email?.split("@")[0]}
                </p>
                <Badge className="mt-1 h-4 text-[9px] bg-muted text-muted-foreground border-none font-bold uppercase tracking-tight">
                  {user.role}
                </Badge>
              </div>

              <button
                onClick={() => setProfileOpen(true)}
                className="relative h-10 w-10 rounded-full overflow-hidden border border-border hover:ring-2 hover:ring-primary transition bg-muted flex items-center justify-center"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserCircle className="w-6 h-6 text-primary" />
                )}
              </button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="rounded-xl text-muted-foreground hover:bg-muted transition-all"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="group text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all font-bold text-xs flex items-center gap-2"
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
            <div className="text-center p-10 bg-card text-card-foreground rounded-3xl shadow-xl border border-border">
              <p className="text-destructive font-black uppercase text-xs tracking-widest mb-2">
                Access Denied
              </p>
              <h2 className="text-2xl font-bold">
                Unknown Role: {String(user.role)}
              </h2>
              <p className="text-muted-foreground mt-2">
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
