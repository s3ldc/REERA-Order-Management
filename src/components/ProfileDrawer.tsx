import React, { useState } from "react";
import {
  X,
  UserCircle,
  Camera,
  Mail,
  ShieldCheck,
  LogOut,
  Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import pb from "../lib/pocketbase";
import { getAvatarUrl } from "../lib/getAvatarUrl";
import { Button } from "./ui/button"; // Assuming you have a standard SaaS button component
import { Badge } from "./ui/badge"; // Assuming you have a badge component for roles

interface ProfileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ open, onClose }) => {
  const { user, refreshUser, logout } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const avatarUrl = user?.avatar ? getAvatarUrl(user, 160) : "";

  if (!open) return null;

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("avatar", file);

      await pb.collection("users").update(user.id, formData);
      await refreshUser();
    } catch (err) {
      console.error("Avatar upload failed", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
      {/* Backdrop with higher quality blur */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-500 ease-in-out"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full sm:w-[400px] bg-white shadow-[0_0_50px_-12px_rgba(0,0,0,0.25)] flex flex-col transform transition-transform duration-300 ease-out animate-in slide-in-from-right">
        {/* Modern Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
              Account Settings
            </h2>
            <p className="text-sm font-bold text-slate-900">Personal Profile</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-200 transition-all"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10">
          {/* Avatar Section with Pulse Loading */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div
                className={`h-28 w-28 rounded-3xl bg-slate-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl transition-all ${isUploading ? "opacity-50" : "group-hover:ring-4 group-hover:ring-blue-50"}`}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserCircle className="w-16 h-16 text-slate-300" />
                )}

                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  </div>
                )}
              </div>

              {!isUploading && (
                <label className="absolute -bottom-2 -right-2 bg-blue-600 p-2.5 rounded-2xl shadow-lg cursor-pointer hover:bg-blue-700 hover:scale-110 transition-all border-2 border-white">
                  <Camera className="w-4 h-4 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </label>
              )}
            </div>
            <div className="mt-4 text-center">
              <h3 className="font-black text-slate-900 text-lg">
                {user?.name}
              </h3>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                {user?.role} · Active
              </p>

              {/* <p className="text-xs font-medium text-slate-400 mt-0.5">{user?.email}</p> */}
            </div>
          </div>

          {/* Core Info - Data Grid Layout */}
          <div className="grid gap-6">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">
              Information
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-blue-50 rounded-xl">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Registered Email
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-emerald-50 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Access Role
                  </p>
                  <Badge
                    className="
    bg-emerald-100 text-emerald-700 border-none
    px-2 py-0 text-[10px] uppercase font-black
    transition-all duration-200
    hover:bg-emerald-600 hover:text-white hover:shadow-sm
  "
                  >
                    {user?.role}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Standard for SaaS */}
          <div className="grid gap-3 pt-4">
            {/* <Button variant="outline" className="w-full justify-start gap-3 h-12 rounded-2xl border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition-all">
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-bold text-slate-700">Security & Password</span>
             </Button> */}
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          {/* <Button 
            onClick={logout}
            className="w-full h-12 rounded-2xl bg-white border border-red-100 hover:bg-red-50 text-red-600 font-bold transition-all gap-2 group shadow-sm"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </Button> */}
          <p className="text-center text-[10px] text-slate-400 mt-4 font-medium uppercase tracking-tight">
            <p className="text-center text-[10px] text-slate-400 font-medium uppercase tracking-wide">
              🔒 Enterprise ID:{" "}
              <span className="font-mono">{user?.id.slice(0, 8)}</span> ·
              Managed Identity
            </p>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileDrawer;
