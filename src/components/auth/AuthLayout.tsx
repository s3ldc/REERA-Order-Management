import React from "react";
import AuthBrandPanel from "./AuthBrandPanel";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="h-[100dvh] w-full bg-[#020617] flex overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* Left Brand Panel (Desktop Only) */}
      <AuthBrandPanel />

      {/* Right Content */}
      <div className="flex-1 flex items-center justify-center px-6 pt-12 pb-8 sm:p-10 relative">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;