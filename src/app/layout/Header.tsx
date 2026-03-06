import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { LogOut, UserCircle, Zap, Sun, Moon } from "lucide-react";
import ProfileDrawer from "../../components/ProfileDrawer";

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);

  const getInitialTheme = (): "light" | "dark" => {
    const saved = localStorage.getItem("theme");
    return saved === "light" ? "light" : "dark";
  };

  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);
  const themeButtonRef = useRef<HTMLButtonElement | null>(null);

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

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* LEFT SIDE */}
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl shrink-0">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </div>

            <div className="flex flex-col">
              <h1 className="text-xs sm:text-sm font-black uppercase tracking-tight leading-none">
                B2B Order Hub
              </h1>
              <span className="hidden sm:block text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
                Enterprise v2.0
              </span>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Desktop User */}
            <div className="hidden md:flex items-center gap-3 pr-4 border-r border-border">
              <div className="text-right">
                <p className="text-sm font-bold leading-none">
                  {user?.name || user?.email?.split("@")[0]}
                </p>
                <Badge className="mt-1 h-4 text-[9px] bg-muted text-muted-foreground border-none font-bold uppercase tracking-tight">
                  {user?.role}
                </Badge>
              </div>

              <button
                onClick={() => setProfileOpen(true)}
                className="relative h-9 w-9 rounded-full overflow-hidden border border-border hover:ring-2 hover:ring-primary transition bg-muted flex items-center justify-center"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserCircle className="w-5 h-5 text-primary" />
                )}
              </button>
            </div>

            {/* Mobile Avatar */}
            <button
              onClick={() => setProfileOpen(true)}
              className="md:hidden relative h-9 w-9 rounded-full overflow-hidden border border-border bg-muted flex items-center justify-center"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserCircle className="w-5 h-5 text-primary" />
              )}
            </button>

            {/* Theme */}
            <Button
              ref={themeButtonRef}
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-xl"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            {/* Logout */}
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="group text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4 sm:mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline text-xs font-bold">
                Logout
              </span>
            </Button>
          </div>
        </div>
      </header>

      <ProfileDrawer open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
};

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

export default Header;