import React from "react";
import { Zap } from "lucide-react";

interface AuthBrandPanelProps {
  variant: "login" | "signup";
}

const AuthBrandPanel: React.FC<AuthBrandPanelProps> = ({ variant }) => {
  const isSignup = variant === "signup";

  return (
    <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-slate-800/50">
      
      {/* Background Effects */}
      <div
        className={`absolute inset-0 ${
          isSignup
            ? "bg-gradient-to-br from-indigo-500/10 via-transparent to-emerald-500/5"
            : "bg-gradient-to-tr from-indigo-500/10 via-transparent to-cyan-500/5"
        }`}
      />

      <div
        className={`absolute w-[500px] h-[500px] rounded-full blur-[120px] ${
          isSignup
            ? "bottom-[-10%] left-[-10%] bg-emerald-600/10"
            : "top-[-10%] right-[-10%] bg-indigo-600/20"
        }`}
      />

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg shadow-xl shadow-indigo-500/20">
          <Zap className="w-6 h-6 text-white fill-white" />
        </div>
        <span className="text-xl font-black text-white uppercase tracking-tighter">
          Core OS
        </span>
      </div>

      {/* Headline Section */}
      <div className="relative z-10">
        {isSignup ? (
          <>
            <h2 className="text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
              Join the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
                Future of B2B
              </span>
            </h2>

            <p className="mt-6 text-slate-400 text-lg max-w-md leading-relaxed">
              Create your institutional account to begin managing inventory,
              tracking distribution cycles, and scaling your sales operations.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
              Streamline your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                Supply Chain
              </span>
            </h2>

            <p className="mt-6 text-slate-400 text-lg max-w-md leading-relaxed">
              The next-generation B2B portal for modern distributors and sales
              teams. Automated ordering, real-time tracking, and role-based intelligence.
            </p>
          </>
        )}
      </div>

      {/* Footer Tag */}
      <div className="relative z-10 flex items-center gap-6 text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">
        {isSignup ? (
          <>
            <span>Institutional Registration</span>
            <div className="h-1 w-1 bg-slate-700 rounded-full" />
            <span>v2.0 Stable</span>
          </>
        ) : (
          <>
            <span>Security Protocol v4.0</span>
            <div className="h-1 w-1 bg-slate-700 rounded-full" />
            <span>Encrypted Gateway</span>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthBrandPanel;