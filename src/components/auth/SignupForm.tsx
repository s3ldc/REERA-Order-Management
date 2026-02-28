import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Briefcase,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { useAuth } from "../../context/AuthContext";

type Role = "Salesperson" | "Distributor";

interface SignupFormProps {
  onBackToLogin: () => void;
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
        "flex h-11 w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2 text-sm text-white transition-all outline-none",
        "placeholder:text-slate-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10",
        className
      )}
      {...props}
    />
  );
}

const SignupForm: React.FC<SignupFormProps> = ({ onBackToLogin }) => {
  const { signUp } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Salesperson" as Role,
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Desktop 3D
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
    setSuccess(null);
    setIsLoading(true);

    const result = await signUp(formData.email, formData.password, {
      name: formData.name,
      role: formData.role,
    });

    if (!result) {
      setError("Credential registration failed");
      setIsLoading(false);
      return;
    }

    setSuccess("Account created successfully. Redirecting...");
    setTimeout(onBackToLogin, 1500);
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md"
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-4">
            <UserPlus className="w-3 h-3" />
            New Registration
          </div>

          <h3 className="text-3xl font-bold text-white">
            Create Profile
          </h3>

          <p className="text-slate-500 text-sm mt-2">
            Initialize your system credentials.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-slate-400 text-[10px] font-black uppercase ml-1 tracking-wider">
              Full Name
            </label>
            <div className="relative mt-2">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <Input
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="pl-12"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-slate-400 text-[10px] font-black uppercase ml-1 tracking-wider">
              Work Email
            </label>
            <div className="relative mt-2">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <Input
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="pl-12"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-slate-400 text-[10px] font-black uppercase ml-1 tracking-wider">
              Password
            </label>
            <div className="relative mt-2">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="pl-12 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="text-slate-400 text-[10px] font-black uppercase ml-1 tracking-wider">
              Operational Role
            </label>
            <div className="relative mt-2">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as Role })
                }
                className="flex h-11 w-full rounded-xl border border-slate-800 bg-slate-900/50 pl-12 pr-4 py-2 text-sm text-white transition-all outline-none appearance-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-bold"
              >
                <option className="bg-slate-900" value="Salesperson">
                  Salesperson
                </option>
                <option className="bg-slate-900" value="Distributor">
                  Distributor
                </option>
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs font-bold text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-xs font-bold text-center">
              {success}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Register Account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500">
            Already registered?{" "}
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-indigo-400 hover:text-indigo-300 font-bold"
            >
              Access Terminal
            </button>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SignupForm;