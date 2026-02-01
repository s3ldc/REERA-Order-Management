import { X, UserCircle, Camera } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import pb from "../lib/pocketbase";
import { getAvatarUrl } from "../lib/getAvatarUrl";

interface ProfileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ open, onClose }) => {
  const { user } = useAuth();

  const avatarUrl = user?.avatar
    ? getAvatarUrl(user.id, user.avatar, 160)
    : null;

  if (!open) return null;

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      await pb.collection("users").update(user.id, formData);
      await pb.collection("users").authRefresh();

      window.location.reload(); // safe & simple for now
    } catch (err) {
      console.error("Avatar upload failed", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full sm:w-[360px] bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Profile
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-slate-500 hover:text-slate-900" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 flex-1 space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <label className="relative group cursor-pointer">
              <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserCircle className="w-16 h-16 text-slate-400" />
                )}
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </label>

            <p className="text-xs text-slate-500">
              Click to change profile photo
            </p>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <InfoRow label="Name" value={user?.name || "—"} />
            <InfoRow label="Email" value={user?.email || "—"} />
            <InfoRow label="Role">
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                {user?.role}
              </span>
            </InfoRow>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t text-xs text-slate-400">
          Profile details are managed by the system
        </div>
      </div>
    </div>
  );
};

export default ProfileDrawer;

/* ---------- Helper ---------- */

const InfoRow = ({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
      {label}
    </span>
    {children || (
      <span className="text-sm font-medium text-slate-900">{value}</span>
    )}
  </div>
);
