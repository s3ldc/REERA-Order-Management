import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface LoginFormProps {
  onShowSignup: () => void;
}

function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 sm:h-12 text-base sm:text-sm w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2 text-white transition-all outline-none",
        "placeholder:text-slate-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10",
        className
      )}
      {...props}
    />
  );
}

const LoginForm: React.FC<LoginFormProps> = ({ onShowSignup }) => {
  const { login } = useAuth();
  const loginAction = useAction(api.auth.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(media.matches);
    const listener = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await loginAction({ email, password });

      if (!result) {
        setError("Invalid credentials provided.");
        setIsLoading(false);
        return;
      }

      await login(email, password);
    } catch {
      setError("Authentication failed.");
    }

    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-sm sm:max-w-md"
      style={{ perspective: 1200 }}
    >
      <motion.div
        style={isDesktop ? { rotateX, rotateY } : {}}
        {...(isDesktop && {
          onMouseMove: handleMouseMove,
          onMouseLeave: handleMouseLeave,
        })}
        className="bg-slate-900/40 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-slate-800/60 shadow-2xl shadow-indigo-500/10"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-white">Core OS</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-4">
            <ShieldCheck className="w-3 h-3" />
            Secure Terminal
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Identity Access
          </h3>

          <p className="text-slate-500 text-sm mt-2 font-medium">
            Please authenticate to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-slate-400 text-[10px] font-black uppercase ml-1 tracking-wider">
              Work Email
            </label>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
              <Input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-slate-400 text-[10px] font-black uppercase ml-1 tracking-wider">
              Password
            </label>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs font-bold text-center"
            >
              {error}
            </motion.div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 text-[15px] sm:text-sm rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Authorize Access
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500 font-medium">
            New to the platform?{" "}
            <button
              type="button"
              onClick={onShowSignup}
              className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors ml-1"
            >
              Request Credentials
            </button>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginForm;