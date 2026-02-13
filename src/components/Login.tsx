import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { useMutation } from "convex/react";
// import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface LoginProps {
  onShowSignup: () => void;
}

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2 text-sm text-white transition-all outline-none",
        "placeholder:text-slate-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10",
        className,
      )}
      {...props}
    />
  );
}

const Login: React.FC<LoginProps> = ({ onShowSignup }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  // const user = useQuery(api.auth.login, email ? { email } : "skip");
  const loginMutation = useMutation(api.auth.login);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 3D Card Effect Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

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
    const result = await loginMutation({
      email,
      password,
    });

    if (!result) {
      setError("Invalid credentials provided.");
      setIsLoading(false);
      return;
    }

    await login(email, password); // update AuthContext state

  } catch (err) {
    setError("Authentication failed.");
  }

  setIsLoading(false);
};

  return (
    <div className="min-h-screen w-full bg-[#020617] flex overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* Left Decoration: Brand & Social Proof */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-slate-800/50">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-cyan-500/5" />
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-xl shadow-indigo-500/20">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <span className="text-xl font-black text-white uppercase tracking-tighter">
            Core OS
          </span>
        </div>

        <div className="relative z-10">
          <h2 className="text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
            Streamline your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              Supply Chain
            </span>
          </h2>
          <p className="mt-6 text-slate-400 text-lg max-w-md leading-relaxed">
            The next-generation B2B portal for modern distributors and sales
            teams. Automated ordering, real-time tracking, and role-based
            intelligence.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">
          <span>Security Protocol v4.0</span>
          <div className="h-1 w-1 bg-slate-700 rounded-full" />
          <span>Encrypted Gateway</span>
        </div>
      </div>

      {/* Right Content: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] bg-indigo-500/20 rounded-full blur-[80px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
          style={{ perspective: 1200 }}
        >
          <motion.div
            style={{ rotateX, rotateY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="bg-slate-900/40 backdrop-blur-2xl rounded-3xl p-10 border border-slate-800 shadow-2xl"
          >
            {/* Form Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                <ShieldCheck className="w-3 h-3" />
                Secure Terminal
              </div>
              <h3 className="text-3xl font-bold text-white tracking-tight">
                Identity Access
              </h3>
              <p className="text-slate-500 text-sm mt-2 font-medium">
                Please authenticate to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-slate-400 text-xs font-bold uppercase ml-1">
                  Work Email
                </Label>
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

              <div className="space-y-2">
                <Label className="text-slate-400 text-xs font-bold uppercase ml-1">
                  Password
                </Label>
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
                className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
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
      </div>
    </div>
  );
};

// Helper for consistency
const Label = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <label className={cn("block", className)}>{children}</label>;

export default Login;
