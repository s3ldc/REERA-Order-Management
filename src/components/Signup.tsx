import React, { useState } from "react";
import pb from "../lib/pocketbase";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { UserPlus, Mail, Lock, Eye, EyeOff, ArrowRight, User, Briefcase } from "lucide-react";
import { cn } from "../lib/utils";

type Role = "Salesperson" | "Distributor";

interface SignupProps {
  onBackToLogin: () => void;
}

// Reusable custom input for the glass theme
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-10 w-full rounded-lg border bg-transparent px-3 py-1 text-sm shadow transition outline-none",
        "focus-visible:border-white/30 focus-visible:ring-2 focus-visible:ring-white/20",
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

  // 3D card effect logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

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
      await pb.collection("users").create({
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.password,
        name: formData.name,
        role: formData.role,
      });

      setSuccess("Account created successfully!");
      // Optional: auto redirect after success
      setTimeout(onBackToLogin, 2000);
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-black relative overflow-hidden flex items-center justify-center py-10">
      {/* Background Gradient matching Login */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/40 via-purple-700/50 to-black" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm relative z-10"
        style={{ perspective: 1500 }}
      >
        <motion.div
          className="relative"
          style={{ rotateX, rotateY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.05] shadow-2xl">
            
            {/* Header */}
            <div className="text-center space-y-1 mb-6">
              <div className="mx-auto w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Create Account</h1>
              <p className="text-white/60 text-xs">Join B2B Order Management</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  required
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Role Selection */}
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                  className="w-full h-10 pl-10 pr-3 rounded-lg border border-white/10 bg-white/5 text-white text-sm outline-none transition focus:ring-2 focus:ring-white/20 appearance-none"
                >
                  <option className="bg-zinc-900" value="Salesperson">Salesperson</option>
                  <option className="bg-zinc-900" value="Distributor">Distributor</option>
                </select>
              </div>

              {/* Feedback Messages */}
              {error && <div className="text-red-400 text-xs text-center">{error}</div>}
              {success && <div className="text-emerald-400 text-xs text-center">{success}</div>}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full mt-2"
              >
                <div className="relative overflow-hidden bg-white text-black font-medium h-10 rounded-lg flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-4 h-4 border-2 border-black/70 border-t-transparent rounded-full animate-spin"
                      />
                    ) : (
                      <motion.span
                        key="text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-1 text-sm font-bold"
                      >
                        Create Account
                        <ArrowRight className="w-3 h-3" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>

              {/* Back to Login */}
              <p className="text-center text-xs text-white/60 mt-4">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="text-white hover:underline font-medium"
                >
                  Sign in
                </button>
              </p>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;