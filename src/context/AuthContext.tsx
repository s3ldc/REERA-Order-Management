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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const normalizeAvatar = (avatar: unknown): string | undefined =>
    typeof avatar === "string" && avatar.length > 0 ? avatar : undefined;

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
  const login = async (email: string, _password: string): Promise<boolean> => {
    try {
      const users = await convex.query(api.users.getUsers);

      const foundUser = users.find((u: any) => u.email === email);

      if (!foundUser) return false;

      const mappedUser: User = {
        id: foundUser._id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        avatar: foundUser.avatar,
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
  setUser(null);
};

  // --- SIGN UP (Salesperson / Distributor only) ---
const signUp = async (
  email: string,
  password: string,
  userData: { name: string; role: "Salesperson" | "Distributor" }
): Promise<boolean> => {
  try {
    await convex.mutation(api.users.createUser, {
      email,
      password, // ✅ add this
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

  // const refreshUser = async () => {
  //   if (!pb.authStore.isValid || !pb.authStore.model) return;

  //   const fullUser = await pb.collection("users").getOne(pb.authStore.model.id);

  //   const mappedUser: User = {
  //     id: fullUser.id,
  //     email: fullUser.email,
  //     name: fullUser.name || fullUser.email,
  //     role: fullUser.role,
  //     avatar: normalizeAvatar(fullUser.avatar),
  //   };

  //   setUser(mappedUser);
  // };

  // if (loading) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        signUp,
        loading, // 👈 ADD THIS
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
