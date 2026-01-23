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
  role: "salesperson" | "distributor" | "admin";
  name: string;
  distributorId?: string;
}

interface AuthContextType {
  user: User | null;
  users: User[]; // for admin panel
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signUp: (
    email: string,
    password: string,
    userData: Partial<User>,
  ) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  updateUser: (userId: string, updates: Partial<User>) => Promise<boolean>;
  refreshUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Restore session on page refresh
  useEffect(() => {
    const restoreSession = async () => {
      if (pb.authStore.isValid && pb.authStore.model) {
        const model = pb.authStore.model as any;

        // 🔴 CASE 1: Superuser login
        if (model.collectionName === "_superusers") {
          const mappedUser: User = {
            id: model.id,
            email: model.email,
            name: model.name || "Admin", // 🔧 FORCE DISPLAY NAME
            role: "admin", // internal role stays lowercase
          };

          setUser(mappedUser);
          setLoading(false);
          return;
        }

        // 🔵 CASE 2: Normal user from `users` collection
        const fullUser = await pb.collection("users").getOne(model.id);

        const roleMap: Record<number, "admin" | "salesperson" | "distributor"> =
          {
            0: "admin",
            1: "salesperson",
            2: "distributor",
          };

        const resolvedRole =
          typeof fullUser.role === "number"
            ? roleMap[fullUser.role]
            : fullUser.role;

        const mappedUser: User = {
          id: fullUser.id,
          email: fullUser.email,
          name: fullUser.name || fullUser.email,
          role: resolvedRole,
          distributorId: fullUser.distributor_id,
        };

        setUser(mappedUser);
      }

      setLoading(false);
    };

    restoreSession().catch((err) => {
      console.error("Restore session failed", err);
      setLoading(false);
    });
  }, []);

  // --- LOGIN ---
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const authData = await pb
        .collection("users")
        .authWithPassword(email, password);

      const model = pb.authStore.model as any;

      // 🔴 CASE 1: Superuser
      if (model.collectionName === "_superusers") {
        const mappedUser: User = {
          id: model.id,
          email: model.email,
          name: model.name || "Admin",
          role: "admin",
        };

        setUser(mappedUser);
        return true;
      }

      // 🔵 CASE 2: Normal user
      const fullUser = await pb.collection("users").getOne(model.id);

      const roleMap: Record<number, "admin" | "salesperson" | "distributor"> = {
        0: "admin",
        1: "salesperson",
        2: "distributor",
      };

      const resolvedRole =
        typeof fullUser.role === "number"
          ? roleMap[fullUser.role]
          : fullUser.role;

      const mappedUser: User = {
        id: fullUser.id,
        email: fullUser.email,
        name: fullUser.name || fullUser.email,
        role: resolvedRole,
        distributorId: fullUser.distributor_id,
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
    userData: Partial<User>,
  ): Promise<boolean> => {
    try {
      await pb.collection("users").create({
        email,
        password,
        passwordConfirm: password,
        name: userData.name,
        role: userData.role || "salesperson", // never admin from UI
        distributor_id: userData.distributorId || null,
      });

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // --- ADMIN: FETCH ALL USERS ---
  const refreshUsers = async () => {
    try {
      const records = await pb.collection("users").getFullList({
        sort: "created",
      });

      const mapped: User[] = records.map((r: any) => ({
        id: r.id,
        email: r.email,
        name: r.name,
        role: r.role,
        distributorId: r.distributor_id,
      }));

      setUsers(mapped);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  // --- ADMIN: DELETE USER ---
  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      await pb.collection("users").delete(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // --- ADMIN: UPDATE USER ---
  const updateUser = async (
    userId: string,
    updates: Partial<User>,
  ): Promise<boolean> => {
    try {
      const updated = await pb.collection("users").update(userId, {
        name: updates.name,
        role: updates.role,
        distributor_id: updates.distributorId || null,
      });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                name: updated.name,
                role: updated.role,
                distributorId: updated.distributor_id,
              }
            : u,
        ),
      );

      // Update current user if same
      if (user && user.id === userId) {
        const updatedUser = {
          ...user,
          name: updated.name,
          role: updated.role,
          distributorId: updated.distributor_id,
        };
        setUser(updatedUser);
      }

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        login,
        logout,
        signUp,
        deleteUser,
        updateUser,
        refreshUsers,
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
