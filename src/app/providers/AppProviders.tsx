import React from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { AuthProvider } from "../../context/AuthContext";
import { ToastProvider } from "../../hooks/useToast";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

interface Props {
  children: React.ReactNode;
}

const AppProviders: React.FC<Props> = ({ children }) => {
  return (
    <ConvexProvider client={convex}>
      <AuthProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthProvider>
    </ConvexProvider>
  );
};

export default AppProviders;