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
    userData: { name: string; role: "Salesperson" | "Distributor" },
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
    const restoreSession = async () => {
      if (pb.authStore.isValid && pb.authStore.model) {
        const model = pb.authStore.model as any;

        // 🔴 HARD BLOCK SUPERUSER
        if (model.collectionName === "_superusers") {
          console.warn("Superuser session detected. Clearing.");
          pb.authStore.clear();
          setUser(null);
          setLoading(false);
          return;
        }

        try {
          const fullUser = await pb.collection("users").getOne(model.id);

          const mappedUser: User = {
            id: fullUser.id,
            email: fullUser.email,
            name: fullUser.name || fullUser.email,
            role: fullUser.role,
          };

          setUser(mappedUser);
        } catch (err) {
          console.error("Failed to restore session", err);
          pb.authStore.clear();
          setUser(null);
        }
      }

      setLoading(false);
    };

    restoreSession();
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
    userData: { name: string; role: "Salesperson" | "Distributor" },
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
