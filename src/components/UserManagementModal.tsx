import React, { useEffect, useState } from "react";
import pb from "../lib/pocketbase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Trash2, X, Mail, UserCircle2, Users } from "lucide-react";
import { useToast } from "../hooks/useToast";
// import { getAvatarUrl } from "@/lib/getAvatarUrl";

interface UserManagementModalProps {
  onClose: () => void;
}

interface PBUser {
  id: string;
  email: string;
  name: string;
  role: "Admin" | "Salesperson" | "Distributor";
  avatar?: string;
}

const UserManagementModal: React.FC<UserManagementModalProps> = ({
  onClose,
}) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<PBUser[]>([]);

  const fetchUsers = async () => {
    try {
      const records = await pb.collection("users").getFullList({
        sort: "created",
        filter: "role = 'Salesperson' || role = 'Distributor'",
      });
      const mapped: PBUser[] = records.map((r: any) => ({
        id: r.id,
        email: r.email,
        name: r.name,
        role: r.role,
        avatar:
          typeof r.avatar === "string" && r.avatar.length > 0
            ? r.avatar
            : undefined,
      }));
      setUsers(mapped);
    } catch (err) {
      console.error("Failed to fetch users", err);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (pb.authStore.isValid) fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    try {
      await pb.collection("users").delete(userId);
      toast({ title: "Success", description: "User removed from system" });
      await fetchUsers();
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      Admin: "bg-purple-100 text-purple-700 border-purple-200",
      Salesperson: "bg-blue-100 text-blue-700 border-blue-200",
      Distributor: "bg-emerald-100 text-emerald-700 border-emerald-200",
    };
    return (
      <Badge
        variant="outline"
        className={`font-bold border shadow-sm ${variants[role as keyof typeof variants]}`}
      >
        {role}
      </Badge>
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-none shadow-2xl bg-[#FAFBFC] rounded-3xl p-0">
        {/* Header */}
        <DialogHeader className="p-8 bg-white border-b border-slate-100 rounded-t-3xl sticky top-0 z-10">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-200">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-slate-900">
                  User Intelligence
                </DialogTitle>
                <DialogDescription className="text-slate-500 font-medium">
                  Review and manage institutional access roles
                </DialogDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5 text-slate-400" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-8 space-y-8">
          {/* Top Actions */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-slate-800">
                Directory
              </h3>
              <Badge
                variant="secondary"
                className="bg-slate-200 text-slate-600 border-none px-2.5 font-bold"
              >
                {users.length} Total
              </Badge>
            </div>
          </div>

          {/* Users List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user.id}
                  className="group flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl transition-all hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserCircle2 className="w-8 h-8 text-slate-300" />
                      )}
                    </div>

                    <div>
                      <p className="font-bold text-slate-900 leading-none mb-1.5">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 uppercase tracking-tight">
                        <Mail className="w-3 h-3" /> {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getRoleBadge(user.role)}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteUser(user.id)}
                      className="h-9 w-9 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">
                  No institutional members found.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserManagementModal;
