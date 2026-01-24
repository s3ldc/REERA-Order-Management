import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import pb from "../lib/pocketbase";

interface User {
  id: string;
  email: string;
  role: "Salesperson" | "Distributor" | "Admin";
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signUp: (
    email: string,
    password: string,
    userData: { name: string; role: "Salesperson" | "Distributor" }
  ) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on page refresh
  useEffect(() => {
    if (pb.authStore.isValid && pb.authStore.model) {
      const model = pb.authStore.model as any;

      const mappedUser: User = {
        id: model.id,
        email: model.email,
        name: model.name || model.email,
        role: model.role, // must be "admin" | "salesperson" | "distributor"
      };

      setUser(mappedUser);
    }

    setLoading(false);
  }, []);

  // --- LOGIN ---
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const authData = await pb
        .collection("users")
        .authWithPassword(email, password);

      const record = authData.record as any;

      const mappedUser: User = {
        id: record.id,
        email: record.email,
        name: record.name || record.email,
        role: record.role,
      };

      setUser(mappedUser);
      return true;
    } catch (err) {
      console.error("Login failed", err);
      return false;
    }
  };

  // --- LOGOUT ---
  const logout = () => {
    pb.authStore.clear();
    setUser(null);
  };

  // --- SIGN UP (Salesperson / Distributor only) ---
  const signUp = async (
    email: string,
    password: string,
    userData: { name: string; role: "Salesperson" | "Distributor" }
  ): Promise<boolean> => {
    try {
      await pb.collection("users").create({
        email,
        password,
        passwordConfirm: password,
        name: userData.name,
        role: userData.role, // NEVER admin from UI
      });

      return true;
    } catch (err) {
      console.error("Signup failed", err);
      return false;
    }
  };

  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};