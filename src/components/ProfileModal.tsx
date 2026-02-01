import React from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { X, User } from "lucide-react";

const ProfileModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative animate-in fade-in zoom-in-95">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center border">
            <User className="w-8 h-8 text-indigo-500" />
          </div>
        </div>

        <h2 className="text-center text-xl font-bold text-slate-900 mb-6">
          Profile
        </h2>

        <div className="space-y-4 text-sm">
          <div>
            <p className="text-slate-400 uppercase text-xs font-bold">Name</p>
            <p className="font-medium text-slate-800">{user.name}</p>
          </div>

          <div>
            <p className="text-slate-400 uppercase text-xs font-bold">Email</p>
            <p className="font-medium text-slate-800">{user.email}</p>
          </div>

          <div>
            <p className="text-slate-400 uppercase text-xs font-bold">Role</p>
            <p className="font-medium text-slate-800">{user.role}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
