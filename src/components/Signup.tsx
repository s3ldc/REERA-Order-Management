import React, { useState } from "react";
import pb from "../lib/pocketbase";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { UserPlus, Eye, EyeOff } from "lucide-react";

type Role = "Salesperson" | "Distributor";

const Signup: React.FC<{ onBackToLogin: () => void }> = ({ onBackToLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Salesperson" as Role,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const user = await pb.collection("users").create({
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.password,
        name: formData.name,
        role: formData.role, // salesperson or distributor
      });

      setSuccess("Account created successfully. You can now sign in.");
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Signup failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <UserPlus className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign up as a Salesperson or Distributor
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Fill in the details to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Enter your password"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as Role,
                    })
                  }
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Salesperson">Salesperson</option>
                  <option value="Distributor">Distributor</option>
                </select>
              </div>

              {error && <div className="text-red-600 text-sm">{error}</div>}
              {success && (
                <div className="text-green-600 text-sm">{success}</div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={onBackToLogin}
                className="text-sm text-blue-600 hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
