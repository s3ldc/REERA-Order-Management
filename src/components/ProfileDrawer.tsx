import { X, UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface ProfileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ open, onClose }) => {
  const { user } = useAuth();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-slate-900">Profile</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-slate-500 hover:text-slate-900" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center">
              <UserCircle className="w-16 h-16 text-slate-400" />
            </div>

            <div className="text-center">
              <p className="text-lg font-bold text-slate-900">
                {user?.name || "Unnamed User"}
              </p>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">
                Role
              </label>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {user?.role}
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">
                User ID
              </label>
              <p className="mt-1 text-xs text-slate-400 break-all">
                {user?.id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDrawer;
