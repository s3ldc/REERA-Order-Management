import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
// import pb from "../lib/pocketbase";
import { ConvexReactClient } from "convex/react";
import { api } from "../../convex/_generated/api";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

interface User {
  id: string;
  email: string;
  role: "Salesperson" | "Distributor" | "Admin";
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signUp: (
    email: string,
    password: string,
    userData: { name: string; role: "Salesperson" | "Distributor" },
  ) => Promise<boolean>; // 👈 ADD THIS
  refreshUser: () => Promise<void>; // Optional, only if you implement it
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const normalizeAvatar = (avatar: unknown): string | undefined =>
    typeof avatar === "string" && avatar.length > 0 ? avatar : undefined;

  useEffect(() => {
    const restoreSession = async () => {
      const storedId = localStorage.getItem("session_user_id");

      if (!storedId) {
        setLoading(false);
        return;
      }

      try {
        const user = await convex.query(api.users.getUserById, {
          id: storedId as any,
        });

        if (!user) {
          localStorage.removeItem("session_user_id");
          setUser(null);
        } else {
          setUser({
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
          });
        }
      } catch (error) {
        console.error("Session restore failed", error);
        localStorage.removeItem("session_user_id");
        setUser(null);
      }

      setLoading(false);
    };

    restoreSession();
  }, []);

  // Restore session on page refresh
  // useEffect(() => {
  //   const restoreSession = async () => {
  //     if (pb.authStore.isValid && pb.authStore.model) {
  //       const model = pb.authStore.model as any;

  //       try {
  //         const fullUser = await pb.collection("users").getOne(model.id);

  //         const mappedUser: User = {
  //           id: fullUser.id,
  //           email: fullUser.email,
  //           name: fullUser.name || fullUser.email,
  //           role: fullUser.role,
  //           avatar: normalizeAvatar(fullUser.avatar),
  //         };

  //         setUser(mappedUser);
  //       } catch (err) {
  //         console.error("Failed to restore session", err);
  //         pb.authStore.clear();
  //         setUser(null);
  //       }
  //     }

  //     setLoading(false);
  //   };

  //   restoreSession();
  // }, []);

  // --- LOGIN ---
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await convex.action(api.auth.login, {
        email,
        password,
      });

      if (!result) return false;

      const mappedUser: User = {
        id: result._id,
        email: result.email,
        name: result.name,
        role: result.role,
        avatar: result.avatar,
      };

      setUser(mappedUser);
      localStorage.setItem("session_user_id", mappedUser.id);
      return true;
    } catch (err) {
      console.error("Login failed", err);
      return false;
    }
  };

  // --- LOGOUT ---
  const logout = () => {
    localStorage.removeItem("session_user_id");
    setUser(null);
  };

  // --- SIGN UP (Salesperson / Distributor only) ---
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

 const refreshUser = async () => {
  const storedId = localStorage.getItem("session_user_id");
  if (!storedId) return;

  const userData = await convex.query(api.users.getUserById, {
    id: storedId as any,
  });

  if (!userData) return;

  setUser({
    id: userData._id,
    email: userData.email,
    name: userData.name,
    role: userData.role,
    avatar: userData.avatar,
  });
};

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        signUp,
        loading, // 👈 ADD THIS
        refreshUser, // 👈 ADD THIS
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
