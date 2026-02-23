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
import { Sun, Moon } from "lucide-react";
import { useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";

const AppContent: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const [showSignup, setShowSignup] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const getInitialTheme = (): "light" | "dark" => {
    const saved = localStorage.getItem("theme");
    return saved === "light" ? "light" : "dark";
  };

  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);
  const themeButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuItems = {
    Salesperson: ["Overview", "Analytics", "Orders", "Create Order"],
    Distributor: ["Overview", "Analytics", "Deliveries"],
    Admin: ["Overview", "Analytics", "Orders", "Users", "Filters"],
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";

    if (!("startViewTransition" in document)) {
      setTheme(newTheme);
      return;
    }

    const button = themeButtonRef.current;
    if (!button) {
      setTheme(newTheme);
      return;
    }

    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const transition = (document as any).startViewTransition(() => {
      setTheme(newTheme);
    });

    transition.ready.then(() => {
      const maxRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 700,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
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
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            {/* Hamburger — Mobile Only */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="sm:hidden p-2 rounded-lg hover:bg-muted transition"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="bg-primary p-2 rounded-xl">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>

            <div className="flex flex-col">
              <h1 className="text-sm font-black uppercase leading-none">
                B2B Order Hub
              </h1>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1 hidden sm:block">
                Enterprise v2.0
              </span>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Desktop Profile */}
            <div className="hidden sm:flex items-center gap-3 pr-6 border-r border-border">
              <div className="text-right">
                <p className="text-sm font-bold">
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
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserCircle className="w-6 h-6 text-primary" />
                )}
              </button>
            </div>

            {/* Theme Toggle */}
            <Button
              ref={themeButtonRef}
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="rounded-xl"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            {/* Logout — Desktop Only */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="hidden sm:flex font-bold text-xs items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="flex-1 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Animated Sidebar */}
          <div
            className="w-72 bg-card border-l border-border p-6 flex flex-col 
                    animate-in slide-in-from-right duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg">Menu</h2>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 flex-1">
              {menuItems[user.role as keyof typeof menuItems]?.map((item) => (
                <button
                  key={item}
                  className="block w-full text-left py-2 px-3 rounded-lg 
                 hover:bg-muted transition font-medium"
                  onClick={() => {
                    if (item === "Users") {
                      setShowUserModal(true);
                      setMobileMenuOpen(false);
                      return;
                    }

                    const id = item.toLowerCase().replace(/\s/g, "");
                    document
                      .getElementById(id)
                      ?.scrollIntoView({ behavior: "smooth" });
                    setMobileMenuOpen(false);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="pt-6 border-t border-border space-y-3">
              <button onClick={() => setProfileOpen(true)}>Profile</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}

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
