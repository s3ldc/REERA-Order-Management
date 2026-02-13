import React, { useState } from "react";
// import pb from "../lib/pocketbase";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { UserPlus, Mail, Lock, Eye, EyeOff, ArrowRight, User, Briefcase, Zap, ShieldCheck } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

type Role = "Salesperson" | "Distributor";

interface SignupProps {
  onBackToLogin: () => void;
}

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
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

const Signup: React.FC<SignupProps> = ({ onBackToLogin }) => {
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
  const createUser = useAction(api.users.createUser);

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
  setSuccess(null);
  setIsLoading(true);

  try {
    await createUser({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      role: formData.role,
      avatar: "",
    });

    setSuccess("Account created successfully. Redirecting...");
    setTimeout(onBackToLogin, 1500);
  } catch (err: any) {
    setError("Credential registration failed");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen w-full bg-[#020617] flex overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* Left Decoration - Brand Side */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-slate-800/50">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-emerald-500/5" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px]" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-xl shadow-indigo-500/20">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <span className="text-xl font-black text-white uppercase tracking-tighter">Core OS</span>
        </div>

        <div className="relative z-10">
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
        </div>

        <div className="relative z-10 flex items-center gap-6 text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">
          <span>Institutional Registration</span>
          <div className="h-1 w-1 bg-slate-700 rounded-full" />
          <span>v2.0 Stable</span>
        </div>
      </div>

      {/* Right Content - Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-y-auto">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-[10%] right-[10%] w-[300px] h-[300px] bg-emerald-500/20 rounded-full blur-[80px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
          style={{ perspective: 1200 }}
        >
          <motion.div
            style={{ rotateX, rotateY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="bg-slate-900/40 backdrop-blur-2xl rounded-3xl p-10 border border-slate-800 shadow-2xl"
          >
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                <UserPlus className="w-3 h-3" />
                New Registration
              </div>
              <h3 className="text-3xl font-bold text-white tracking-tight">Create Profile</h3>
              <p className="text-slate-500 text-sm mt-2 font-medium">Initialize your system credentials.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-slate-400 text-[10px] font-black uppercase ml-1 tracking-wider">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 text-[10px] font-black uppercase ml-1 tracking-wider">Work Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                  <Input
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 text-[10px] font-black uppercase ml-1 tracking-wider">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-12 pr-12"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 text-[10px] font-black uppercase ml-1 tracking-wider">Operational Role</label>
                <div className="relative group">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors pointer-events-none" />
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                    className="flex h-11 w-full rounded-xl border border-slate-800 bg-slate-900/50 pl-12 pr-4 py-2 text-sm text-white transition-all outline-none appearance-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-bold"
                  >
                    <option className="bg-slate-900" value="Salesperson">Salesperson</option>
                    <option className="bg-slate-900" value="Distributor">Distributor</option>
                  </select>
                </div>
              </div>

              {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs font-bold text-center animate-in fade-in slide-in-from-top-1">{error}</div>}
              {success && <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-xs font-bold text-center animate-in fade-in slide-in-from-top-1">{success}</div>}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Register Account <ArrowRight className="w-4 h-4" /></>}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-500 font-medium">
                Already registered?{" "}
                <button type="button" onClick={onBackToLogin} className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors ml-1">
                  Access Terminal
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;