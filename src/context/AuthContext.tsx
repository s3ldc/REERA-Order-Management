import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc, Id } from "../../convex/_generated/dataModel";

type User = Doc<"users">;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signUp: (
    email: string,
    password: string,
    userData: { name: string; role: "Salesperson" | "Distributor" },
  ) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = "session_user_id";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const convex = useConvex();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Restore session on page refresh
   */
  useEffect(() => {
    const restoreSession = async () => {
      const storedId = localStorage.getItem(SESSION_KEY);

      if (!storedId) {
        setLoading(false);
        return;
      }

      try {
        const user = await convex.query(api.users.getUserById, {
          id: storedId as Id<"users">,
        });

        if (!user) {
          localStorage.removeItem(SESSION_KEY);
          setUser(null);
        } else {
          setUser(user);
        }
      } catch (error) {
        console.error("Session restore failed", error);
        localStorage.removeItem(SESSION_KEY);
        setUser(null);
      }

      setLoading(false);
    };

    restoreSession();
  }, [convex]);

  /**
   * Login
   */
  const login = async (
    email: string,
    password: string,
  ): Promise<boolean> => {
    try {
      const result = await convex.action(api.auth.login, {
        email,
        password,
      });

      if (!result) return false;

      const fullUser = await convex.query(api.users.getUserById, {
        id: result._id as Id<"users">,
      });

      if (!fullUser) return false;

      setUser(fullUser);
      localStorage.setItem(SESSION_KEY, fullUser._id);

      return true;
    } catch (err) {
      console.error("Login failed", err);
      return false;
    }
  };

  /**
   * Logout
   */
  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  /**
   * Signup
   */
  const signUp = async (
    email: string,
    password: string,
    userData: { name: string; role: "Salesperson" | "Distributor" },
  ): Promise<boolean> => {
    try {
      await convex.action(api.auth.createUser, {
        email,
        password,
        name: userData.name,
        role: userData.role,
        avatar: "",
      });

      return true;
    } catch (err) {
      console.error("Signup failed", err);
      return false;
    }
  };

  /**
   * Refresh user
   */
  const refreshUser = async () => {
    const storedId = localStorage.getItem(SESSION_KEY);
    if (!storedId) return;

    const userData = await convex.query(api.users.getUserById, {
      id: storedId as Id<"users">,
    });

    if (userData) {
      setUser(userData);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        signUp,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};