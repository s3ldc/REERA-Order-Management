import React from "react";
import { useEffect } from "react";
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
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc, Id } from "../../convex/_generated/dataModel";

interface UserManagementModalProps {
  onClose: () => void;
}

const UserManagementModal: React.FC<UserManagementModalProps> = ({
  onClose,
}) => {
  const { toast } = useToast();

  const users = useQuery(api.users.getAllNonAdminUsers) ?? [];
  const deleteUser = useMutation(api.users.deleteUser);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleDeleteUser = async (userId: Id<"users">) => {
    try {
      await deleteUser({ userId });

      toast({
        title: "Success",
        description: "User removed from system",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      Salesperson:
        "bg-blue-500/15 text-blue-400 border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-300",
      Distributor:
        "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300",
    };

    return (
      <Badge
        variant="outline"
        className={`font-bold border ${variants[role as keyof typeof variants]}`}
      >
        {role}
      </Badge>
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent
        className="
    w-[95vw]
    max-w-5xl
    max-h-[85vh]
    border-none
    shadow-2xl
    bg-background
    p-0
    rounded-3xl 
    flex
    flex-col
  "
      >
        {/* Header */}
        <DialogHeader className="p-5 sm:p-8 bg-card border-b border-border rounded-t-3xl sticky top-0 z-10">
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-primary p-2.5 sm:p-3 rounded-2xl shadow-md shadow-primary/20">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <div>
                <DialogTitle className="text-lg sm:text-2xl font-bold text-foreground">
                  User Intelligence
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm text-muted-foreground font-medium">
                  Review and manage institutional access roles
                </DialogDescription>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-muted h-9 w-9"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 sm:space-y-8">
          {/* Top Actions */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-foreground">
                Directory
              </h3>
              <Badge
                variant="secondary"
                className="bg-muted text-muted-foreground border-none px-2.5 font-bold"
              >
                {users.length} Total
              </Badge>
            </div>
          </div>

          {/* Users List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {users.length > 0 ? (
              users.map((user: Doc<"users">) => (
                <div
                  key={user._id}
                  className="
    group
    flex
    flex-col sm:flex-row
    sm:items-center
    sm:justify-between
    gap-4
    p-5
    bg-card
    border
    border-border
    rounded-2xl
    transition-all
    hover:shadow-md
  "
                >
                  {/* LEFT SECTION */}
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl overflow-hidden border border-border bg-muted flex items-center justify-center">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserCircle2 className="w-7 h-7 text-muted-foreground" />
                      )}
                    </div>

                    <div>
                      <p className="font-semibold text-foreground text-sm sm:text-base">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT SECTION */}
                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    {getRoleBadge(user.role)}

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteUser(user._id)}
                      className="
        h-8 w-8
        text-muted-foreground
        hover:text-destructive
        hover:bg-destructive/10
        transition-all
      "
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center bg-card rounded-3xl border border-dashed border-border">
                <p className="text-muted-foreground font-medium">
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
