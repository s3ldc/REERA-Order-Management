import React from "react";
import { useAuth } from "../context/AuthContext";
import AppShellSkeleton from "../components/skeletons/AppShellSkeleton";
import AppAuthGate from "./AppAuthGate";
import AppRouter from "./AppRouter";
import Header from "./layout/Header";

const AppShell: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <AppShellSkeleton />;
  }

  if (!user) {
    return <AppAuthGate />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <AppRouter />
    </div>
  );
};

export default AppShell;